export interface IFileSystemEntity {
    name: string;
    path: string;
    isDirectory: boolean;

    copyTo(destination: string): Promise<void>;
    moveTo(destination: string): Promise<void>;
    rename(newName: string): Promise<void>;
    delete(): Promise<void>;
}