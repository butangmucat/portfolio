// account name, API key, and container name
const storContainer = process.env.AZURE_STORAGE_CONTAINER;

// azure storage sdk
const azure = require("azure-storage");
const blobSvc = azure.createBlobService();

module.exports.uploadFile = (fileName, fileExt, fileData, callback) => {
    console.log("uploaded started");

    // try locating the storage container
    blobSvc.createContainerIfNotExists(storContainer, {
        publicAccessLevel: "blob"
    }, (err, resu, resp) => {
        if (err) {
            console.log("Error locating storage container: " + err);
            throw err;
        } else {
            // upload the file
            blobSvc.createBlockBlobFromText(storContainer, fileName + "." + fileExt, fileData, (err, resu, resp) => {
                if (err) {
                    console.log("Error uploading blob: " + err);
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }
    });
}