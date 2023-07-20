const express = require('express')
const path = require('path')
const app = express()
const port = 10902
let objk = require('./pray.js');
 const fs = require("fs");
app.use('/pdf', express.static(path.join(__dirname, './astm/astm')))
app.use('/files', express.static(path.join(__dirname, './files')))

app.get('/', (req, res) => {
  res.send(objk)
})

app.get('/astm', (req, res) => {
  let arr = [];
  
  
let directory_name = "example_dir";
  

let filenames = fs.readdirSync("./astm/astm");
  
console.log("\nFilenames in directory:");
filenames.forEach((file) => {
    arr.push(file)
}); 
    
  res.send(arr)  
})

app.use('/crossdomain.xml', express.static(path.join(__dirname, 'crossdomain.xml')))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

require("dotenv/config");
require("./src/bot");




