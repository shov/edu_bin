const BE_FETCH_CIRCLE_NETWORK_DATA_URL: string = process.env.BE_FETCH_CIRCLE_NETWORK_DATA_URL!;
const SOCKET_URL: string = process.env.SOCKET_URL!;

interface IScene {
    update(dt: number): void;
    render(dt: number): void;
    registerEntity(entity: IGameEntity): void;
    deleteEntity(entity: IGameEntity): void;
    getFirstByTag(tag: string): IGameEntity | null;
    getAllByTag(tag: string): IGameEntity[];
}

class Scene implements IScene {
    protected game!: Game;
    protected entityList: IGameEntity[] = [];

    update(dt: number): void {
        this.entityList.forEach(entity => {
            entity.update(dt);
        });
    }

    render(dt: number): void {
        this.entityList.forEach(entity => {
            entity.render(dt);
        });
    }

    registerEntity(entity: IGameEntity): void {
        this.entityList.push(entity);
    }

    deleteEntity(entity: IEntity): void {
        const index = this.entityList.indexOf(entity);
        if (index !== -1) {
            this.entityList.splice(index, 1);
        }
    }

    getFirstByTag(tag: string): IGameEntity | null {
        return this
            .entityList
            .find(entity => (entity as ITaggedGameEntity).tag === tag) ?? null;
    }

    getAllByTag(tag: string): IGameEntity[] {
        return this
            .entityList
            .filter(entity => (entity as ITaggedGameEntity).tag === tag);
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

    static getScene(index: number): Scene | null {
        return this.instance._sceneList?.[index] ?? null;
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
            scene.update(dt);
        });
        // render all scenes
        this._sceneList.forEach(scene => {
            scene.render(dt);
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

    const scene = new Scene();
    game.addScene(scene);

    const gameManager = new GameManager();
    gameManager.setTag('GameManager');
    scene.registerEntity(gameManager);

    const world = new World();
    world.setTag('World');
    world.registerSystem(MovementSystem);
    world.registerSystem(CollisionSystem);
    world.registerSystem(MorphSystem);
    world.registerSystem(GameOverSystem);
    world.registerComponentPool(TransformComponent);
    world.registerComponentPool(RenderComponent);
    world.registerComponentPool(DirectionComponent);
    world.registerComponentPool(VelocityComponent);
    world.registerComponentPool(ScoreComponent);
    world.registerComponentPool(CircleLookComponent);
    world.registerComponentPool(GameStateComponent);

    scene.registerEntity(world);

    // Request backend data for all the circles
    // Add them to the scene initially
    fetchCircleData().then((circleData: TCircleNetworkState) => {
        const circle = new Circle();
        world.registerEntity(circle); // here init()
        circle.setCircleNetworkState(circleData); // here it's rewritten
    });

    // Add user's circle to the scene that it's places close to others but no too much
    const userCircle = new Circle();
    userCircle.setTag('Player');
    world.registerEntity(userCircle); // here init()

    const pos = world.getData(userCircle.id, TransformComponent);
    if (pos) {
        pos.position = getStartPosition(world);
    }

    // @ts-ignore
    window['game'] = game;

    establishSocketConnection(() => {
        game.init().then(() => {
            game.resize(window.innerWidth, window.innerHeight);
            loop();
        });

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

interface ITaggedGameEntity extends IGameEntity {
    tag: undefined | string;
    setTag: undefined | ((tag: string) => void);
}

interface IEntity extends ITaggedGameEntity {
    setWorld(world: IWorld): void;
    setId(id: number): void;
    get id(): number;
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

    protected _mousePositionSubscribtion: any = null;

    constructor(world: IWorld) {
        this._world = world;
        // set pools by reference
        this._transformPool = world.componentPoolMap
            .get(TransformComponent) as Map<number, TransformComponent>;
        this._directionPool = world.componentPoolMap
            .get(DirectionComponent) as Map<number, DirectionComponent>;
        this._velocityPool = world.componentPoolMap
            .get(VelocityComponent) as Map<number, VelocityComponent>;
    }
    update(dt: number): void {
        const scene = Game.getScene(0)!;
        const player = scene.getFirstByTag('Player') as IEntity;
        if (!player) {
            return;
        }

        if (null === this._mousePositionSubscribtion) {
            // Listen mouse pos, update direction of the player like if pointer right-top of the center, the direction 1,1
            this._mousePositionSubscribtion = window
                .addEventListener('mousemove',
                    (event: MouseEvent) => {
                        const transform = this._world.getData(player.id, TransformComponent);
                        if (transform) {
                            const rect = Game.canvas.getBoundingClientRect();
                            const x = event.clientX - rect.left;
                            const y = event.clientY - rect.top;
                            const direction = this._world.getData(player.id, DirectionComponent);
                            if (direction) {
                                direction.direction
                                    = new Vec2(x - transform.position.x, y - transform.position.y);
                                // send direction to the server by the socket
                                if (GameManager.socket) {
                                    GameManager.socket.send(JSON.stringify({
                                        GameManager.PLAYER_DIRECTION_MESSAGE,
                                        id: player.id,
                                        direction: direction.direction,
                                    }));
                                }
                            }
                        });
        }

        // Update the position of entities based on their direction and velocity
        this._transformPool.forEach((transform, id) => {
            const direction = this._directionPool.get(id);
            const velocity = this._velocityPool.get(id);
            if (direction && velocity) {
                transform.position.x += direction.direction.x * velocity.velocity * dt;
                transform.position.y += direction.direction.y * velocity.velocity * dt;
            }
        });
        // all positions to be rewritten from socket (handled by the on message subscribtion)
    }
}

class CollisionSystem implements ISystem {
    protected _world: IWorld;

    protected _transformPool!: Map<number, TransformComponent>;
    protected _circleLookPool!: Map<number, CircleLookComponent>;
    protected _scorePool!: Map<number, ScoreComponent>;
    protected _velocityPool!: Map<number, VelocityComponent>;

    constructor(world: IWorld) {
        this._world = world;

        this._transformPool = world.componentPoolMap
            .get(TransformComponent) as Map<number, TransformComponent>;
        this._circleLookPool = world.componentPoolMap
            .get(CircleLookComponent) as Map<number, CircleLookComponent>;
        this._scorePool = world.componentPoolMap
            .get(ScoreComponent) as Map<number, ScoreComponent>;
        this._velocityPool = world.componentPoolMap
            .get(VelocityComponent) as Map<number, VelocityComponent>;
    }

    update(dt: number): void {
        // Detect and handle collisions between entities
        const positions: Vec2[] = [];
        const sizes: number[] = [];

        this._transformPool.forEach((transform, id) => {
            positions.push(transform.position);
        });

        this._circleLookPool.forEach((circleLook, id) => {
            sizes.push(circleLook.radius);
        });

        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                const dx = positions[i].x - positions[j].x;
                const dy = positions[i].y - positions[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < sizes[i] + sizes[j]) {
                    // handle collision
                    const biggerCircleId = sizes[i] > sizes[j] ? i : j;
                    const smallerCircleId = sizes[i] > sizes[j] ? j : i;

                    const score = this._scorePool.get(biggerCircleId);
                    if (score) {
                        score.score += 1;
                    }

                    const circleLook = this._circleLookPool.get(biggerCircleId);
                    if (circleLook) {
                        circleLook.radius += sizes[smallerCircleId] / 2;
                    }

                    const velocity = this._velocityPool.get(biggerCircleId);
                    if (velocity) {
                        velocity.velocity -= sizes[smallerCircleId] * 0.05;
                    }

                    const smallerCircle = this._world.getEntity(smallerCircleId);
                    const scene = Game.getScene(0)!;
                    const player = scene.getFirstByTag('Player') as IEntity;
                    if (smallerCircle && player && smallerCircle.id === player.id) {
                        // game over
                        const gameState = this._world.getData(player.id, GameStateComponent);
                        if (gameState) {
                            gameState.state = EGameState.GAME_OVER;
                        }
                    } else {
                        if (smallerCircle) {
                            smallerCircle.delete();
                            scene.deleteEntity(smallerCircle);
                        }
                    }

                }
            }
        }
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

interface IWorld extends ITaggedGameEntity {
    registerSystem(type: SystemType): void;
    registerComponentPool(type: ComponentType<IComponent>): void;
    registerEntity(entity: IEntity): void;
    deleteEntity(id: number): void;
    getEntity(id: number): IEntity | null;

    setData<T extends IComponent>(id: number, type: ComponentType<T>, component: T): void;
    getData<T extends IComponent>(id: number, type: ComponentType<T>): T | null;

    entityMap: Map<number
    systemList: ISystem[];
    componentPoolMap: Map<ComponentType<IComponent>, Map<number, IComponent>>;
}

class World implements IWorld {
    private _tag: string | undefined = void 0;
    public get tag(): undefined | string {
        return this._tag;
    }

    public setTag(tag: string): void {
        this._tag = tag;
    }

    public entityMap: Map<number, IEntity> = new Map();
    public systemList: ISystem[] = [];
    public componentPoolMap: Map<ComponentType<IComponent>, Map<number, IComponent>> = new Map();

    registerSystem(type: SystemType): void {
        this.systemList.push(new type(this));
    }

    registerComponentPool(type: ComponentType<IComponent>): void {
        this.componentPoolMap.set(type, new Map());
    }

    registerEntity(entity: IEntity, id: number): void {
        this.entityMap.set(id, entity);
        entity.setWorld(this);
        entity.init();
    }

    deleteEntity(id: number): void {
        this.entityMap[id] = null;
        this.freeIdList.push(id);
        // free all components of this entity
        this.componentPoolMap.forEach(pool => {
            pool.delete(id);
        });
    }

    getEntity(id: number): IEntity | null {
        return this.entityMap?.[id] || null;
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

class GameManager implements ITaggedGameEntity {
    private _tag: string | undefined = void 0;
    public get tag(): undefined | string {
        return this._tag;
    }

    public setTag(tag: string): void {
        this._tag = tag;
    }

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

    public static FIELD_WIDTH = 5_000;
    public static FIELD_HEIGHT = 5_000;

    public static INITIAL_RADIUS = 10;

    public static PLAYER_REGISTER_MESSAGE = 'player_register_message';
    public static PLAYER_DIRECTION_MESSAGE = 'player_direction_message';
    public static SERVER_CIRCLE_STATE_MESSAGE = 'server_circle_state_message';

    public static socket: WebSocket | null = null;


    update(dt: number): void {

    }

    render(dt: number): void {

    }
}

class Circle implements IEntity {
    protected _world!: IWorld;
    protected _id!: number;

    public get id(): number {
        return this._id;
    }

    protected _tag: undefined | string = void 0;
    public get tag(): undefined | string {
        return this._tag;
    }

    public setTag(tag: string): void {
        this._tag = tag;
    }

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
        this._world.setData(this._id, CircleLookComponent, new CircleLookComponent(GameManager.INITIAL_RADIUS, newColor));
        this._world.setData(this._id, GameStateComponent, new GameStateComponent(EGameState.PLAYING));
    }

    setCircleNetworkState(networkState: TCircleNetworkState): void {
        // Update the entity's state based on network data
        const transform = this._world
            .getData(this._id, TransformComponent);
        if (transform) {
            transform.position = networkState.position;
        }
        const direction = this._world
            .getData(this._id, DirectionComponent);
        if (direction) {
            direction.direction = networkState.direction;
        }
        const velocity = this._world
            .getData(this._id, VelocityComponent);
        if (velocity) {
            velocity.velocity = networkState.velocity;
        }
        const score = this._world
            .getData(this._id, ScoreComponent);
        if (score) {
            score.score = networkState.score;
        }
        const circleLook = this._world
            .getData(this._id, CircleLookComponent);
        if (circleLook) {
            circleLook.radius = networkState.radius;
            circleLook.color = networkState.color;
        }
        const gameState = this._world
            .getData(this._id, GameStateComponent);
        if (gameState) {
            gameState.state = networkState.state;
        }
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

// Network FE

type TCircleNetworkState = {
    id: number;
    position: Vec2;
    color: string;
    direction: Vec2;
    velocity: number;
    score: number;
    radius: number;
    state: EGameState;
}

async function fetchCircleData(): Promise<TCircleNetworkState> {
    // Fetch circle data from the server
    const r = await fetch(BE_FETCH_CIRCLE_NETWORK_DATA_URL);
    return r.json();
}

type TIncomingSocketMessage = {
    name: string;
    payload: any;
}

async function establishSocketConnection(cb: (...args: any[]) => void): Promise<any> {
    // Establish a WebSocket connection with the server
    GameManager.socket = new WebSocket(SOCKET_URL);

    GameManager.socket.onopen = () => {
        console.log('Socket connection established');
        cb();
    };

    GameManager.socket.onmessage = (event) => {
        const data: TIncomingSocketMessage = JSON.parse(event.data);

        if (data.name === GameManager.SERVER_CIRCLE_STATE_MESSAGE) {
            // get world
            const world = Game.getScene(0)!.getFirstByTag('World') as IWorld;

            // Update the entity's state based on the received data
            data.payload.forEach(
                (circleData: TCircleNetworkState) => {
                    const circle = world.entityMap[circleData.id];
                    if (circle) {
                        const entity = circle as Circle;
                        entity.setCircleNetworkState(circleData);
                    }
                });
        }
    };

    GameManager.socket.onclose = () => {
        console.log('Socket connection closed');
    };
}

// GAME BUSINESS LOGIC

function getStartPosition(world: IWorld): Vec2 {
    // Get all the positions of the existing circles
    const positions: Vec2[] = [];
    world.entityMap.forEach(entity => {
        if (entity) {
            const transform = world.getData(entity.id, TransformComponent);
            if (transform) {
                positions.push(transform.position);
            }
        }
    });

    const sizes: number[] = [];

    world.entityMap.forEach(entity => {
        if (entity) {
            const circleLook = world.getData(entity.id, CircleLookComponent);
            if (circleLook) {
                sizes.push(circleLook.radius);
            }
        }
    });

    // Find a position that is not too close to any existing circle but not too far
    // Take in consideration size of every circle

    let x = 0;
    let y = 0;
    let isPositionOk = false;
    while (!isPositionOk) {
        x = Math.floor(Math.random() * GameManager.FIELD_WIDTH);
        y = Math.floor(Math.random() * GameManager.FIELD_HEIGHT);

        isPositionOk = true;
        for (let i = 0; i < positions.length; i++) {
            const distance = Math.sqrt(
                (x - positions[i].x) ** 2 + (y - positions[i].y) ** 2
            )
                - sizes[i]
                - GameManager.INITIAL_RADIUS;
            if (distance < GameManager.INITIAL_RADIUS * 2) {
                isPositionOk = false;
                break;
            }
        }
    }

    return new Vec2(x, y);
}

/// SERVERSIDE
namespace ServerSide {

    const WebSocket = require('ws');

    const server = new WebSocket.Server({ port: 8080 });

    let players = {};

    server.on('connection', (ws: WebSocket) => {
        const id = Math.random().toString(36).substr(2, 9);
        const color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        players[id] = { id, x: Math.random() * 800, y: Math.random() * 600, radius: 20, color };

        ws.id = id;
        ws.send(JSON.stringify({ id }));

        ws.on('message', (message) => {
            const { id, x, y } = JSON.parse(message);
            if (players[id]) {
                players[id].x = x;
                players[id].y = y;

                for (const playerId in players) {
                    if (playerId !== id) {
                        const dx = players[playerId].x - x;
                        const dy = players[playerId].y - y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < players[playerId].radius + players[id].radius) {
                            if (players[id].radius > players[playerId].radius) {
                                players[id].radius += players[playerId].radius / 2;
                                delete players[playerId];
                            } else {
                                players[playerId].radius += players[id].radius / 2;
                                delete players[id];
                            }
                        }
                    }
                }
            }
        });

        ws.on('close', () => {
            delete players[ws.id];
        });
    });

    setInterval(() => {
        const gameState = { players: Object.values(players) };
        server.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(gameState));
            }
        });
    }, 1000 / 30); // 30 FPS
}