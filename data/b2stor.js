const B2 = require("backblaze-b2");

module.exports.uploadFile = async (fileName, fileData) => {
    console.log("uploaded started");

    // initialize b2 storage instance
    let b2 = new B2({
        accountId: "c78b0fb84d95",
        applicationKey: "K002Kj7q3fbBfpW0NrvfIpDf4cp/TnI"
    });

    try {
        // authorize with the service
        console.log("authorizing")
        await b2.authorize();

        // get an upload endpoint
        console.log("getting endpoint")
        let uploadEndpoint = await b2.getUploadUrl("bc77e84bc02f9bc8647d0915");

        // upload the file
        console.log("uploading")
        let uploadResult = await b2.uploadFile({
            uploadUrl: uploadEndpoint.data.uploadUrl,
            uploadAuthToken: uploadEndpoint.data.uploadAuthToken,
            filename: fileName,
            data: fileData
        });

        return uploadResult;
    } catch (error) {
        console.log("failed")
        return error;
    }
}