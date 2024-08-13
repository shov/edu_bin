import { EventEmitter } from 'events';
import { Directory } from '../models/Directory';
import { IFileSystemEntity } from '../models/IFileSystemEntity';

export class EventController {
    private eventEmitter: EventEmitter;
    private currentDirectory: Directory;
    private currentSelection: number = 0;
    private directoryContents: IFileSystemEntity[] = [];

    constructor(initialDirectory: Directory) {
        this.eventEmitter = new EventEmitter();
        this.currentDirectory = initialDirectory;
        this.initializeEventListeners();
    }

    private initializeEventListeners(): void {
        this.eventEmitter.on('up', this.handleUp.bind(this));
        this.eventEmitter.on('down', this.handleDown.bind(this));
        this.eventEmitter.on('enter', this.handleEnter.bind(this));
        this.eventEmitter.on('left', this.handleLeft.bind(this));
    }

    public async loadDirectoryContents(): Promise<void> {
        this.directoryContents = await this.currentDirectory.getContents();
        this.render();
    }

    private handleUp(): void {
        if (this.currentSelection > 0) {
            this.currentSelection--;
        }
        this.render();
    }

    private handleDown(): void {
        if (this.currentSelection < this.directoryContents.length - 1) {
            this.currentSelection++;
        }
        this.render();
    }

    private handleEnter(): void {
        const selectedEntity = this.directoryContents[this.currentSelection];
        if (selectedEntity.isDirectory) {
            this.currentDirectory = selectedEntity as Directory;
            this.currentSelection = 0;
            this.loadDirectoryContents();
        } else {
            console.log(`Selected file: ${selectedEntity.name}`);
            // Здесь можно добавить логику для работы с выбранным файлом
        }
    }

    private handleLeft(): void {
        const parentDirectory = new Directory('..', this.currentDirectory.path);
        this.currentDirectory = parentDirectory;
        this.currentSelection = 0;
        this.loadDirectoryContents();
    }

    private render(): void {
        console.clear();
        console.log(`Current Directory: ${this.currentDirectory.path}\n`);
        this.directoryContents.forEach((entity, index) => {
            if (index === this.currentSelection) {
                console.log(`> ${entity.name}`);
            } else {
                console.log(`  ${entity.name}`);
            }
        });
    }

    public getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }
}