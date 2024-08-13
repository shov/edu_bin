import * as fs from 'fs/promises';
import * as path from 'path';
import { AFileSystemEntity } from './AFileSystemEntity';
import { IFileSystemEntity } from './IFileSystemEntity';
import { EFileType } from '../types/EFileType';
import { IDirectory } from './IDirectory';
import { File } from './File';

export class Directory extends AFileSystemEntity implements IDirectory {
    constructor(name: string, path: string) {
        super(name, path, true);
    }

    async getContents(): Promise<IFileSystemEntity[]> {
        const entities: IFileSystemEntity[] = [];
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
}