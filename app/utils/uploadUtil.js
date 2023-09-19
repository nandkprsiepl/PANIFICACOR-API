const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const config = require('../../config.json');
const ipfsClient = require('ipfs-http-client');
const auth = 'Basic ' + Buffer.from(config.INFURA_PROJECT_ID + ':' + config.INFURA_PROJECT_SECRET).toString('base64');

console.log("ipfs config -->",config.INFURA_PROJECT_ID)
console.log("ipfs config -->",config.INFURA_PROJECT_SECRET)
console.log("ipfs config -->",config.INFURA_PROJECT_HOST)
console.log("ipfs config -->",config.INFURA_PROJECT_PORT)
console.log("ipfs config -->",config.INFURA_PROJECT_PORT)

const ipfsServer = ipfsClient.create({
    host: config.INFURA_PROJECT_HOST,
    port: config.INFURA_PROJECT_PORT,
    protocol: config.INFURA_PROJECT_PROTOCOL,
    headers: {
        authorization: auth,
    },
});


//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})

const addFileIPFSLocal = async (fileName, filePath) => {
    const file = await fs.readFileSync(filePath);
    const filesAdded = await ipfs.add(file)
    console.log(filesAdded);
    const fileHash = filesAdded;
    return fileHash;
};

const getFileIPFSLocal = async (cid) => {
    const files = await ipfs.get(cid);
    console.log("filesFetched",files);
   // const binaryString = files[0].content.toString();
    //console.log(binaryString)
    return files;
}


const addFile = async (fileName, filePath) => {
    const file = await fs.readFileSync(filePath);
    const filesAdded = await ipfsServer.add({ content: file });
    const cid = filesAdded.cid.toString();
    console.log('Uploaded file to IPFS. CID:', cid);
    return [{"hash":cid}];
};

const getFile = async (validCID, outputFilePath) => {
    try {
      const chunks = [];
      for await (const chunk of ipfsServer.cat(validCID)) {
        chunks.push(chunk);
      }
  
      // Concatenate the chunks to get the file content as a Buffer
      const fileData = Buffer.concat(chunks);
  
      // Save the Buffer to a PDF file using the fs module
      fs.writeFileSync(outputFilePath, fileData);
  
      console.log(`Downloaded PDF file from IPFS and saved it to ${outputFilePath}`);
    } catch (error) {
      console.error('Error while downloading the file:', error);
    }
  };


module.exports = {
    addFile,
    getFile,
    addFileIPFSLocal,
    getFileIPFSLocal
}