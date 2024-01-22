const path = require('path');
const fs = require('fs');

let filePath = path.join(__dirname, 'text.txt');
let readStream = fs.createReadStream(filePath, 'utf-8');
readStream.on('data', (chunk) => console.log(chunk));
