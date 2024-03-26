const { Client: FtpClient } = require('basic-ftp');
const FtpFileInfo = require('./ftpFileInfo');
const FileSystem = require('./fileSystem');
const { Writable, PassThrough } = require('stream');
const MemoryStream = require('memory-streams');

class FtpFileSystem extends FileSystem {
  constructor(client) {
    super();
    this.client = client;
  }

  static async create(host, port, user, password, secure = false, secureOptions = {}) {
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
        secure,
        secureOptions,
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
      this.client.uploadFrom(src, toPath, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
  }

  get(path) {
    const writableStream = new Writable();
    const bufferStream = new MemoryStream();
    const readableStream = new PassThrough();

    writableStream.pipe(bufferStream);

    return new Promise((resolve, reject) => {
      writableStream.on('finish', () => {
        readableStream.push(bufferStream.buffer);
        readableStream.push(null); // signal end of stream
        resolve(readableStream);
      });
      writableStream.on('error', reject);
      writableStream.write(data);
      writableStream.end();
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