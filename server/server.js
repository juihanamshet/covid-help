const express = require("express");
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var sqltools = require("./sql.js");

// TODO: Get this done
// const oktaJwtVerifier = new OktaJwtVerifier({
//     issuer: 'https://${yourOktaDomain}/oauth2/default',
//     clientId: '{clientId}',
//     assertClaims: {
//         aud: 'api://default',
//     },
// });


function authenticationRequired(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    if (!match) {
        return res.status(401).end();
    }

    const accessToken = match[1];
    const expectedAudience = 'api://default';

    return oktaJwtVerifier.verifyAccessToken(accessToken, expectedAudience)
        .then((jwt) => {
            req.jwt = jwt;
            next();
        })
        .catch((err) => {
            res.status(401).send(err.message);
        });
}


const app = express();
app.use(cors());
app.listen(8080);

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


app.get("/getOffers", /*authenticationRequired,*/ function (req, res, next) {
    // TODO: get just the university specific offers. don't include disabled accounts
    sqltools.getSchoolListings("NYU", (sqlResult, status) => {
        res.json(sqlResult);
    })
})