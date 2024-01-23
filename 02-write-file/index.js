const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');

const filePath = path.join(__dirname, '02-write-file.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.write(
  'List the countries you have visited\n(when you are done, press ctrl+c or write exit)\n',
);

rl.on('line', (answer) => {
  if (answer === 'exit') {
    console.log('Goodbye!');
    process.exit();
  }
  console.log(`Country: ${answer}`);
  writeStream.write(`${answer}\n`);
});

rl.on('SIGINT', () => {
  console.log('Goodbye!');
  process.exit();
});
