'use strict'

const fs = require('fs')
const path = require('path')
const mime = require('mime')

function scanDir(files, baseDir, subDir) {
  const newDir = path.join(baseDir, subDir);
  console.log(`Scanning ${newDir}`);

  fs.readdirSync(newDir).forEach(fileName => {

    const filePath = path.join(baseDir, subDir, fileName);
    let stat
    try {
        stat = fs.lstatSync(filePath);
    } catch (e) {
        console.log(`fs.lstatSync(${filePath})`);
        throw e;
    }

    if (stat.isDirectory()) {
       scanDir(files, newDir, fileName)
    } else {
      const fileDescriptor = fs.openSync(filePath, "r");
      const contentType = mime.getType(filePath);

      const fullName = path.join(newDir, fileName);

      const age = (fileName.startsWith('react')) ? 31536000 : 5*60  // 1 year for react*.js for cache age, 5 minutes everything else
      // Cache-Control: max-age=31536000

      files.set(`/${fullName}`, {
        fileDescriptor,
        filePath,
        headers: {
          "Cache-Control": `max-age=${age}`,
          "content-length": stat.size,
          "last-modified": stat.mtime.toUTCString(),
          "content-type": contentType
        }
      });
    }
  });
}

function getFiles (baseDir) {
  const files = new Map()

  scanDir(files, baseDir, '')

  return files
}

module.exports = {
  getFiles
}
