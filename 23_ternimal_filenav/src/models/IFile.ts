import { IFileSystemEntity } from './IFileSystemEntity';

export interface IFile extends IFileSystemEntity {
    copyTo(destination: string): Promise<void>;
    moveTo(destination: string): Promise<void>;
    rename(newName: string): Promise<void>;
    delete(): Promise<void>;
}
