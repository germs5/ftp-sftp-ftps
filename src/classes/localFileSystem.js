const fs = require('fs');
const FileSystem = require('./fileSystem');
const LocalFileInfo = require('./localFileInfo');
const { deleteFolderRecursive } = require('../lib/utils');

class LocalFileSystem extends FileSystem {
  constructor() {
    super();
  }

  static create() {
    return new Promise((resolve, reject) => resolve(new LocalFileSystem()));
  }

  async list(path) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, async (err, files) => {
        if (err) {
          return reject(err);
        }
        await Promise.all(
          files.map((fileName) => new Promise((res, reject) => {
            fs.stat(path + fileName, (err, stats) => {
              if (err) {
                return reject(err);
              }
              stats.name = fileName;
              res(new LocalFileInfo(stats));
            });
          })),
        ).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    });
  }

  put(src, toPath) {
    return new Promise((resolve, reject) => {
      try {
        const writeStream = fs.createWriteStream(toPath);
        src.pipe(writeStream);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  get(path) {
    return new Promise((resolve, reject) => {
      try {
        const readStream = fs.createReadStream(path);
        resolve(readStream);
      } catch (e) {
        reject(e);
      }
    });
  }

  mkdir(path, recursive) {
    return fs.mkdir(path, { recursive });
  }

  rmdir(path, recursive) {
    if (!recursive) return fs.rmdir(path);
    return new Promise((resolve, reject) => {
      try {
        deleteFolderRecursive(path);
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      fs.unlink(path, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }
}

module.exports = LocalFileSystem;