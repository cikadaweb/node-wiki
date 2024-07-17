import fs from 'fs';

export const getFiles = (folder: string): string[] => {
  const files_folder: string[] = [];
  fs.readdirSync(folder).forEach((file: string) => {
    files_folder.push(file);
  });

  return files_folder;
};
