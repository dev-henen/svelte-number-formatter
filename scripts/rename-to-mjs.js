const fs = require('fs');
const path = require('path');

const esmDir = path.resolve('dist/esm');

function renameJsToMjsRecursively(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      renameJsToMjsRecursively(fullPath); // 🔁 Recurse into subdirectories
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      const newPath = path.join(dir, entry.name.replace(/\.js$/, '.mjs'));
      fs.renameSync(fullPath, newPath);
      console.log(`Renamed: ${fullPath} → ${newPath}`);
    }
  });
}

renameJsToMjsRecursively(esmDir);
