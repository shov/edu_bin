import { AFileSystemEntity } from './AFileSystemEntity';
import { IFile } from './IFile';
import * as fs from 'fs/promises';
import * as path from 'path';

export class File extends AFileSystemEntity implements IFile {
    constructor(name: string, path: string) {
        super(name, path, false);
    }

    async copyTo(destination: string): Promise<void> {
        const destinationPath = path.join(destination, this.name);
        await fs.copyFile(this.path, destinationPath);
    }

    async moveTo(destination: string): Promise<void> {
        const destinationPath = path.join(destination, this.name);
        await fs.rename(this.path, destinationPath);
    }

    async rename(newName: string): Promise<void> {
        const newPath = path.join(path.dirname(this.path), newName);
        await fs.rename(this.path, newPath);
        this.name = newName;
        this.path = newPath;
    }

    async delete(): Promise<void> {
        await fs.unlink(this.path);
    }
}