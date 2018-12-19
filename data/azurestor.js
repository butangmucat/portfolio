// Logger
const log = require('../util/logging').log;
// account name, API key, and container name
const storContainer = process.env.AZURE_STORAGE_CONTAINER;

// azure storage sdk
const azure = require("azure-storage");
console.log(process.env.AZURE_STORAGE_CONNECTION_STRING);
const blobSvc = azure.createBlobService();

module.exports.uploadFile = (fileName, fileExt, fileData, callback) => {
    log.info("uploaded started");

    // try locating the storage container
    blobSvc.createContainerIfNotExists(storContainer, {
        publicAccessLevel: "blob"
    }, (err, resu, resp) => {
        if (err) {
            log.error("Error locating storage container: " + err);
            throw err;
        } else {
            // upload the file
            blobSvc.createBlockBlobFromText(storContainer, fileName + "." + fileExt, fileData, (err, resu, resp) => {
                if (err) {
                    log.error("Error uploading blob: " + err);
                    callback(err);
                } else {
                    log.info("upload completed")
                    callback(null);
                }
            });
        }
    });
}