var Connection = require('tedious').Connection;
require('dotenv').config()

var config = {
    server: 'covid19mutualaid.database.windows.net',  //TODO: update me
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER, //TODO: update me
            password: process.env.DB_PASS  //TODO: update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'covid19mutualaid',  //TODO: update me
        rowCollectionOnRequestCompletion: true,
        useColumnNames: true,
    }
};


var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
});


var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


function getSchoolListings(school, callback) {
    // get data from SQL DB
    // to add into sql statement: school=@School
    var listingData = []

    request = new Request("SELECT listingID, ownerID, listingName, zipCode, prefEmail, grad_year, city, state  FROM listingTable JOIN userTable on (listingTable.userID = userTable.userID) AND org=@School WHERE disabledAcct = 0", function (err, rowCount) {
        if (err) {
            console.log(err);
        }
        else {
            if (rowCount > 0) {
                callback(listingData, 200)
            }
        }
    });
    request.addParameter('School', TYPES.VarChar, school);
    // var result = "";
    request.on('row', function (columns) {
        listing = {}
        for (var name in columns) {
            listing[name] = columns[name].value
        }
        listingData.push(listing)
    });

    request.on('done', function (rowCount, more) {
        console.log("Done")
    });
    connection.execSql(request);
}

function getUserListings(user) {

}

function getListing(callback) {
    var listingData = []

    request = new Request(" SELECT *  FROM listingTable JOIN userTable on (listingTable.userID = userTable.userID) WHERE listingTable.listingID = 1;", function (err, rowCount) {
        if (err) {
            console.log(err);
        }
        else {
            if (rowCount > 0) {
                callback(listingData, 200)
            }
        }
    });
    // var result = "";
    request.on('row', function (columns) {
        listing = {}
        for (var name in columns) {
            listing[name] = columns[name].value
        }
        listingData.push(listing)
    });

    request.on('done', function (rowCount, more) {
        console.log("Done")
    });
    connection.execSql(request);
}

module.exports = { getSchoolListings, getListing }