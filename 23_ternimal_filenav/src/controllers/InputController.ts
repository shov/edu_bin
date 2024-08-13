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
            switch (key) {
                case '\u0003': // Ctrl+C
                    this.handleExit();
                    break;
                case 'q': 
                    this.handleExit();
                    break;
                case '\u001B\u005B\u0041':
                    this.emitEvent('up');
                    break;
                case '\u001B\u005B\u0042':
                    this.emitEvent('down');
                    break;
                case '\u001B\u005B\u0043':
                    this.emitEvent('right');
                    break;
                case '\u001B\u005B\u0044':
                    this.emitEvent('left');
                    break;
                case '\r': // Enter
                    this.emitEvent('enter');
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
