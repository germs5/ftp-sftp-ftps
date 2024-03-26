const FileInfo = require('./fileInfo');

class FtpFileInfo extends FileInfo {
  constructor(original) {
    super(original)
  }
  isDirectory() {
    return this.original.type === 2
  }
}

module.exports = FtpFileInfo;