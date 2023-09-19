
const helper = require('../utils/helper');
const logM = require('../utils/helper');
const logger = logM.getLogger('poService');
const docUtil = require('../utils/uploadUtil')
const fs = require('fs');

const uploadFile = async function (req) {
   return new Promise(function(resolve,reject){
        let fileObj = {};
        if (req.files.certFile) {
            const file = req.files.certFile;
            const fileName = file.name;
            const filePath = __dirname + "/files/" + fileName;
            console.log('filePath--->1',filePath)
            file.mv(filePath, async (err) => {
                if (err) {
                    console.log("Error: failed to download file.");
                }
                console.log('filePath--->2',fileName,)
            const fileHash = await docUtil.addFile(fileName, filePath);
            console.log('filePath--->3',fileName,)
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.log("Error: Unable to delete file. ", err);
                }
            });
            console.log('filePath--->4')
            fileObj = {
                mime: file.mimetype,
                name: fileName,
                hash: fileHash[0].hash
            };
            console.log('filePath--->5',fileObj)
             resolve(fileObj);
            });
        }else{
            reject("No file to upload");
        }  
   })
};

const downloadFile = async function(req){
    let hash = req.query.hash;
    let file = await docUtil.getFile(hash);
    return file;
}

module.exports = {
    uploadFile,
    downloadFile
}