class FileInfo {
  constructor(original) {
    this.original = original;
  }
  getName() {
    return this.original.name;
  }
  getSize() {
    return this.original.size;
  }
}

module.exports = FileInfo;