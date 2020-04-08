const express = require("express");
const axios = require('axios');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
var sqltools = require("./sql.js");
const okta = require('@okta/okta-sdk-nodejs');
let bodyParser = require('body-parser');
const {
    StorageSharedKeyCredential,
    BlobServiceClient
} = require('@azure/storage-blob');
const { AbortController } = require('@azure/abort-controller');
const fs = require("fs");
const path = require("path");
require('dotenv').config()
const formidable = require("express-formidable");




const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;


const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, credentials);

const ONE_MEGABYTE = 1024 * 1024;

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
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(formidable());
// app.use(bodyParser.json());
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

app.get("/getUser", authenticationRequired, function (req, res, next) {
    console.log('/getUsers called. HOPE THIS WORKSSSS')
    const userEmail = req.jwt.claims.sub;

    sqltools.getUser(userEmail, (sqlResult, status) => {
        if (status === 200) {
            console.log("/getUser was succcessfully called")
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})

async function addPhoto(containerClient, filePath, extname, aborter) {
    filePath = path.resolve(filePath);

    // const fileName = "profilePhoto" + path.extname(filePath)
    const fileName = "profilePhoto" + extname;

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();


    // return await blockBlobClient.uploadStream(
    //                 fs.createReadStream(stream, 
    //                 uploadOptions.bufferSize, 
    //                 uploadOptions.maxBuffers,
    //                 aborter);
    return await blockBlobClient.uploadFile(filePath, aborter);
}

app.post("/updateProfilePhoto", authenticationRequired, function (req, res, next) {
    console.log("/updateProfilePhoto is called. Hope this works");

    // he should do form.append('name', FILE_NAME)
    // form.append('stream', fs.createReadStream('file path'))

    //then
    const userEmail = req.jwt.claims.sub;
    const stream = req.files.stream;
    console.log(path.extname(stream.name));
    // fs.readFile(stream.path)
    const containerName = "container5";

    const containerClient = blobServiceClient.getContainerClient(containerName);
    if (!containerClient.exists()) {
        //If the container doesn't exists, then create one
        createContainer(containerClient).then(() => console.log("container \
        creation success")).catch((e) => console.log(e));
    }
    const aborter = AbortController.timeout(30 * 60 * 1000);

    addPhoto(containerClient, stream.path, path.extname(stream.name), aborter).then(() => console.log("success"))
        .catch((e) => console.log(e))

    console.log("Profile Photo has successfully been updated");

    res.statusCode = 200;

})


app.post("/updateUser", authenticationRequired, function (req, res, next) {
    console.log("Update User. Hope this works")
    const userInfo = req.fields.userInfo;


    sqltools.updateUser(userInfo, (sqlResult, status) => {
        if (status === 200) {
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

async function uploadLocalFile(aborter, containerClient, filePath) {
    filePath = path.resolve(filePath);

    const fileName = path.basename(filePath);

    console.log(fileName)
    console.log(path.extname(filePath))

    const blobClient = containerClient.getBlobClient(fileName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    return await blockBlobClient.uploadFile(filePath, aborter);
}

async function createContainer(containerClient) {
    return await containerClient.create()
}

app.post("/createListing", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingInfo = req.fields.listingInfo;

    // let images = ["",""];
    // let userID = "5";
    // If you call data.append('file', file) multiple times your request will contain an array of your files...
    var files = req.files.files;
    console.log(listingInfo.city);
    console.log(listingInfo.userID);

    let containerName = "container" + userID;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(containerName)
    if (!containerClient.exists()) {
        //If the container doesn't exists, then create one
        createContainer(containerClient).then(() => console.log("container \
        creation success")).catch((e) => console.log(e));
    }
    const aborter = AbortController.timeout(30 * 60 * 1000);

    for (file of files) {

        uploadLocalFile(aborter, containerClient, file.path).then(() => console.log("sucess\
        of image upload ")).catch((e) => console.log(e));
    }


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
    const userInfo = req.fields.userInfo;
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

app.put("/disableListing", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingID = req.fields.listingID;
    console.log("/disableListing: disabling Listing for listingID " + listingID + " and user: " + userEmail);

    sqltools.disableListing(listingID, userEmail, (sqlResult, status) => {
        if (status === 200) {
            console.log("/disableListing Listing updated DB")
            res.statusCode = 200;
            res.send("/disableListing success");
        } else {
            res.statusCode = 500;
            res.send("/disableListing Server Error");
        }
    })
})

app.put("/enableListing", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingID = req.fields.listingID;
    console.log("/enableListing: disabling Listing for listingID" + listingID + " and user: " + userEmail);

    sqltools.enableListing(listingID, userEmail, (sqlResult, status) => {
        if (status === 200) {
            console.log("/enableListing Listing updated DB")
            res.json(status);
        } else {
            res.statusCode = 500;
            res.send("/enableListing Server Error");
        }
    })
})

app.delete("/deleteListing", authenticationRequired, function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingID = req.fields.listingID;
    console.log("/deleteListing: deleting Listing for listingID" + listingID + " and user: " + userEmail);

    sqltools.deleteListing(listingID, userEmail, (sqlResult, status) => {
        if (status === 200) {
            console.log("/deleteListing Listing updated DB")
            res.json(status);
        } else {
            res.statusCode = 500;
            res.send("deleteListing Server Error");
        }
    })
})