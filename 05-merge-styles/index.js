const path = require('path');
const fs = require('fs');

const pathStyles = path.join(__dirname, 'styles');
const pathBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  const cssFiles = files.filter((file) => path.extname(file.name) === '.css');

  const writeStream = fs.createWriteStream(pathBundle, 'utf-8');

  cssFiles.forEach((file) => {
    const readStream = fs.createReadStream(
      path.join(pathStyles, file.name),
      'utf-8',
    );
    readStream.on('data', (data) => writeStream.write(data + '\n'));
  });
});
