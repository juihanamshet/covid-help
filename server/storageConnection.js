const {
    StorageSharedKeyCredential,
    BlobServiceClient
    } = require('@azure/storage-blob');
const {AbortController} = require('@azure/abort-controller');
const fs = require("fs");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const STORAGE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const ACCOUNT_ACCESS_KEY = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;


const credentials = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, ACCOUNT_ACCESS_KEY);

const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,credentials);

async function uploadLocalFile(aborter, containerClient, filePath, blobName) {
    filePath = path.resolve(filePath);


    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();

    return await blockBlobClient.uploadFile(filePath,aborter);
}


function addProfilePhoto(userID, filePath){
    let containerName = userID + "_container";

    //asssume for now that all of the photos are JPEG files. will deal with this later

    const blobName = userID + "_profilePhoto" + path.extname(filePath);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const blockBlobClient = blobClient.getBlockBlobClient();
    
    const aborter = AbortController.timeout(30 * ONE_MINUTE);

    // await containerClient.create();
    // console.log(`Container: "${containerName}" is created`);

    // console.log("Containers:");
    // await showContainerNames(aborter, blobServiceClient);

    if (! containerClient.exists()) {
        //If the container doesn't exists, then create one
        containerClient.create()
    }
    
    //add the photo as a blob to the container
    // whether or not the file exists, the person could be updating profile pic
    uploadLocalFile(aborter, containerClient, filePath, blobName);
}