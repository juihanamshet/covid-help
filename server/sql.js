var Connection = require('tedious').Connection;

var config = {
    server: 'your_server.database.windows.net',  //TODO: update me
    authentication: {
        type: 'default',
        options: {
            userName: 'your_username', //TODO: update me
            password: 'your_password'  //TODO: update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'your_database'  //TODO: update me
    }
};


var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    console.log("Connected");
});


var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;


function getOffers(school) {
    // get data from SQL DB
    request = new Request("SELECT firstName, lastName, prefEmail, phoneNumber, addressLineOne, addressLineTwo, city, state, zipcode, facebook, linkedin, instagram, housingRules, lgbtqp, accessibilityFriendly, preferredContact, transFriendly, accessibilityInfo FROM UserTable WHERE school = @School AND disabledAcct = 0;", function (err) {
        if (err) {
            console.log(err);
        }
    });
    request.addParameter('School', TYPES.VarChar, school);
    var result = "";
    request.on('row', function (columns) {
        // TODO: return this
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}

module.exports = { getOffers }