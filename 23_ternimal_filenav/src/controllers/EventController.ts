import { EventEmitter } from 'events';
import { Directory } from '../models/Directory';
import { IFileSystemEntity } from '../models/IFileSystemEntity';
import { ENavSide } from '../types/ENavSide';
import chalk from 'chalk';
import * as path from 'path';
import { PARENT_DIRECTORY_NAME } from '../constants';

export class EventController {
    private static readonly RESERVED_LINES: number = 3; // Reserved lines for headers and help line
    private static readonly MIN_COLUMN_WIDTH: number = 30; // Minimum width for each column

    private eventEmitter: EventEmitter;
    private leftDirectory: Directory;
    private rightDirectory: Directory;
    private activeColumn: ENavSide = ENavSide.Left;
    private leftSelection: number = 0;
    private rightSelection: number = 0;
    private leftContents: IFileSystemEntity[] = [];
    private rightContents: IFileSystemEntity[] = [];
    private leftWindowStart: number = 0;
    private rightWindowStart: number = 0;
    private terminalHeight: number = process.stdout.rows;
    private columnWidth: number = EventController.MIN_COLUMN_WIDTH;

    constructor(initialLeftDirectory: Directory, initialRightDirectory: Directory) {
        this.eventEmitter = new EventEmitter();
        this.leftDirectory = initialLeftDirectory;
        this.rightDirectory = initialRightDirectory;
        this.initializeEventListeners();
        this.subscribeToResize();
        this.loadDirectoryContents();
    }

    private initializeEventListeners(): void {
        this.eventEmitter.on('up', this.handleUp.bind(this));
        this.eventEmitter.on('down', this.handleDown.bind(this));
        this.eventEmitter.on('enter', this.handleEnter.bind(this));
        this.eventEmitter.on('left', this.handleLeft.bind(this));
        this.eventEmitter.on('right', this.handleRight.bind(this));
        this.eventEmitter.on('tab', this.handleTab.bind(this));
        this.eventEmitter.on('copy', this.handleCopy.bind(this));
        this.eventEmitter.on('moveRename', this.handleMoveRename.bind(this));
        this.eventEmitter.on('delete', this.handleDelete.bind(this));
    }

    private subscribeToResize(): void {
        process.stdout.on('resize', () => {
            this.terminalHeight = process.stdout.rows;
            this.calculateColumnWidth();
            this.render();
        });
        this.calculateColumnWidth(); // Initial calculation
    }

    private calculateColumnWidth(): void {
        const availableWidth = process.stdout.columns;
        const halfWidth = Math.floor(availableWidth / 2) - 5; // Subtract space for the spacer
        this.columnWidth = Math.max(EventController.MIN_COLUMN_WIDTH, halfWidth);
    }

    public async loadDirectoryContents(): Promise<void> {
        this.leftContents = await this.leftDirectory.getContents();
        this.rightContents = await this.rightDirectory.getContents();
        this.render();
    }

    private handleUp(): void {
        if (this.activeColumn === ENavSide.Left) {
            if (this.leftSelection > 0) {
                this.leftSelection--;
                if (this.leftSelection < this.leftWindowStart) {
                    this.leftWindowStart--;
                }
            }
        } else {
            if (this.rightSelection > 0) {
                this.rightSelection--;
                if (this.rightSelection < this.rightWindowStart) {
                    this.rightWindowStart--;
                }
            }
        }
        this.render();
    }

    private handleDown(): void {
        if (this.activeColumn === ENavSide.Left) {
            if (this.leftSelection < this.leftContents.length - 1) {
                this.leftSelection++;
                if (this.leftSelection >= this.leftWindowStart + this.terminalHeight - EventController.RESERVED_LINES) {
                    this.leftWindowStart++;
                }
            }
        } else {
            if (this.rightSelection < this.rightContents.length - 1) {
                this.rightSelection++;
                if (this.rightSelection >= this.rightWindowStart + this.terminalHeight - EventController.RESERVED_LINES) {
                    this.rightWindowStart++;
                }
            }
        }
        this.render();
    }

    private handleEnter(): void {
        const activeSelection = this.activeColumn === ENavSide.Left ? this.leftContents[this.leftSelection] : this.rightContents[this.rightSelection];
        if (activeSelection.name === PARENT_DIRECTORY_NAME) {
            this.navigateUp();
        } else if (activeSelection.isDirectory) {
            if (this.activeColumn === ENavSide.Left) {
                this.leftDirectory = activeSelection as Directory;
                this.leftSelection = 0;
                this.leftWindowStart = 0;
            } else {
                this.rightDirectory = activeSelection as Directory;
                this.rightSelection = 0;
                this.rightWindowStart = 0;
            }
            this.loadDirectoryContents();
        } else {
            console.log(`Selected file: ${activeSelection.name}`);
        }
    }

    private navigateUp(): void {
        if (this.activeColumn === ENavSide.Left) {
            this.leftDirectory = new Directory(PARENT_DIRECTORY_NAME, path.resolve(this.leftDirectory.path, '..'));
            this.leftSelection = 0;
            this.leftWindowStart = 0;
        } else {
            this.rightDirectory = new Directory(PARENT_DIRECTORY_NAME, path.resolve(this.rightDirectory.path, '..'));
            this.rightSelection = 0;
            this.rightWindowStart = 0;
        }
        this.loadDirectoryContents();
    }

    private handleLeft(): void {
        if (this.activeColumn === ENavSide.Right) {
            this.activeColumn = ENavSide.Left;
            this.render();
        }
    }

    private handleRight(): void {
        if (this.activeColumn === ENavSide.Left) {
            this.activeColumn = ENavSide.Right;
            this.render();
        }
    }

    private handleTab(): void {
        this.activeColumn = this.activeColumn === ENavSide.Left ? ENavSide.Right : ENavSide.Left;
        this.render();
    }

    private async handleCopy(): Promise<void> {
        const sourceSelection = this.activeColumn === ENavSide.Left ? this.leftContents[this.leftSelection] : this.rightContents[this.rightSelection];
        if (sourceSelection.name === PARENT_DIRECTORY_NAME) {
            console.log(chalk.yellow('Cannot copy the parent directory.'));
            return;
        }
        const destinationDirectory = this.activeColumn === ENavSide.Left ? this.rightDirectory : this.leftDirectory;
        await sourceSelection.copyTo(destinationDirectory.path);
        console.log(chalk.green(`Copied to ${destinationDirectory.path}`));
        this.loadDirectoryContents();
    }

    private async handleMoveRename(): Promise<void> {
        const sourceSelection = this.activeColumn === ENavSide.Left ? this.leftContents[this.leftSelection] : this.rightContents[this.rightSelection];
        if (sourceSelection.name === PARENT_DIRECTORY_NAME) {
            console.log(chalk.yellow('Cannot move/rename the parent directory.'));
            return;
        }
        const destinationDirectory = this.activeColumn === ENavSide.Left ? this.rightDirectory : this.leftDirectory;

        const newName = await this.promptUser(`Enter new name for ${sourceSelection.name} (or press Enter to keep the name): `);
        if (newName.trim() !== '') {
            await sourceSelection.rename(newName.trim());
        } else {
            await sourceSelection.moveTo(destinationDirectory.path);
        }
        console.log(chalk.green(`Moved/Renamed to ${destinationDirectory.path}`));
        this.loadDirectoryContents();
    }

    private async handleDelete(): Promise<void> {
        const activeSelection = this.activeColumn === ENavSide.Left ? this.leftContents[this.leftSelection] : this.rightContents[this.rightSelection];
        if (activeSelection.name === PARENT_DIRECTORY_NAME) {
            console.log(chalk.yellow('Cannot delete the parent directory.'));
            return;
        }
        const deleteConfirmed = await this.promptUser(`Are you sure you want to delete ${activeSelection.name}? (y/N): `);

        if (deleteConfirmed.toLowerCase() === 'y') {
            await activeSelection.delete();
            console.log(chalk.green(`Deleted ${activeSelection.name}`));
            this.loadDirectoryContents();
        } else {
            console.log(chalk.yellow('Delete operation cancelled.'));
        }
    }

    private async promptUser(question: string): Promise<string> {
        process.stdout.write(question);
        process.stdin.resume();
        process.stdin.setEncoding('utf-8');

        return new Promise<string>((resolve) => {
            process.stdin.once('data', (data) => {
                process.stdin.pause();
                resolve(data.toString().trim());
            });
        });
    }

    private render(): void {
        console.clear();
        console.log(chalk.bold('Left Directory: ') + this.leftDirectory.path);
        console.log(chalk.bold('Right Directory: ') + this.rightDirectory.path + '\n');

        const spacer = ' '.repeat(5);
        const headerLine = `Type | Name`.padEnd(this.columnWidth) + spacer + `Type | Name`;
        const separatorLine = `---- | ----`.padEnd(this.columnWidth) + spacer + `---- | ----`;

        console.log(chalk.bold(headerLine));
        console.log(chalk.bold(separatorLine));

        const leftEnd = Math.min(this.leftWindowStart + this.terminalHeight - EventController.RESERVED_LINES, this.leftContents.length);
        const rightEnd = Math.min(this.rightWindowStart + this.terminalHeight - EventController.RESERVED_LINES, this.rightContents.length);

        for (let i = 0; i < Math.max(leftEnd, rightEnd); i++) {
            const leftEntity = i < this.leftContents.length ? this.leftContents[i] : null;
            const rightEntity = i < this.rightContents.length ? this.rightContents[i] : null;

            const leftType = leftEntity ? (leftEntity.isDirectory ? 'D' : 'F') : ' ';
            const rightType = rightEntity ? (rightEntity.isDirectory ? 'D' : 'F') : ' ';
            const leftName = leftEntity ? leftEntity.name : ' ';
            const rightName = rightEntity ? rightEntity.name : ' ';

            let leftLine = ` ${leftType}   | ${leftName} `.padEnd(this.columnWidth);
            let rightLine = ` ${rightType}   | ${rightName} `.padEnd(this.columnWidth);

            if (i === this.leftSelection && this.activeColumn === ENavSide.Left) {
                leftLine = chalk.inverse(leftLine);
            }
            if (i === this.rightSelection && this.activeColumn === ENavSide.Right) {
                rightLine = chalk.inverse(rightLine);
            }

            console.log(leftLine + spacer + rightLine);
        }

        const blankLinesCount = Math.max(0, this.terminalHeight - EventController.RESERVED_LINES - (Math.max(leftEnd, rightEnd) + 3));
        console.log('\n'.repeat(blankLinesCount) + chalk.green(`F5: Copy | F6: Move/Rename | F8: Delete`));
    }

    public getEventEmitter(): EventEmitter {
        return this.eventEmitter;
    }
}