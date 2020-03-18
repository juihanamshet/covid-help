var express = require("express");
var request = require("request");

// Setting up express app
const app = express();
// All files in the ./files directory will be served
// The homepage will be login.html
app.use(express.static("./files", { index: 'login.html' }));
app.use(express.urlencoded());
const port = 8080;
app.listen(port);

// Endpoint to authenticate using database
app.post("/authenticate", function (req, res) {
    var username = req.body.username;
    var pw = req.body.password;
    // Query the database to check if password matches given username
    res.send(JSON.stringify({ "success": 1, "error": 0 }))
})

app.post("/register", function (req, res) {
    // TODO: Check that req.body is what we want it to be
    // TODO: Need to really test this insert statement lmfao
    var user = req.body;

    var query = connection.query('INSERT INTO UserTable(firstName, lastName, orgEmail, pswd, prefEmail, phoneNumber, addressLineOne, addressLineTwo, city, state, zipcode, facebook, Linkedin, Instagram, providerBool, requester, offerHousing, housingRules, lgbtqp, accessibilityFriendly, preferredContact, disabledAcct, transFriendly, accessibilityInfo) VALUES ?', user, function (err, result) {
        if (err) {
            console.log(err);
        }
    });

    // TODO: move to next page
    res.end('Success');
})