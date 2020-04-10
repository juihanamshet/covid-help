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

const azure = require('azure-storage');
const { AbortController } = require('@azure/abort-controller');
const fs = require("fs");
const path = require("path");
require('dotenv').config()
const formidable = require("express-formidable");




const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;


const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, credentials);
var blobService = azure.createBlobService(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);


const ONE_MEGABYTE = 1024 * 1024;

const client = new okta.Client({
    orgUrl: process.env.OKTA_BASE_URL + '/',
    token: process.env.OKTA_TOKEN
});

const aborter = AbortController.timeout(30 * 60 * 1000);

var startDate = new Date();
var expiryDate = new Date(startDate);
expiryDate.setMinutes(startDate.getMinutes() + 100);
startDate.setMinutes(startDate.getMinutes() - 100);

var sharedAccessPolicy = {
AccessPolicy: {
    Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
    Start: startDate,
    Expiry: expiryDate
}
};

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

async function showBlobNames(aborter, containerClient) {
    // console.log("this bad boy");
    let iter = await containerClient.listBlobsFlat(aborter);
    // console.log(iter);
    let list = [];
    for await (const blob of iter) {
        list.push(blob.name);
        console.log(` - ${blob.name}`);
    }
    return list;
}

app.get("/getUser", authenticationRequired, async function (req, res, next) {
    console.log('/getUsers called. HOPE THIS WORKSSSS')
    const userEmail = req.jwt.claims.sub;

    var eLim = userEmail.indexOf("@");
    var emailName = userEmail.substring(0, eLim);
    console.log(emailName);
    const containerName = "container" + emailName;
    const containerClient = blobServiceClient.getContainerClient(containerName);

    if (await containerClient.exists()){
        //If the container doesn't exists, then create one
        console.log("Already exists");
    }
    else{
        console.log("please work");
        await createContainer(containerClient);
    }

    var blobNamesList = await showBlobNames(aborter, containerClient);
                
    var profilePhotoBlobName = "";
    console.log(blobNamesList);
    var exists = false;
    for (var string of blobNamesList){
        if (string.includes("profilePhoto")){
            profilePhotoBlobName = string;
            exists = true;
        };
    }
    var sasUrl = "";
    console.log("corr 2");
    if (exists){
        console.log("The blob does exist")
        var token = blobService.generateSharedAccessSignature(containerName, profilePhotoBlobName, sharedAccessPolicy);
        console.log("Corret 1");
        sasUrl = blobService.getUrl(containerName, profilePhotoBlobName, token);

        console.log(sasUrl);
    }
    sqltools.getUser(userEmail, (sqlResult, status) => {
        if (status === 200) {
            console.log("/getUser was succcessfully called")
            sqlResult[0]['photoUrl'] = sasUrl;
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    });
    
})

async function addPhoto(containerClient, filePath, extname, aborter) {
    filePath = path.resolve(filePath);

    // const fileName = "profilePhoto" + path.extname(filePath)
    const fileName = "profilePhoto" + extname;

    const blobClient = await containerClient.getBlobClient(fileName);
    console.log("got blobClient");
    const content_type = "image/" + extname;

    const blockBlobClient = await blobClient.getBlockBlobClient();


    // return await blockBlobClient.uploadStream(
    //                 fs.createReadStream(stream, 
    //                 uploadOptions.bufferSize, 
    //                 uploadOptions.maxBuffers,
    //                 aborter);
    await blockBlobClient.uploadFile(filePath, aborter);

    await blobClient.setHTTPHeaders({
        blobContentType: "image/png",
    });

}

app.post("/updateProfilePhoto", authenticationRequired, async function (req, res, next) {
    console.log("/updateProfilePhoto is called. Hope this works");

    // he should do form.append('name', FILE_NAME)
    // form.append('stream', fs.createReadStream('file path'))

    //then
    
    const userEmail = req.jwt.claims.sub;
    var eLim = userEmail.indexOf("@");
    var emailName = userEmail.substring(0, eLim);

    const stream = req.files.stream;
    console.log(path.extname(stream.name));
    // fs.readFile(stream.path)
    const containerName = "container" + emailName;

    const containerClient = blobServiceClient.getContainerClient(containerName);
    if (! (await containerClient.exists())) {
        //If the container doesn't exists, then create one
        await createContainer(containerClient);
    }
    
    var li = await showBlobNames(aborter, containerClient).catch(() => res.send("Internal\
    server error"));
                
    console.log("Got ALl the blob Names")
    for (var string of li){
        if (string.includes("profilePhoto")){
            console.log("it includes!!!")
            const blobClient = containerClient.getBlobClient(string);
            const blockBlobClient = blobClient.getBlockBlobClient();

            await blockBlobClient.delete(aborter).catch(() => res.send("Internal\
            server error"));;

        }
    }
    await addPhoto(containerClient, stream.path, path.extname(stream.name), aborter)
    .catch(() => res.send("Internal server error"));;

    console.log("Profile Photo has successfully been updated");

    res.statusCode = 200;
    res.json({});

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

app.get("/getListing", authenticationRequired, async function (req, res, next) {
    const listingID = req.query.listingID;
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log("/getListing: Getting - \n\tListing: " + listingID + "\n\tUser: " + userEmail + "\n\tSchool: " + userSchool)
  
    

    const containerName = "container" + emailName;

    //GE THE BLOB NAME
    const containerClient = blobServiceClient.getContainerClient(containerName);
    var namesList = await showBlobNames(aborter, containerClient).catch(() => res.send("Internal\
    server error"));

    const generalBlobForListing = listingID + "container"
    for (var str of namesList){
        if (str.includes(generalBlobForListing)){
            console.log("hello");
        }
    }

    var eLim = userEmail.indexOf("@");
    var emailName = userEmail.substring(0, eLim);

    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
    AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate
    }
    };
    console.log("Check 1")
    var token = blobService.generateSharedAccessSignature(containerName, blobName, sharedAccessPolicy);
    console.log("Check 2")

    var tempUrl = blobService.getUrl(containerName, blobName, token);

    console.log(tempUrl)


    sqltools.getListing(userEmail, listingID, userSchool, (sqlResult, status) => {
        if (status === 200) {
            console.log("/getListing SQL Returned Successfully");
            sqlResult['']
            res.json(sqlResult);
        } else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })
})

async function uploadLocalFile(aborter, containerClient, filePath, 
    listingID, fileName, iteration) {

    filePath = path.resolve(filePath);

    const blobName = listingID + "listingPhoto" + iteration + path.extname(fileName);

    console.log(blobName)
    console.log(path.extname(filePath))


    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    return await blockBlobClient.uploadFile(filePath, aborter);
}

async function createContainer(containerClient) {
    return await containerClient.create()
}

app.post("/createListing", authenticationRequired, async function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const listingInfo = req.fields.listingInfo;
    const listingId = listingInfo.listingID;
    // let images = ["",""];
    // let userID = "5";
    // If you call data.append('file', file) multiple times your request will contain an array of your files...
    var eLim = userEmail.indexOf("@");
    var emailName = userEmail.substring(0, eLim);

    var files = req.files.files;
    //SHould be a maximum of four
    console.log(listingInfo.city);
    console.log(listingInfo.userID);

    let containerName = "container" + emailName;
    const containerClient = blobServiceClient.getContainerClient(containerName);
    console.log(containerName)
    if (!(await containerClient.exists())) {
        //If the container doesn't exists, then create one
        await createContainer(containerClient);
    }
    const aborter = AbortController.timeout(30 * 60 * 1000);

    files.forEach(async function (file, i) {
        await uploadLocalFile(aborter, containerClient, file.path, listingID, file.name, i);
    });
    


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

    var eLim = userEmail.indexOf("@");
    var emailName = userEmail.substring(0, eLim);
    const containerName = "container" + emailName;

    await client.getUser(userEmail)
        .then(user => {
            console.log("/createUser: Retrieved Okta User Info")
            userInfo['firstName'] = user.profile.firstName
            userInfo['lastName'] = user.profile.lastName
            userInfo['phoneNumber'] = user.profile.mobilePhone
            userInfo['orgEmail'] = user.profile.email
        });
    
    // const containerClient = blobServiceClient.getContainerClient(containerName);
    // await createContainer(containerClient)
    //     .then(() =>
    //         console.log("success in creation"));
    
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