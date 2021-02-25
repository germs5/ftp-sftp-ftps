class LocalFileInfo extends FileInfo {
  isDirectory() {
    return this.original.isDirectory();
  }
}

module.exports = LocalFileInfo;