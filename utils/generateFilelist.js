const fs = require("fs");

const generateFileList = (entryDir) => {
  const readout = fs.readdirSync(entryDir, {});
  let files = readout.filter((path) => {
    return fs.statSync(entryDir + "/" + path).isFile();
  });
  files = files.map((name) => {
    return entryDir + "/" + name;
  });
  let dirs = readout.filter((path) =>
    fs.statSync(entryDir + "/" + path).isDirectory()
  );
  if (dirs.length > 0) {
    dirs = dirs.map((dirName) => {
      return entryDir + "/" + dirName;
    });
    let dirFiles = dirs.map(generateFileList);
    dirFiles.forEach((fileNames) => {
      files = files.concat(fileNames);
    });
  }
  return files.filter((fileName) => !fileName.includes("desktop.ini"));
};

module.exports = { generateFileList };
