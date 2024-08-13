import { IFileSystemEntity } from './IFileSystemEntity';

export interface IFile extends IFileSystemEntity {
    name: string;
    path: string;
    isDirectory: boolean;

    read(): Promise<string>;
    write(data: string): Promise<void>;
    append(data: string): Promise<void>;
    rename(newName: string): Promise<void>;
    delete(): Promise<void>;
}
