import fs from 'fs';
import path from 'path';
import logger from './logger';

class Disk {
  constructor(public basePath: string = './') {
    this.basePath = path.resolve(this.basePath);
  }

  getFiles(folderPath: string, search?: string, sort?: 'asc' | 'desc', createdAtOrder?: string): { name: string; createdAt: string }[] {
    const directoryPath = folderPath;

    try {
      const files = fs.readdirSync(directoryPath).map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return { name: file, createdAt: new Date(stats.birthtimeMs).toISOString() };
      });

      let filteredFiles = files;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredFiles = filteredFiles.filter((file) => file.name.toLowerCase().includes(searchLower));
      }

      if (createdAtOrder) {
        filteredFiles.sort((a, b) => (createdAtOrder === 'asc' ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      } else {
        filteredFiles.sort((a, b) => (sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      }
      return filteredFiles;

    } catch (error) {
      logger.scopedError('disk', `Error reading files from ${directoryPath}: ${String(error)}`);
      throw new Error(`Error reading files from ${directoryPath}: ${String(error)}`);
    }
  }

  getDirectories() {
    try {
      const directories: { [key: string]: any } = {};
      const entries = fs.readdirSync(this.basePath, { withFileTypes: true });

      const subDirs = entries.filter(entry => entry.isDirectory());

      for (const dir of subDirs) {
        const dirPath = path.join(this.basePath, dir.name);
        directories[dir.name] = this.processDirectory(dirPath);
      }

      return directories;
    } catch (error) {
      logger.scopedError('disk', `Error reading directories from ${this.basePath}: ${String(error)}`);
      throw new Error(`Error reading directories from ${this.basePath}: ${String(error)}`);
    }
  }

  private processDirectory(dirPath: string): { files: number; subdirs: any } {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const filesCount = entries.filter(entry => entry.isFile()).length;
    const subdirs: { [key: string]: any } = {};

    const subDirs = entries.filter(entry => entry.isDirectory());
    for (const dir of subDirs) {
      const subDirPath = path.join(dirPath, dir.name);
      subdirs[dir.name] = this.processDirectory(subDirPath);
    }

    return { files: filesCount, subdirs };
  }

  uploadFile(file: any) {
  }

  deleteFile(fileId: string) {
  }
}

export default Disk;