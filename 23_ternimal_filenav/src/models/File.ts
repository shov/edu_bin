import * as fs from 'fs/promises';
import { AFileSystemEntity } from './AFileSystemEntity';
import { EFileType } from '../types/EFileType';
import { IFile } from './IFile';

export class File extends AFileSystemEntity implements IFile {
    constructor(name: string, path: string) {
        super(name, path, false);
    }

    async read(): Promise<string> {
        return await fs.readFile(this.path, 'utf-8');
    }

    async write(data: string): Promise<void> {
        await fs.writeFile(this.path, data, 'utf-8');
    }

    async append(data: string): Promise<void> {
        await fs.appendFile(this.path, data, 'utf-8');
    }
}