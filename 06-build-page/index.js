const path = require('node:path');
const fs = require('node:fs/promises');

const distFolder = path.join(__dirname, 'project-dist');

async function createDistFolder() {
  try {
    await fs.mkdir(distFolder, { recursive: true });
  } catch (err) {
    console.error(err);
  }
}

let template;

async function readTemplate() {
  try {
    template = await fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
  } catch (err) {
    console.error(err);
  }
}

async function replaceTagsWithComponents() {
  try {
    const components = await fs.readdir(path.join(__dirname, 'components'));
    for (const component of components) {
      const componentName = path.parse(component).name;
      const componentContent = await fs.readFile(
        path.join(__dirname, 'components', component),
        'utf-8',
      );
      template = template.replace(`{{${componentName}}}`, componentContent);
    }
  } catch (err) {
    console.error(err);
  }
}

async function writeResult() {
  try {
    await fs.writeFile(path.join(distFolder, 'index.html'), template);
  } catch (err) {
    console.error(err);
  }
}

//css
async function mergeStyles() {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const styleFiles = await fs.readdir(stylesDir);
    let stylesContent = '';

    for (const file of styleFiles) {
      if (path.extname(file) === '.css') {
        const fileContent = await fs.readFile(
          path.join(stylesDir, file),
          'utf-8',
        );
        stylesContent += fileContent + '\n';
      }
    }

    await fs.writeFile(path.join(distFolder, 'style.css'), stylesContent);
  } catch (err) {
    console.error(err);
  }
}

//assets
async function copyDirectory(source, destination) {
  try {
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);

      if (entry.isDirectory()) {
        await fs.mkdir(destPath, { recursive: true });
        await copyDirectory(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyAssets() {
  try {
    const assetsDir = path.join(__dirname, 'assets');
    const distAssetsDir = path.join(distFolder, 'assets');
    await copyDirectory(assetsDir, distAssetsDir);
  } catch (err) {
    console.error(err);
  }
}

createDistFolder()
  .then(() => readTemplate())
  .then(() => replaceTagsWithComponents())
  .then(() => writeResult())
  .then(() => mergeStyles())
  .then(() => copyAssets());
