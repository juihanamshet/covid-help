var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

require('dotenv').config()

var config = {
    server: 'covid19mutualaid.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASS
        }
    },
    options: {
        encrypt: true,
        database: 'covid19mutualaid',
        useColumnNames: true,
    }
};


var connection = new Connection(config);
connection.on('connect', function (err) {
    console.log("Connected");
});


function getSchoolListings(school, callback) {
    var result = []
    var code = 200;

    request = new Request("SELECT listingID, userTable.userID, listingName, zipCode, prefEmail, grad_year, city, state, lgbtqpFriendly, accessibilityFriendly  FROM listingTable JOIN userTable on (listingTable.userID = userTable.userID) AND org='duke' WHERE disabledAcct = 0", function (err, rowCount) {
        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
    });
    request.addParameter('School', TYPES.VarChar, school);

    request.on('row', function (columns) {
        listing = {}
        for (var name in columns) {
            listing[name] = columns[name].value
        }
        result.push(listing)
    });

    request.on('requestCompleted', function () {
        callback(result, code)
    });

    request.on('error', (err) => {
        console.error(err);
        listingData = "Internal Server Error"
        code = 500;
    })

    connection.execSql(request);
}


function getListing(email, listing, school, callback) {
    var result = []
    var code = 200;

    request = new Request(" SELECT * FROM listingTable JOIN userTable on (listingTable.userID = userTable.userID) WHERE listingTable.listingID = @ListingID AND org=@School;", function (err, rowCount) {
        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
        if (rowCount === 0) {
            result = "Internal Server Error"
            code = 500;
            console.error(email + " attempted access for listingID=" + listing + " with school=" + school);
        }
    });

    request.addParameter('ListingID', TYPES.Int, listing);
    request.addParameter('School', TYPES.VarChar, school);

    request.on('row', function (columns) {
        listing = {}
        for (var name in columns) {
            listing[name] = columns[name].value
        }
        result.push(listing)
    });

    request.on('requestCompleted', function () {
        callback(result, code)
    });

    request.on('error', (err) => {
        console.error(err);
        result = "Internal Server Error"
        code = 500;
    })

    connection.execSql(request);
}

module.exports = { getSchoolListings, getListing }