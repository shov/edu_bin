import { Game } from "./Game"
import { DefaultScene } from "./GameScenes/DefaultScene";
import { loop } from "./loop";

window.addEventListener('load', () => {
    const game = new Game();

    game.addScene(new DefaultScene(game));
    
    // @ts-ignore
    window.game = game;

    game.init().then(() => {
        game.resize(window.innerWidth, window.innerHeight);
        loop();
    });
})

window.addEventListener('resize', () => {
    // @ts-ignore
    window.game?.resize(window.innerWidth, window.innerHeight);
})

