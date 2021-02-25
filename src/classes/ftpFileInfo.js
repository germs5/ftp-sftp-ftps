const FileInfo = require('./fileInfo');

class FtpFileInfo extends FileInfo {
  constructor(original) {
    super(original)
  }
  isDirectory() {
    return this.original.type === 'd'
  }
}

module.exports = FtpFileInfo;