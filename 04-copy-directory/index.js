const path = require('node:path');
const fs = require('node:fs/promises');

const pathToFiles = path.join(__dirname, 'files');
const pathToCopyFiles = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.mkdir(pathToCopyFiles, { recursive: true });
  } catch (err) {
    console.error(err);
    process.exit();
  }

  const files = await fs.readdir(pathToFiles, { withFileTypes: true });
  const copyFiles = await fs.readdir(pathToCopyFiles, { withFileTypes: true });

  for (const file of files) {
    if (!file.isDirectory()) {
      const fromWhere = path.join(pathToFiles, file.name);
      const toWhere = path.join(pathToCopyFiles, file.name);
      try {
        await fs.copyFile(fromWhere, toWhere);
      } catch (err) {
        console.log(err);
        process.exit();
      }
    }
  }

  for (const copyFile of copyFiles) {
    if (!files.find((file) => file.name === copyFile.name)) {
      const copyFilePath = path.join(pathToCopyFiles, copyFile.name);
      try {
        await fs.unlink(copyFilePath);
      } catch (err) {
        console.log(err);
        process.exit();
      }
    }
  }
}

copyDir();
