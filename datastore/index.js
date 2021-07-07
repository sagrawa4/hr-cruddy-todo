const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');


var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    if (err) {
      throw ('Cannot create a todo with id');
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {

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
  });

};
/*var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);
  */
exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (err, file) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: file.toString()});
    }
  });
};
/*
 var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
  */
exports.update = (id, text, callback) => {
  fs.access(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          throw (`No item with id: ${id}`);
        } else {
          callback(null, id);
        }
      });
    }
  });
};


/*fs.open(`${exports.dataDir}/${id}.txt`, 'r+', (err, fd) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.write(fd, text, (err, written, string) => {
        if (err) {
          throw ('Error while updating');
        } else {
          fs.close(fd, (err) => {
            if (err) {
              throw ('error closing the file');
            } else {
              callback(null, id);
            }
          });
        }
      });
    }
  });
};*/

exports.delete = (id, callback) => {
  fs.rm(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item to remove with id: ${id}`));
    } else {
      callback(null, id);
    }
  });
};

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
