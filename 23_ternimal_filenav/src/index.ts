import { Directory } from './models/Directory';
import { InputController } from './controllers/InputController';
import { EventController } from './controllers/EventController';

async function main() {
    // Init
    const initialLeftDirectory = new Directory('left', process.cwd());
    const initialRightDirectory = new Directory('right', process.cwd());

    // Create controllers
    const eventController = new EventController(initialLeftDirectory, initialRightDirectory);
    const inputController = new InputController(eventController.getEventEmitter());

    // Load initial directory contents
    await eventController.loadDirectoryContents();

    // Handle events
}

// Run the main function
main().catch((error) => {
    console.error('An error occurred:', error);
    process.exit(1);
});