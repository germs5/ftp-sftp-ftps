const FileInfo = require('./fileInfo');

class SftpFileInfo extends FileInfo {
  constructor(original) {
    super(original);
  }
  isDirectory() {
    return this.original.type === 'd';
  }
}

module.exports = SftpFileInfo;