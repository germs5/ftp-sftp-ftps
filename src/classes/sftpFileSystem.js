const SftpClient = require('ssh2-sftp-client');
const SftpFileInfo = require('./sftpFileInfo');
const FileSystem = require('./fileSystem');

class SftpFileSystem extends FileSystem {
  constructor(client) {
    super();
    this.client = client;
  }

  static async create(host, port, user, password) {
    const c = new SftpClient();
    return new Promise((resolve, reject) => {
      c.connect({
        host,
        port,
        username: user,
        password,
      }).then(() => {
        resolve(new SftpFileSystem(c));
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async list(path) {
    return new Promise((resolve, reject) => {
      this.client.list(path)
        .then((paths) => {
          resolve(paths.map((it) => new SftpFileInfo(it)));
        }).catch((err) => {
          reject(err);
        });
    });
  }

  put(src, toPath) {
    return this.client.put(src, toPath);
  }

  get(path) {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.client.sftp.createReadStream(path));
      } catch (e) {
        reject(e);
      }
    });
  }

  mkdir(path, recursive) {
    return this.client.mkdir(path, recursive);
  }

  rmdir(path, recursive) {
    return this.client.rmdir(path, recursive);
  }

  delete(path) {
    return this.client.delete(path);
  }

  rename(oldPath, newPath) {
    return this.client.rename(oldPath, newPath);
  }

  cwd() {
    return this.client.cwd();
  }

  end() {
    return this.client.end();
  }
}

module.exports = SftpFileSystem;