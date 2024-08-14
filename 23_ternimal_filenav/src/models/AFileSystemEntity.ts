import { IFileSystemEntity } from './IFileSystemEntity';
import * as fs from 'fs/promises';
import * as path from 'path';

export abstract class AFileSystemEntity implements IFileSystemEntity {
    constructor(
        public name: string,
        public path: string,
        public isDirectory: boolean
    ) {}

    async rename(newName: string): Promise<void> {
        const newPath = path.join(path.dirname(this.path), newName);
        await fs.rename(this.path, newPath);
        this.name = newName;
        this.path = newPath;
    }

    async delete(): Promise<void> {
        if (this.isDirectory) {
            await fs.rmdir(this.path, { recursive: true });
        } else {
            await fs.unlink(this.path);
        }
    }

    abstract copyTo(destination: string): Promise<void>;
    abstract moveTo(destination: string): Promise<void>;
}