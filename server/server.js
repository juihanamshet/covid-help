const express = require("express");
const axios = require('axios');
const cors = require('cors');
const util = require('util');
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
            console.log(err)
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



app.get("/getListings", authenticationRequired, async function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log('/getListings: getting Listings for\n\t User: ' + userEmail + '\n\tSchool: ' + userSchool);
    var sqlResult, code;

    const getSchoolListings_p = util.promisify(sqltools.getSchoolListings);
    try {
        var result = await getSchoolListings_p(userEmail, userSchool)
            .then(console.log('success'))
            .catch(e => { throw (e) });
        sqlResult = result['result'];
        code = result['code']

    }
    catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e[1]);
    }

    try {
        for (var i in sqlResult) {
            var listingInfo = sqlResult[i];

            const containerName = "container" + listingInfo['userID'];
            const containerClient = blobServiceClient.getContainerClient(containerName);

            var blobNamesList = await showBlobNames(aborter, containerClient);
            var tempUrl = '';
            for (var image of blobNamesList) {
                var lookingFor = listingInfo['listingID'] + "listing";
                if (image.includes(lookingFor)) {
                    var token = blobService.generateSharedAccessSignature(containerName, image, sharedAccessPolicy);
                    tempUrl = blobService.getUrl(containerName, image, token);
                    break;
                }
            }
            sqlResult[i]['frontUrl'] = tempUrl;
        }
        resultSize = Object.keys(sqlResult).length
        console.log("/getListings: Successfully Returned Listings with Size: " + resultSize);
        res.json(sqlResult);
    }
    catch (e) {
        console.error(e);
        console.error("Failure in getting listings' images");
        res.statusCode = 500;
        res.send("Internal Server Error");
    }
})


async function showBlobNames(aborter, containerClient) {
    // console.log("this bad boy");
    let iter = await containerClient.listBlobsFlat(aborter);
    // console.log(iter);
    let list = [];
    for await (const blob of iter) {
        list.push(blob.name);
        // console.log(` - ${blob.name}`);
    }
    return list;
}

app.get("/getUser", authenticationRequired, async function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    console.log('/getUser with email: ' + userEmail)
    var sqlResult, code;

    const getUserID_p = util.promisify(sqltools.getUserID);
    try {
        var result = await getUserID_p(userEmail)
            .then(console.log('success'))
            .catch(e => { throw (e) });
        sqlResult = result['result'];
        code = result['code']
    } catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e[1]);
    }

    // get User Profile Picture
    try {
        const userID = sqlResult;
        const containerName = "container" + userID;
        const containerClient = blobServiceClient.getContainerClient(containerName);

        if (await containerClient.exists()) {
            console.log("Already exists");
        }
        else {
            console.log("please work");
            await containerClient.create()
        }

        var blobNamesList = await showBlobNames(aborter, containerClient);

        var profilePhotoBlobName = "";
        // console.log(blobNamesList);
        var exists = false;
        for (var string of blobNamesList) {
            if (string.includes("profilePhoto")) {
                profilePhotoBlobName = string;
                exists = true;
            };
        }
        var sasUrl = "";
        // console.log("corr 2");
        if (exists) {
            // console.log("The blob does exist")
            var token = blobService.generateSharedAccessSignature(containerName, profilePhotoBlobName, sharedAccessPolicy);
            // console.log("Corret 1");
            sasUrl = blobService.getUrl(containerName, profilePhotoBlobName, token);

            // console.log(sasUrl);
        }
    }
    catch (e) {
        console.log(e);
        res.statusCode = 500;
        res.send("Internal Server Error");
    }


    const getUser_p = util.promisify(sqltools.getUser);
    try {
        var result = await getUser_p(userEmail)
            .catch(e => { throw (e) });
        sqlResult = result['result'];
        code = result['code']
        console.log("/getUser was succcessfully called")
        sqlResult[0]['photoUrl'] = sasUrl;
        res.json(sqlResult);
    } catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e[1]);
    }
})

// async function addPhoto(containerClient, filePath, extname, aborter) {
//     filePath = path.resolve(filePath);

//     // const fileName = "profilePhoto" + path.extname(filePath)
//     const fileName = "profilePhoto" + extname;

//     const blobClient = await containerClient.getBlobClient(fileName);
//     console.log("got blobClient");
//     const content_type = "image/" + extname;

//     const blockBlobClient = await blobClient.getBlockBlobClient();


//     // return await blockBlobClient.uploadStream(
//     //                 fs.createReadStream(stream, 
//     //                 uploadOptions.bufferSize, 
//     //                 uploadOptions.maxBuffers,
//     //                 aborter);
//     await blockBlobClient.uploadFile(filePath, aborter);

//     await blobClient.setHTTPHeaders({
//         blobContentType: content_type,
//     });

// }

app.post("/updateProfilePhoto", authenticationRequired, async function (req, res, next) {
    console.log("/updateProfilePhoto is called. Hope this works");

    const userEmail = req.jwt.claims.sub;
    await sqltools.getUserID(userEmail, async (sqlResults, status) => {
        if (status == 200) {
            try {
                const userID = sqlResults;
                // console.log(req.fields.stream);
                const stream = req.fields.stream;
                // console.log(path.extname(stream.name));
                // fs.readFile(stream.path)
                var imageData = stream.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                var type = imageData[1];
                var extName = type.split('/')[1];
                // console.log(imageData[1]);
                var buffer = Buffer.from(imageData[2], 'base64');
                const containerName = "container" + userID;

                const containerClient = blobServiceClient.getContainerClient(containerName);
                if (!(await containerClient.exists())) {
                    //If the container doesn't exists, then create one
                    await containerClient.create();
                }

                var li = await showBlobNames(aborter, containerClient);

                // console.log("Got ALl the blob Names")
                for (var string of li) {
                    if (string.includes("profilePhoto")) {
                        // console.log("it includes!!!")
                        const blobClient = containerClient.getBlobClient(string);
                        const blockBlobClient = blobClient.getBlockBlobClient();

                        await blockBlobClient.delete(aborter);

                    }
                }

                await blobService.createBlockBlobFromText(containerName, 'profilePhoto' + extName, buffer,
                    {
                        contentSettings: {
                            contentType: type,
                        }
                    },
                    function (error, result, response) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log("Added ProfilePhoto")
                        }
                    });

                res.statusCode = 200;
                res.json({});
            }
            catch (e) {
                console.log(e);
                console.log("Something wrong happened in trying to upload ProfilePhoto");
                res.statusCode = 500;
                res.send("Internal Server Error");
            }

        }
        else {
            res.statusCode = 500;
            res.send("Internal Server Error");
        }
    })



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

app.get("/getUsersListings", authenticationRequired, async function (req, res, next) {
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log("/getUsersListings: Getting Personal Listings for\n\t User: " + userEmail + "\n\tSchool: " + userSchool);
    var sqlResult, code;

    const getUsersListings_p = util.promisify(sqltools.getUsersListings);

    try {
        var result = await getUsersListings_p(userEmail, userSchool)
            .then(console.log('success'))
            .catch(e => { throw (e) });
        sqlResult = result['result'];
        code = result['code'];
    } catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e[1]);
    }


    try {
        for (var i in sqlResult) {
            var listingInfo = sqlResult[i];

            const containerName = "container" + listingInfo['userID'];
            console.log(containerName);
            const containerClient = blobServiceClient.getContainerClient(containerName);

            var blobNamesList = await showBlobNames(aborter, containerClient);
            var tempUrl = '';
            var lookingFor = listingInfo['listingID'] + "listing";
            for (var image of blobNamesList) {
                console.log(lookingFor);
                if (image.includes(lookingFor)) {
                    var token = blobService.generateSharedAccessSignature(containerName, image, sharedAccessPolicy);
                    tempUrl = blobService.getUrl(containerName, image, token);

                    break;
                }
            }
            sqlResult[i]['frontUrl'] = tempUrl;
        }
        console.log(sqlResult);
        console.log("/getUsersListings SQL DB Returned Successfully");
        res.json(sqlResult);
    }
    catch (e) {
        console.error(e);
        console.error("/getUsersListings: Failure in getting Images");
        res.statusCode = 500;
        res.send("Internal Server Error");
    }
})

app.get("/getListing", authenticationRequired, async function (req, res, next) {
    const listingID = req.query.listingID;
    const userEmail = req.jwt.claims.sub;
    const userSchool = extractSchool(userEmail);
    console.log("/getListing: Getting - \n\tListing: " + listingID + "\n\tUser: " + userEmail + "\n\tSchool: " + userSchool)



    // Get Listing ID
    const getListerID_p = util.promisify(sqltools.getListerID);
    try {
        var { sqlResult, code } = await getListerID_p(listingID)
            .catch(e => { throw (e) });
    }
    catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e);
    }

    // Get Photos Associated with Listing
    var listerID = sqlResult;
    const containerName = "container" + listerID;

    const containerClient = blobServiceClient.getContainerClient(containerName);

    if (!(await containerClient.exists())) {
        await containerClient.create();
    }

    var namesList = await showBlobNames(aborter, containerClient);

    var sharedAccessPolicy = {
        AccessPolicy: {
            Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        }
    };

    const generalBlobForListing = listingID + "listing"
    var listOfUrls = [];
    var ownerPhoto = "";
    for (var str of namesList) {
        if (str.includes(generalBlobForListing)) {
            var token = blobService.generateSharedAccessSignature(containerName, str, sharedAccessPolicy);
            var tempUrl = blobService.getUrl(containerName, str, token);
            listOfUrls.push(tempUrl);
        }
        else if (str.includes("profilePhoto")) {
            var token = blobService.generateSharedAccessSignature(containerName, str, sharedAccessPolicy);
            var tempUrl = blobService.getUrl(containerName, str, token);
            ownerPhoto = tempUrl;
        }
    }

    // Get Listing Info
    const getListing_p = util.promisify(sqltools.getListing);
    try {
        var result = await getListing_p(userEmail, listingID, userSchool)
            .catch(e => { throw (e) })
        code = result['code']
        listingResult = result['result']

        console.log("/getListing SQL Returned Successfully");
        listingResult[0]['photoUrls'] = listOfUrls;
        listingResult[0]['ownerPhotoUrl'] = ownerPhoto;
        res.json(listingResult);
    }
    catch (e) {
        console.error(e)
        res.statusCode = parseInt(e.message.substring(0, 3), 10)
        next(e);
    }



})



// async function uploadLocalFile(aborter, containerClient, filePath, 
//     listingID, fileName, iteration) {

//     filePath = path.resolve(filePath);

//     const blobName = listingID + "listingPhoto" + iteration + path.extname(fileName);

//     console.log(blobName)
//     console.log(path.extname(filePath))


//     const blobClient = containerClient.getBlobClient(blobName);
//     const blockBlobClient = blobClient.getBlockBlobClient();

//     await blockBlobClient.uploadFile(filePath, aborter);

//     const content_type = "image/" + path.extname(filePath)

//     await blobClient.setHTTPHeaders({
//         blobContentType: content_type,
//     });
// }



app.post("/createListing", authenticationRequired, async function (req, res, next) {
    console.log("createListing has been called.")
    const userEmail = req.jwt.claims.sub;
    // const listingInfo = req.fields.listingInfo;
    var listingInfo = {};
    listingInfo['listingName'] = req.fields.listingName;
    listingInfo['addressLineOne'] = req.fields.addressLineOne;
    listingInfo['addressLineTwo'] = req.fields.addressLineTwo;
    listingInfo['city'] = req.fields.city;
    listingInfo['state'] = req.fields.state;
    listingInfo['zipCode'] = req.fields.zipCode;
    listingInfo['neighborhood'] = req.fields.neighborhood;
    listingInfo['housingRules'] = req.fields.housingRules;
    listingInfo['lgbtqpFriendly'] = req.fields.lgbtqpFriendly;
    listingInfo['accessibilityFriendly'] = req.fields.accessibilityFriendly;
    listingInfo['accessibilityInfo'] = req.fields.accessibilityInfo;
    listingInfo['livingSituation'] = req.fields.livingSituation;
    listingInfo['housingInfo'] = req.fields.housingInfo;

    // console.log(listingInfo);
    // console.log(req.files);
    // let images = ["",""];
    // let userID = "5";
    // If you call data.append('file', file) multiple times your request will contain an array of your files...
    sqltools.getUserID(userEmail, async (sqlResults, status) => {
        if (status === 200) {
            const userID = sqlResults
            listingInfo['userID'] = userID;
            let containerName = "container" + userID;
            console.log("/createListing: Creating Listing for " + userEmail)


            sqltools.createListing(listingInfo, async (sqlResult, status) => {
                if (status === 200) {
                    const listingID = sqlResult[0][''];

                    console.log("/createListing Listing Inserted into DB");
                    const containerClient = blobServiceClient.getContainerClient(containerName);
                    if (!(await containerClient.exists())) {
                        //If the container doesn't exists, then create one
                        await containerClient.create()
                    }
                    try {
                        var streams = JSON.parse(req.fields.images);
                        var i = 0;
                        // console.log(streams);

                        for (var stream of streams) {
                            var imageData = stream.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                            //imageData[0] is the raw one include data:(), 1 is the type, 2 is the actual data
                            var type = imageData[1];
                            var extName = "." + type.split('/')[1];
                            var buffer = Buffer.from(imageData[2], 'base64');
                            await blobService.createBlockBlobFromText(containerName, listingID + 'listing' + i + extName, buffer,
                                {
                                    contentSettings: {
                                        contentType: type,
                                    }
                                },
                                function (error, result, response) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Success in Uploading");
                                    }
                                });

                            i += 1;

                        }
                    }
                    catch (e) {
                        console.log(e);
                        console.log("complete failure");
                        res.statusCode = 500;
                        res.send("internal server error");
                    }
                    res.json(status);
                } else {
                    res.statusCode = 500;
                    res.send("Internal Server Error");
                }
            })
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

            user.profile.firstTimer = false;
            user.update()
                .then(() => console.log('User is no longer a first Timer'));
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
            res.send("/deleteListing Server Error");
        }
    })
})