import { IFileSystemEntity } from './IFileSystemEntity';

export interface IDirectory extends IFileSystemEntity {
    name: string;
    path: string;
    isDirectory: boolean;

    getContents(): Promise<IFileSystemEntity[]>;
    rename(newName: string): Promise<void>;
    delete(): Promise<void>;
}