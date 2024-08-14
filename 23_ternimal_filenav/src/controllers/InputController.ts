import { EventEmitter } from 'events';

export class InputController {
    private eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.initializeInputListeners();
    }

    private initializeInputListeners(): void {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf-8');

        process.stdin.on('data', (key: string) => {
            // Handle key presses
            switch (key) {
                case '\u0003': // Ctrl+C
                    this.handleExit();
                    break;
                case 'q': // 'q' to quit
                    this.handleExit();
                    break;
                case '\u001B\u005B\u0041': // Up arrow
                    this.emitEvent('up');
                    break;
                case '\u001B\u005B\u0042': // Down arrow
                    this.emitEvent('down');
                    break;
                case '\u001B\u005B\u0043': // Right arrow
                    this.emitEvent('right');
                    break;
                case '\u001B\u005B\u0044': // Left arrow
                    this.emitEvent('left');
                    break;
                case '\t': // Tab
                    this.emitEvent('tab');
                    break;
                case '\r': // Enter
                    this.emitEvent('enter');
                    break;
                case '\u001B\u005B\u0031\u0035\u007E': // F5
                    this.emitEvent('copy');
                    break;
                case '\u001B\u005B\u0031\u0037\u007E': // F6
                    this.emitEvent('moveRename');
                    break;
                case '\u001B\u005B\u0031\u0039\u007E': // F8
                    this.emitEvent('delete');
                    break;
                default:
                    break;
            }
        });
    }

    private emitEvent(eventName: string): void {
        this.eventEmitter.emit(eventName);
    }

    private handleExit(): void {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.exit();
    }
}