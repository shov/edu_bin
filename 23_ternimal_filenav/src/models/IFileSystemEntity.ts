export interface IFileSystemEntity {
    name: string;
    path: string;
    isDirectory: boolean;

    rename(newName: string): Promise<void>;
    delete(): Promise<void>;
}