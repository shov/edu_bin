import { Game } from "./Game"
import { loop } from "./loop";

window.addEventListener('load', () => {
    // @ts-ignore
    window.game = new Game();
    // @ts-ignore
    window.game.init().then(() => {
        // @ts-ignore
        window.game.resize(window.innerWidth, window.innerHeight);
        loop();
    });
})

window.addEventListener('resize', () => {
    // @ts-ignore
    window.game?.resize(window.innerWidth, window.innerHeight);
})

