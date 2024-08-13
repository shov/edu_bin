import { Directory } from './models/Directory';
import { InputController } from './controllers/InputController';
import { EventController } from './controllers/EventController';

async function main() {
    // Init
    const initialDirectory = new Directory('root', process.cwd());

    // Create controllers
    const eventController = new EventController(initialDirectory);
    const inputController = new InputController(eventController.getEventEmitter());

    // Load initial directory contents
    await eventController.loadDirectoryContents();

    // Start listening for input
}

// Run the application
main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});