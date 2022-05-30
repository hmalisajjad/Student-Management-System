"use strict";
const q = require("q");
const fs = require("fs");
const moment = require('moment')

const imageDataUri = require("image-data-uri")
/**
 *
 */
const PATHS = {
  UPLOAD_FILE: "public/uploads/${user_id}/${subject_id}/${test_id}"
};

/**
 *
 * @param {*} path
 * @param {*} fileName
 */
const getNextFileName = (path, fileName) => {
  let defer = q.defer();

  fs.readdir(path, (err, files) => {
    let filesList = files.map(file => {
      file = getFileNameExclExtension(file);

      if (isNaN(file)) {
        console.log(file);
        return 0;
      }
      return +file;
    });

    let extension = getFileExtension(fileName);

    // let maxFileName = 0;

    // if (filesList && filesList.length > 0) {
    //   maxFileName = Math.max(...filesList) + 1;
    // }

    let CurrentDate = moment().unix();

    let newFileName = CurrentDate + "." + extension;

    defer.resolve(newFileName);
  });

  return defer.promise;
};

/**
 *
 * @param {*} fileName
 */
const getFileNameExclExtension = fileName => {
  let parts;

  if (!fileName) {
    return "";
  }

  parts = fileName.split(".");

  if (parts.length == 1) {
    return parts[0];
  }

  let lastIndex = parts.length - 1;

  parts.splice(lastIndex, 1);

  return parts.join(".");
};

/**
 *
 * @param {*} fileName
 */
const getFileExtension = fileName => {
  let parts;

  if (!fileName) {
    return "";
  }

  parts = fileName.split(".");

  if (parts.length == 1) {
    return "";
  }

  let lastIndex = parts.length - 1;

  return parts[lastIndex];
};

/**
 *
 * @param {*} oldPath
 * @param {*} oldName
 * @param {*} newPath
 */
const copyFileToPath = (oldPath, oldName, pathTemplate, pathConfig) => {
  const defer = q.defer();
  console.log('inside copy file to path line 105')

  let newPath = getActualPathFromTemplate(pathTemplate, pathConfig);
  console.log('new path: ', newPath)

  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }

  getNextFileName(newPath, oldName)
    .then(newName => {
      let fullNewPath = newPath + newName;

      fs.copyFile(oldPath, fullNewPath, () => {
        let publicPrefix = "public/";

        if (fullNewPath.startsWith(publicPrefix)) {
          fullNewPath = fullNewPath.substring(publicPrefix.length)
        }

        defer.resolve({
          success: true,
          path: fullNewPath
        })
      });
    })
    .catch(err => {
      defer.resolve({
        success: false,
        error: err
      })
    });

  return defer.promise;
};

const copyImageDataUriToPath = (dataUri, pathTemplate, extension, pathConfig) => {
  const defer = q.defer();

  let newPath = getActualPathFromTemplate(pathTemplate, pathConfig);

  if (!fs.existsSync(newPath)) {
    fs.mkdirSync(newPath, { recursive: true });
  }

  getNextFileName(newPath, "x.png")
    .then(newName => {
      let fullNewPath = newPath + newName;

      imageDataUri.outputFile(dataUri, fullNewPath).then(() => {
        let publicPrefix = "public/";

        if (fullNewPath.startsWith(publicPrefix)) {
          fullNewPath = fullNewPath.substring(publicPrefix.length)
        }

        defer.resolve({
          success: true,
          path: fullNewPath
        })
      });
    });

  return defer.promise;
};


const getActualPathFromTemplate = (template, config) => {
  let configKeys = Object.keys(config);
  let templateVariables = getVariablesInTemplate(template);
  console.log('template variables in 173: ', templateVariables)

  for (let i = 0; i < templateVariables.length; i++) {
    if (configKeys.indexOf(templateVariables[i]) == -1) {
      console.log('error')
    }
  }

  let func = Function(...configKeys, "return `" + template + "`;");

  return func(...configKeys.map(k => config[k]));
};

const getVariablesInTemplate = path => {
  let regex = /\$\{(.*?)\}/g;
  let arr = path.match(regex).map(elem => elem.slice(2, elem.length - 1));
  console.log('arr in 188 of file copier: ', arr)

  return arr;
};


module.exports = {
  PATHS,
  copyFileToPath,
  copyImageDataUriToPath
}
