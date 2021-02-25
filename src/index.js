const FileSystem = require('./classes/fileSystem');
const FileInfo = require('./classes/fileInfo');
const LocalFileSystem = require('./classes/localFileSystem');
const FtpFileSystem = require('./classes/ftpFileSystem');
const SftpFileSystem = require('./classes/sftpFileSystem');
const SftpFileInfo = require('./classes/sftpFileInfo');

module.exports = {
  FileSystem,
  FileInfo,
  LocalFileSystem,
  FtpFileSystem,
  SftpFileSystem,
  SftpFileInfo,
};