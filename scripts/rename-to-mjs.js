const fs = require('fs');
const path = require('path');

const esmDir = path.resolve('dist/esm');

fs.readdirSync(esmDir).forEach(file => {
  if (file.endsWith('.js')) {
    const oldPath = path.join(esmDir, file);
    const newPath = path.join(esmDir, file.replace(/\.js$/, '.mjs'));
    fs.renameSync(oldPath, newPath);
    console.log(`Renamed: ${file} → ${path.basename(newPath)}`);
  }
});
