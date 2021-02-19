import fs from 'fs';
import { v4 } from 'uuid';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';

export function genFilePath(filename: string): string {
  return process.cwd() + `/uploads/${filename}`;
}

export function fileUpload({ filename, createReadStream }: FileUpload) {
  const newFilename = v4() + '.' + filename.split('.').pop();
  const path = genFilePath(newFilename);
  createReadStream()
    .pipe(createWriteStream(path))
    .on('error', err => {
      throw err;
    });

  return newFilename;
}

export function removeFile(filename: string) {
  return new Promise<boolean>((res, rej) => {
    fs.unlink(genFilePath(filename), err => {
      if (err) rej(err);
      res(true);
    });
  });
}

export async function getFile(filename?: string): Promise<string | null> {
  if (!filename) return null;
  return await fs.promises.readFile(genFilePath(filename), { encoding: 'base64' });
}
