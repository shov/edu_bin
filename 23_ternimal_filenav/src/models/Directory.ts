import * as fs from 'fs/promises';
import * as path from 'path';
import { AFileSystemEntity } from './AFileSystemEntity';
import { IDirectory } from './IDirectory';
import { IFileSystemEntity } from './IFileSystemEntity';
import { File } from './File';
import { PARENT_DIRECTORY_NAME } from '../constants';

export class Directory extends AFileSystemEntity implements IDirectory {
    constructor(name: string, path: string) {
        super(name, path, true);
    }

    async getContents(): Promise<IFileSystemEntity[]> {
        const entities: IFileSystemEntity[] = [];

        // Add the parent directory ("..") entry
        if (this.path !== '/') {
            const parentDirectoryPath = path.resolve(this.path, '..');
            entities.push(new Directory(PARENT_DIRECTORY_NAME, parentDirectoryPath));
        }

        const items = await fs.readdir(this.path, { withFileTypes: true });

        for (const item of items) {
            const itemPath = path.join(this.path, item.name);

            if (item.isDirectory()) {
                entities.push(new Directory(item.name, itemPath));
            } else {
                entities.push(new File(item.name, itemPath));
            }
        }

        return entities;
    }

    async copyTo(destination: string): Promise<void> {
        // Prevent copying the parent directory
        if (this.name === PARENT_DIRECTORY_NAME) {
            throw new Error('Cannot copy the parent directory.');
        }
        const destinationPath = path.join(destination, this.name);
        await fs.cp(this.path, destinationPath, { recursive: true });
    }

    async moveTo(destination: string): Promise<void> {
        // Prevent moving the parent directory
        if (this.name === PARENT_DIRECTORY_NAME) {
            throw new Error('Cannot move the parent directory.');
        }
        const destinationPath = path.join(destination, this.name);
        await fs.rename(this.path, destinationPath);
    }

    async rename(newName: string): Promise<void> {
        // Prevent renaming the parent directory
        if (this.name === PARENT_DIRECTORY_NAME) {
            throw new Error('Cannot rename the parent directory.');
        }
        const newPath = path.join(path.dirname(this.path), newName);
        await fs.rename(this.path, newPath);
        this.name = newName;
        this.path = newPath;
    }

    async delete(): Promise<void> {
        // Prevent deleting the parent directory
        if (this.name === PARENT_DIRECTORY_NAME) {
            throw new Error('Cannot delete the parent directory.');
        }
        await fs.rm(this.path, { recursive: true, force: true });
    }
}