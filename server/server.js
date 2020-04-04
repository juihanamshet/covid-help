const express = require("express");
const axios = require('axios');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var sqltools = require("./sql.js");
const okta = require('@okta/okta-sdk-nodejs');
let bodyParser = require('body-parser');
require('dotenv').config()


const client = new okta.Client({
    orgUrl: process.env.OKTA_BASE_URL + '/',
    token: process.env.OKTA_TOKEN
});


const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.OKTA_BASE_URL + '/oauth2/default',
    clientId: process.env.OKTA_CLIENT_ID,
    assertClaims: {
        aud: 'api://default',
    },
});


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
app.use(bodyParser.json());
app.listen(8080);


function extractSchool(email) {
    const school = email.substring(email.lastIndexOf("@") + 1, email.lastIndexOf(".edu"))
    return school
}


app.get("/getListings", authenticationRequired, function (req, res, next) {
    console.log('/getListings called')
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log('/getListings: getting Listings for\n\t User: ' + userEmail + '\n\tSchool: ' + userSchool);

    sqltools.getSchoolListings(userEmail, userSchool, (sqlResult, status) => {
        if (status === 200) {
            resultSize = Object.keys(sqlResult).length
            console.log("/getListings: Successfully Returned Listings with Size: " + resultSize);
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})

app.get("/getUser", authenticationRequired, function (req, res, next){
    console.log('/getUsers called. HOPE THIS WORKSSSS')
    const userEmail = req.jwt.claims.sub;

    sqltools.getUser(userEmail, (sqlResult, status) => {
        if (status === 200){
            console.log("/getUser was succcessfully called")
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})



app.post("/updateUser", authenticationRequired, function (req, res, next){
    console.log("Update User. Hope this works")
    const userInfo = req.body.userInfo;
    
    
    sqltools.updateUser(userInfo, (sqlResult, status) => {
        if (status === 200){
            console.log("/updateUser was succcessfully called")
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })

})

app.get("/getUsersListings", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log("/getUsersListings: Getting Personal Listings for\n\t User: " + userEmail + "\n\tSchool: " + userSchool);

    sqltools.getUsersListings(userEmail, userSchool, (sqlResult, status) => {
        if (status === 200) {
            console.log("/getUsersListings SQL DB Returned Successfully");
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})

app.get("/getListing", authenticationRequired, function (req, res, next) {
    const listingID = req.query.listingID;
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log("/getListing: Getting - \n\tListing: " + listingID + "\n\tUser: " + userEmail + "\n\tSchool: " + userSchool)

    sqltools.getListing(userEmail, listingID, userSchool, (sqlResult, status) => {
        if (status === 200) {
            console.log("/getListing SQL Returned Successfully");
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})

app.post("/createListing", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingInfo = req.body.listingInfo;
    console.log("/createListing: Creating Listing for " + userEmail)

    sqltools.createListingHandler(userEmail, listingInfo, (sqlResult, status) => {
        if (status === 200) {
            console.log("/createListing Listing Inserted into DB")
            res.json(status);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})


app.post("/createUser", authenticationRequired, async function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    const userInfo = req.body.userInfo;
    userInfo['org'] = userSchool;
    console.log("/createUser called for User: " + userEmail);

    await client.getUser(userEmail)
        .then(user => {
            console.log("/createUser: Retrieved Okta User Info")
            userInfo['firstName'] = user.profile.firstName
            userInfo['lastName'] = user.profile.lastName
            userInfo['phoneNumber'] = user.profile.mobilePhone
            userInfo['orgEmail'] = user.profile.email
        });

    sqltools.createUser(userInfo, (sqlResult, status) => {
        if (status === 200) {
            console.log("/createUser User Inserted into DB");
            res.json(status);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})