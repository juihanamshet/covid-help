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

function getUserID(email, callback) {
    var result = "";
    var code = 200

    sqlQuery = "SELECT userID FROM userTable WHERE orgEmail=@Email"

    request = new Request(sqlQuery, function (err, rowCount) {
        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
        if (rowCount == 0) {
            console.error("User with email " + email + " was not Found")
            result = "User Not Found";
            code = 500;
        }
    });

    request.addParameter('Email', TYPES.VarChar, email);

    request.on('row', function (columns) {
        result = columns['userID'].value;
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


function getSchoolListings(email, school, callback) {
    var result = []
    var code = 200;

    sqlQuery =
        "SELECT listingID, userTable.userID, listingName, \
        zipCode, prefEmail, grad_year, city, state  \
        FROM listingTable JOIN userTable \
        ON (listingTable.userID = userTable.userID) \
        WHERE disabledAcct = 0 AND orgEmail != @Email AND org=@School";

    request = new Request(sqlQuery, function (err, rowCount) {

        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
    });
    request.addParameter('School', TYPES.VarChar, school);
    request.addParameter('Email', TYPES.VarChar, email);


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

function getUsersListings(email, school, callback) {
    var result = []
    var code = 200;

    sqlQuery =
        "SELECT listingID, userTable.userID, listingName, \
        zipCode, prefEmail, grad_year, city, state  \
        FROM listingTable JOIN userTable \
        ON (listingTable.userID = userTable.userID) \
        WHERE disabledAcct = 0 AND orgEmail=@Email AND org=@School";

    request = new Request(sqlQuery, function (err, rowCount) {
        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
    });
    request.addParameter('School', TYPES.VarChar, school);
    request.addParameter('Email', TYPES.VarChar, email);


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

    sqlQuery =
        "SELECT * \
        FROM listingTable JOIN userTable \
        ON (listingTable.userID = userTable.userID) \
        WHERE listingTable.listingID = @ListingID AND org=@School;"

    request = new Request(sqlQuery, function (err, rowCount) {
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

function createListing(listingInfo, callback) {
    code = 200;

    sqlQuery =
        "INSERT INTO listingTable (userID, addressLineOne, addressLineTwo, city, state, zipCode, neighborhood, housingRules, accessbilityInfo, listingName, livingSituation)\
        VALUES(@UserID, @AddressLineOne, @AddressLineTwo, @City, @State, @ZipCode, @Neighborhood, @HousingRules, @AccessInfo, @ListingName, @LivingSituation);"

    request = new Request(sqlQuery, function (err, rowCount) {
        if (err) {
            console.error(err);
            result = "Internal Server Error"
            code = 500;
        }
    });

    request.addParameter('UserID', TYPES.Int, listingInfo.userID);
    request.addParameter('AddressLineOne', TYPES.VarChar, listingInfo.addressLineOne);
    request.addParameter('AddressLineTwo', TYPES.VarChar, listingInfo.addressLineTwo);
    request.addParameter('City', TYPES.VarChar, listingInfo.city);
    request.addParameter('State', TYPES.VarChar, listingInfo.state);
    request.addParameter('ZipCode', TYPES.Int, listingInfo.zipCode);
    request.addParameter('Neighborhood', TYPES.VarChar, listingInfo.neighborhood);
    request.addParameter('HousingRules', TYPES.VarChar, listingInfo.housingRules);
    request.addParameter('AccessInfo', TYPES.VarChar, listingInfo.accessibilityInfo);
    request.addParameter('ListingName', TYPES.VarChar, listingInfo.listingName);
    request.addParameter('LivingSituation', TYPES.VarChar, listingInfo.livingSituation);


    request.on('requestCompleted', function () {
        callback("Success", code)
    });

    request.on('error', (err) => {
        console.error(err);
        result = "Internal Server Error"
        code = 500;
    })

    connection.execSql(request);
}

function createListingHandler(email, listingInfo, callback) {
    status = 200
    getUserID(email, (userID, userIDstatus) => {
        if (userIDstatus != 200) {
            callback(userID, userIDstatus)
        } else {
            console.log('userID')
            listingInfo['userID'] = userID;
            console.log(listingInfo)
            createListing(listingInfo, (successMsg, status) => {
                if (status == 200) {
                    callback(successMsg, 200)
                }
                else {
                    callback("Error updating user", 500);
                }
            })
        }
    })
}

module.exports = { getSchoolListings, getUsersListings, getListing, createListingHandler, getUserID }