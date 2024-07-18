
/*
I'm planning create a tiny JS web game based on canvas with no libraries. It's to be multiplayer, so the server app is required as well. Each player has a colorful circle of unique color. The circle always moves to mouse pointer direction with speed that depends on the size of the circle. The bigger the slower. If player's circle collides with another player's circle the bigger one eats/absorbs/consumes the smaller one: the smaller circle's player looses then, the winner's circle gets bigger.
*/

/*
Creating a multiplayer JS web game with the features you've described is an interesting and engaging project. Here's a high-level breakdown of what you need to do to create the game:

Frontend (Client-Side)
HTML and Canvas Setup:

Create an HTML file with a canvas element.
Set up basic styling to center the canvas on the page and make it responsive.
JavaScript for Game Logic:

Initialize the canvas and get the 2D rendering context.
Handle mouse movement to get the mouse position.
Create a player class to represent each circle with properties like position, size, color, and speed.
Implement the movement logic where the circle moves towards the mouse pointer, with the speed dependent on the circle's size.
Implement collision detection logic to handle when circles collide and the smaller one is consumed.
Rendering:

Continuously clear the canvas and redraw all the circles at their new positions.
Backend (Server-Side)
Server Setup:

Use Node.js and a WebSocket library (like ws) to handle real-time communication between clients and the server.
Maintain a list of all connected players and their circle data (position, size, color).
Game State Management:

Broadcast the game state to all clients at regular intervals.
Handle incoming messages from clients, such as position updates and collision detection.
Handling New Connections and Disconnections:

Assign unique colors to new players.
Remove players from the game state when they disconnect.
*/



class Scene {
    protected game!: Game;

    update(): void {


    }

    render(): void {


    }
}

class Game {
    private static instance: Game;

    static get canvas(): HTMLCanvasElement {
        return this.instance._canvas;
    }

    static get ctx(): CanvasRenderingContext2D {
        return this.instance._ctx;
    }


    protected _canvas!: HTMLCanvasElement;
    protected _ctx!: CanvasRenderingContext2D;
    protected _sceneList: Scene[] = [];

    constructor() {
        if (Game.instance) {
            return Game.instance;
        }
        Game.instance = this;
    }

    public async init(): Promise<void> {
        console.log('init');
        // create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.backgroundColor = 'black';
        document.body.appendChild(canvas);
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    }

    public addScene(scene: Scene): void {
        this._sceneList.push(scene);
    }

    public resize(width: number, height: number): void {
        // Resize canvas the full window
        this._canvas.width = width;
        this._canvas.height = height;

        // if we need to scale the content?
    }

    public tick(dt: number): void {
        // update all scenes
        this._sceneList.forEach(scene => {
            scene.update();
        });
        // render all scenes
        this._sceneList.forEach(scene => {
            scene.render();
        });

    }
}

let lastTime = 0;
const FRAME_RATE = 60;
function loop() {
    const curr = Date.now();
    const deltaTime = curr - lastTime;
    const fps = Math.floor(1000 / deltaTime);
    const dt = Number((deltaTime / (1000 / FRAME_RATE)).toFixed(2));
    lastTime = curr;

    // @ts-ignore
    window.game.tick(dt);
    requestAnimationFrame(loop);
}


window.addEventListener('load', () => {
    const game = new Game();

    // @ts-ignore
    window['game'] = game;

    game.init().then(() => {
        game.resize(window.innerWidth, window.innerHeight);
        loop();
    });
})

window.addEventListener('resize', () => {
    // @ts-ignore
    window.game?.resize(window.innerWidth, window.innerHeight);
})

///////


// ESC framework
// World is a table
// System is a function that has access to components
// Component is a data structure (object)


interface IGameEntity {
    update(dt: number): void;
    render(dt: number): void;
}

interface IEntity extends IGameEntity {
    setWorld(world: IWorld): void;
    setId(id: number): void;
    init(): void;
    delete(): void;
}

interface IComponent {
}

interface ComponentType<T extends IComponent> {
    new(...args: any[]): T;
}

interface ISystem {
    update(dt: number): void;
}

interface SystemType {
    new(world: IWorld): ISystem;
}

class Vec2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// Components

class TransformComponent implements IComponent {
    position: Vec2;
    constructor(position: Vec2) {
        this.position = position;
    }
}

class RenderComponent implements IComponent {
    color: string;
    constructor(color: string) {
        this.color = color;
    }
}

class DirectionComponent implements IComponent {
    direction: Vec2;
    constructor(direction: Vec2) {
        this.direction = direction;
    }
}

class VelocityComponent implements IComponent {
    velocity: number;
    constructor(velocity: number) {
        this.velocity = velocity;
    }
}

class ScoreComponent implements IComponent {
    score: number;
    constructor(score: number) {
        this.score = score;
    }
}

class CircleLookComponent implements IComponent {
    radius: number;
    color: string;
    constructor(radius: number, color: string) {
        this.radius = radius;
        this.color = color;
    }
}

enum EGameState {
    PLAYING = 'playing',
    GAME_OVER = 'game_over',
}

class GameStateComponent implements IComponent {
    state: EGameState;
    constructor(state: EGameState) {
        this.state = state;
    }
}

// Systems

class MovementSystem implements ISystem {
    protected _world: IWorld;
    protected _transformPool!: Map<number, TransformComponent>;
    protected _directionPool!: Map<number, DirectionComponent>;
    protected _velocityPool!: Map<number, VelocityComponent>;

    constructor(world: IWorld) {
        this._world = world;
        // set pools by reference
        this._transformPool = world.componentPoolMap.get(TransformComponent) as Map<number, TransformComponent>;
        this._directionPool = world.componentPoolMap.get(DirectionComponent) as Map<number, DirectionComponent>;
        this._velocityPool = world.componentPoolMap.get(VelocityComponent) as Map<number, VelocityComponent>;
    }
    update(dt: number): void {
        // Update the position of entities based on their direction and velocity
    }
}

class CollisionSystem implements ISystem {
    protected _world: IWorld;
    constructor(world: IWorld) {
        this._world = world;
    }
    update(dt: number): void {
        // Detect and handle collisions between entities
    }
}

// Change how the circles look based on their size, color, etc.
class MorphSystem implements ISystem {
    protected _world: IWorld;
    constructor(world: IWorld) {
        this._world = world;
    }
    update(dt: number): void {
        // Update and display scores for players
    }
}

class GameOverSystem implements ISystem {
    protected _world: IWorld;
    constructor(world: IWorld) {
        this._world = world;
    }
    update(dt: number): void {
        // Check for game over conditions and update the game state
    }
}

// World

interface IWorld extends IGameEntity {
    registerSystem(type: SystemType): void;
    registerComponentPool(type: ComponentType<IComponent>): void;
    registerEntity(entity: IEntity): void;
    deleteEntity(id: number): void;

    setData<T extends IComponent>(id: number, type: ComponentType<T>, component: T): void;
    getData<T extends IComponent>(id: number, type: ComponentType<T>): T | null;

    entityList: (IEntity | null)[];
    systemList: ISystem[];
    componentPoolMap: Map<ComponentType<IComponent>, Map<number, IComponent>>;
}

class World implements IWorld {
    public entityList: (IEntity | null)[] = [];
    public systemList: ISystem[] = [];
    public componentPoolMap: Map<ComponentType<IComponent>, Map<number, IComponent>> = new Map();
    private freeIdList: number[] = [];

    registerSystem(type: SystemType): void {
        this.systemList.push(new type(this));
    }

    registerComponentPool(type: ComponentType<IComponent>): void {
        this.componentPoolMap.set(type, new Map());
    }

    registerEntity(entity: IEntity): void {
        if (this.freeIdList.length > 0) {
            const id = this.freeIdList.pop() as number;
            entity.setId(id);
            this.entityList[id] = entity;
        } else {
            const id = this.entityList.length;
            entity.setId(id);
            this.entityList.push(entity);
        }
        entity.setWorld(this);
        entity.init();
    }

    deleteEntity(id: number): void {
        this.entityList[id] = null;
        this.freeIdList.push(id);
        // free all components of this entity
        this.componentPoolMap.forEach(pool => {
            pool.delete(id);
        });
    }

    setData<T extends IComponent>(id: number, type: ComponentType<T>, component: T): void {
        const pool = this.componentPoolMap.get(type);
        if (pool) {
            pool.set(id, component);
        }
    }

    getData<T extends IComponent>(id: number, type: ComponentType<T>): T | null {
        const pool = this.componentPoolMap.get(type);
        if (pool) {
            return pool.get(id) as T;
        }
        return null;
    }

    update(dt: number): void {
        this.systemList.forEach(system => {
            system.update(dt);
        });
    }

    render(dt: number): void {
        // nothing to do, rendering is handled by the entities and the scene
    }
}

// Entity

class GameManager implements IGameEntity {
    protected static _takenColors: Set<string> = new Set();

    public static getUniqueColor(): string {
        const rndBrightRed = Math.floor(Math.random() * 256);
        const rndBrightGreen = Math.floor(Math.random() * 256);
        const rndBrightBlue = Math.floor(Math.random() * 256);
        const color = `rgb(${rndBrightRed}, ${rndBrightGreen}, ${rndBrightBlue})`;
        if (this._takenColors.has(color)) {
            return this.getUniqueColor();
        } else {
            this._takenColors.add(color);
            return color;
        }
    }

    update(dt: number): void {

    }

    render(dt: number): void {

    }
}

class Circle implements IEntity {
    protected _world!: IWorld;
    protected _id!: number;

    setWorld(world: IWorld): void {
        this._world = world;
    }

    setId(id: number): void {
        this._id = id;
    }

    init(): void {
        // Add components to the entity
        const newColor = GameManager.getUniqueColor();
        this._world.setData(this._id, TransformComponent, new TransformComponent(new Vec2(0, 0)));
        this._world.setData(this._id, RenderComponent, new RenderComponent(newColor));
        this._world.setData(this._id, DirectionComponent, new DirectionComponent(new Vec2(1, 1)));
        this._world.setData(this._id, VelocityComponent, new VelocityComponent(1));
        this._world.setData(this._id, ScoreComponent, new ScoreComponent(0));
        this._world.setData(this._id, CircleLookComponent, new CircleLookComponent(10, newColor));
        this._world.setData(this._id, GameStateComponent, new GameStateComponent(EGameState.PLAYING));
    }

    delete(): void {
        this._world.deleteEntity(this._id);
    }

    update(dt: number): void {
        // Update the entity's logic
    }

    render(dt: number): void {
        // Render the entity
    }
}