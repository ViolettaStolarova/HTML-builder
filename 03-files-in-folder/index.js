const path = require('node:path');
const fs = require('node:fs/promises');

const secretFolder = path.join(__dirname, 'secret-folder');

async function printFilesInfo() {
  try {
    const files = await fs.readdir(secretFolder, { withFileTypes: true });
    for (const file of files) {
      if (!file.isDirectory()) {
        let filePath = path.join(secretFolder, file.name);
        let stats = await fs.stat(filePath);
        let fileSizeInKb = stats.size / 1024;
        let fileExtension = path.extname(file.name).replace('.', '');
        console.log(
          `${path.basename(
            file.name,
            `.${fileExtension}`,
          )} - ${fileExtension} - ${fileSizeInKb.toFixed(3)}kb`,
        );
      }
    }
  } catch (err) {
    console.error(`Error: ${err}`);
    process.exit();
  }
}

printFilesInfo();
