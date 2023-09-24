//Required modules
const ipfsAPI = require('ipfs-api');
const express = require('express');
const fs = require('fs');
const app = express();




const projectId = '2T7dHaVfSZyRvsjP59bWqxIm05U';   // <---------- your Infura Project ID

const projectSecret = '7849ae2f9ff6b2b3adb53466fb3e2cb0';  // <---------- your Infura Secret
// (for security concerns, consider saving these values in .env files)


const https = require("https");

const options = {
  host: "ipfs.infura.io",
  port: 5001,
  path: "/api/v0/pin/add?arg=QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn",
  method: "POST",
  auth: projectId + ":" + projectSecret,
};

let req = https.request(options, (res) => {
  let body = "";
  res.on("data", function (chunk) {
    body += chunk;
  });
  res.on("end", function () {
    console.log(body);
  });
});
req.end();


const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');


//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https',authorization: projectId + ":" + projectSecret,auth: projectId + ":" + projectSecret,"projectId":projectId,"projectSecret":projectSecret})

//Reading file from computer
let testFile = fs.readFileSync("/Users/tarunkumar/Downloads/Wheat\ Test\ Certficate.pdf");
//Creating buffer for ipfs function to add file to the system
let testBuffer = new Buffer(testFile);

//Addfile router for adding file a local file to the IPFS network without any local node
app.get('/addfile', function(req, res) {

    ipfs.files.add(testBuffer, function (err, file) {
        if (err) {
          console.log(err);
        }
        console.log(file)
      })

})
//Getting the uploaded file via hash code.
app.get('/getfile', function(req, res) {
    
    //This hash is returned hash of addFile router.
    const validCID = 'HASH_CODE'

    ipfs.files.get(validCID, function (err, files) {
        files.forEach((file) => {
          console.log(file.path)
          console.log(file.content.toString('utf8'))
        })
      })

})

app.listen(3000, () => console.log('App listening on port 3000!'))
