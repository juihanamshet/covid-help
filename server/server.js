var express = require("express");


const app = express();

app.use(express.urlencoded());
const port = 8080;
app.listen(port);

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