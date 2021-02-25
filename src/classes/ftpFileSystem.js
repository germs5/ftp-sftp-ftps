const FtpClient = require('ftp');
const FtpFileInfo = require('./ftpFileInfo');
const FileSystem = require('./fileSystem');

class FtpFileSystem extends FileSystem {
  constructor(client) {
    super();
    this.client = client;
  }

  static async create(host, port, user, password) {
    const c = new FtpClient();
    return new Promise((resolve, reject) => {
      c.on('ready', () => {
        resolve(new FtpFileSystem(c));
      });
      c.once('error', (err) => {
        reject(err);
      });
      c.connect({
        host,
        port,
        user,
        password,
      });
    });
  }

  list(path) {
    return new Promise((resolve, reject) => {
      this.client.list(path, (err, listing) => {
        if (err) {
          return reject(err);
        }
        resolve(listing.map((l) => new FtpFileInfo(l)));
      });
    });
  }

  put(src, toPath) {
    return new Promise((resolve, reject) => {
      this.client.put(src, toPath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  get(path) {
    return new Promise((resolve, reject) => {
      this.client.get(path, (err, stream) => {
        if (err) {
          return reject(err);
        }
        resolve(stream);
      });
    });
  }

  mkdir(path, recursive) {
    return new Promise((resolve, reject) => {
      this.client.mkdir(path, recursive, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  rmdir(path, recursive) {
    return new Promise((resolve, reject) => {
      this.client.rmdir(path, recursive, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(1);
      });
    });
  }

  delete(path) {
    return new Promise((resolve, reject) => {
      this.client.delete(path, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(path);
      });
    });
  }

  rename(oldPath, newPath) {
    return new Promise((resolve, reject) => {
      this.client.rename(oldPath, newPath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(true);
      });
    });
  }

  cwd() {
    return new Promise((resolve, reject) => {
      this.client.pwd((err, path) => {
        if (err) {
          return reject(err);
        }
        resolve(path);
      });
    });
  }

  end() {
    return this.client.end();
  }
}

module.exports = FtpFileSystem;