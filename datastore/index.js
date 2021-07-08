const fs = require('fs');
const {promises: {readdir, readFile, writeFile, access, rm}} = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      writeFile(`${exports.dataDir}/${id}.txt`, text).then(() => {
        callback(null, { id, text });
      }).catch(err => callback(err));
    }
  });
};

/*fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
      */

exports.readAll = (callback) => {
  readdir(exports.dataDir).then(files => {
    const ids = files.map(file => path.basename(file, '.txt'));
    Promise.all(files.map(file => readFile(`${exports.dataDir}/${file}`, 'utf8')))
      .then(fileData => {
        const data = [];
        for (let i = 0; i < ids.length; i++) {
          data.push({
            id: ids[i],
            text: fileData[i]
          });
        }
        callback(null, data);
      }).catch(err => callback(err));
  });
};

/* readdir(exports.dataDir).then(files => {
    const ids = files.map(file => path.basename(file, '.txt'));
    Promise.all(files.map(file => readFile(`${exports.dataDir}/${file}`, 'utf8')))
      .then((values) => {
        const result = [];
        for (var i = 0; i < ids.length; i++) {
          result.push({
            id: ids[i],
            text: values[i]
          });
        }
        console.log(result);
        callback(null, result);
      }).catch(e => callback(e));
  });

  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      callback(null, files.map(eachFile => {
        return {
          id: path.basename(eachFile, '.txt'),
          text: path.basename(eachFile, '.txt')
        };
      }));
    }
  });*/

/*fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      callback(null, files.map(eachFile => {
        return {
          id: path.basename(eachFile, '.txt'),
          text: path.basename(eachFile, '.txt')
        };
      }));
    }
  });*/

exports.readOne = (id, callback) => {
  readFile(`${exports.dataDir}/${id}.txt`, 'utf8').then(fileData => {
    callback(null, {id: id, text: fileData.toString()});
  }).catch(err => callback(err));
};

/*
fs.readFile(`${exports.dataDir}/${id}.txt`, (err, file) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: file.toString()});
    }
  });
  */

exports.update = (id, text, callback) => {
  access(`${exports.dataDir}/${id}.txt`, fs.constants.W_OK).then(() => {
    writeFile(`${exports.dataDir}/${id}.txt`, text).then(() => {
      callback(null, id);
    }).catch(err => callback(err));
  }).catch(err => callback(err));
};

/*fs.access(`${exports.dataDir}/${id}.txt`,fs.constants.W_OK, (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, id);
        }
      });
    }
  });
  */
exports.delete = (id, callback) => {
  rm(`${exports.dataDir}/${id}.txt`).then(() => {
    callback(null, id);
  }).catch(err => callback(err));
};

/*
fs.rm(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, id);
    }
  });
  */

/* var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
  */
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
