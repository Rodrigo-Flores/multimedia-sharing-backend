import fs from 'fs';
import path from 'path';

export interface FileData {
  name: string;
  createdAt: number; //Timestamp para ordenar por fecha
}

class Disk {
  constructor(private basePath: string = './') { }

  getFiles(folderPath: string, search?: string, sort?: 'asc' | 'desc', createdAtOrder?: string): { name: string; createdAt: number }[] {
    const directoryPath = folderPath;

    try {
      const files = fs.readdirSync(directoryPath).map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return { name: file, createdAt: stats.birthtimeMs };
      });

      let filteredFiles = files;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredFiles = filteredFiles.filter((file) => file.name.toLowerCase().includes(searchLower));
      }

      if (createdAtOrder) {
        filteredFiles.sort((a, b) => (createdAtOrder === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));

      } else {
        filteredFiles.sort((a, b) => (sort === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
      }
      return filteredFiles;

    } catch (error) {
      throw new Error(`Error reading files from ${directoryPath}: ${String(error)}`);
    }
  }

  getDirectories() {
    return [];
  }

  // Example method to upload a file to the drive
  uploadFile(file: any) {
    // Logic to upload a file to the drive
  }

  // Example method to delete a file from the drive
  deleteFile(fileId: string) {
    // Logic to delete a file from the drive
  }
}

export default Disk;