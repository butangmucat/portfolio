// account name, API key, and container name
const storAccount = "cs376afinalfall18";
const storKey = "5tu62h4XLLI+3qAGl2j4U2oEV7wl4CW6ky7ZdAYyNHEepl2GFErBqgn09DHzA+OyUoR/a9QRdVh6gO3atO54Rg==";
const storContainer = "imgs"

// azure storage sdk
const azure = require("azure-storage");
const blobSvc = azure.createBlobService(storAccount, storKey);

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