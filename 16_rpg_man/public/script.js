/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities/Apple.ts":
/*!*******************************!*\
  !*** ./src/entities/Apple.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Apple = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
let appleCounter = 0;
class Apple extends AEntity_1.AEntity {
    constructor(location, sprite) {
        super(`Apple${appleCounter++}`);
        this.fillColor = 'red';
        this.strokeColor = 'yellow';
        this.location = location.clone();
        this.sprite = sprite;
    }
    init(scene) {
        this.gc = scene.get('gameController');
    }
    render(canvas, ctx, dt, delta, fps) {
        this.gc.drawSpriteOnBoard(ctx, this.location, this.sprite);
    }
}
exports.Apple = Apple;


/***/ }),

/***/ "./src/entities/BoardMap.ts":
/*!**********************************!*\
  !*** ./src/entities/BoardMap.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BoardMap = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
class BoardMap extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.color = 'grey';
        this.wallList = [];
    }
    init(scene) {
        super.init(scene);
        this.gc = scene.get('gameController');
        this.setupWalls();
    }
    render(canvas, ctx, dt, delta, fps) {
        this.wallList.forEach(wall => {
            this.gc.drawSpriteOnBoard(ctx, wall, this.scene.imageLoader.get('wall'));
        });
    }
    getAllWallsLocationList() {
        return this.wallList.map(w => w.clone());
    }
    setupWalls() {
        const w = this.gc.boardSize.w;
        const h = this.gc.boardSize.h;
        for (let i = h / 4 | 0; i < h - (h / 4 | 0); i++) {
            this.wallList.push(new Vector2_1.Vector2(3, i));
            this.wallList.push(new Vector2_1.Vector2(w - 1 - 3, i));
        }
        for (let i = w / 4 | 0; i < w - (w / 4 | 0); i++) {
            this.wallList.push(new Vector2_1.Vector2(i, 3));
            this.wallList.push(new Vector2_1.Vector2(i, h - 1 - 3));
        }
    }
}
exports.BoardMap = BoardMap;


/***/ }),

/***/ "./src/entities/GameController.ts":
/*!****************************************!*\
  !*** ./src/entities/GameController.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameController = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Apple_1 = __webpack_require__(/*! ./Apple */ "./src/entities/Apple.ts");
class GameController extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.cellSize = 20;
        this.screenColor = 'black';
        this._isGameOver = false;
        this.appleList = [];
        this.MAX_APPLE_NUM = 5;
        this.APPLE_APPEAR_INTERVAL = 60 * 3;
        this.currentCountdownToPlaceAnApple = this.APPLE_APPEAR_INTERVAL * Math.random() | 0;
        this.padding = 2;
    }
    get boardSize() {
        return this._boardSize;
    }
    get isGameOver() {
        return this._isGameOver;
    }
    init(scene) {
        super.init(scene);
        this._boardSize = new Size2_1.Size2((scene.frameSize.w / this.cellSize) | 0, (scene.frameSize.h / this.cellSize) | 0);
        this.snek = this.scene.get('snake');
        this.boardMap = this.scene.get('boardMap');
    }
    update(dt, input) {
        if (this.isGameOver && input.space) {
            this.snek.reset();
            this._isGameOver = false;
        }
        if (this.isGameOver) {
            return;
        }
        // walls collision
        const collideAWall = this.boardMap.getAllWallsLocationList().some(w => w.equal(this.snek.getHeadPosition()));
        if (collideAWall) {
            this.gameOver();
            return;
        }
        // apple collisions
        this.appleList = this.appleList.reduce((acc, apple) => {
            if (this.snek.getHeadPosition().equal(apple.location)) {
                this.snek.willGrow();
                this.scene.remove(apple.name);
                return acc;
            }
            acc.push(apple);
            return acc;
        }, []);
        // new apples
        this.currentCountdownToPlaceAnApple--;
        if (this.currentCountdownToPlaceAnApple <= 0) {
            switch (true) {
                case (this.appleList.length < this.MAX_APPLE_NUM): {
                    const takenLocations = [
                        ...this.appleList.map(a => a.location.clone()),
                        ...this.boardMap.getAllWallsLocationList(),
                        ...this.snek.getPositionList(),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.up()),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.down()),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.left()),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.right()),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.up().add(Vector2_1.Vector2.right())),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.right().add(Vector2_1.Vector2.down())),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.down().add(Vector2_1.Vector2.left())),
                        this.snek.getHeadPosition().add(Vector2_1.Vector2.left().add(Vector2_1.Vector2.up())),
                    ];
                    let appleLoc;
                    do {
                        appleLoc = new Vector2_1.Vector2((this.boardSize.w - 1) * Math.random() | 0, (this.boardSize.h - 1) * Math.random() | 0);
                    } while (takenLocations.some(t => t.equal(appleLoc)));
                    const newApple = new Apple_1.Apple(appleLoc, this.scene.imageLoader.get('apple'));
                    this.scene.add(newApple);
                    newApple.init(this.scene);
                    this.appleList.push(newApple);
                }
                default: {
                    this.currentCountdownToPlaceAnApple = this.APPLE_APPEAR_INTERVAL * Math.random() | 0;
                }
            }
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = this.screenColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    drawCell(ctx, location, color, strokeColor) {
        ctx.fillStyle = color;
        ctx.fillRect(location.x * this.cellSize + this.padding, location.y * this.cellSize + this.padding, this.cellSize - this.padding * 2, this.cellSize - this.padding * 2);
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.strokeRect(location.x * this.cellSize + this.padding, location.y * this.cellSize + this.padding, this.cellSize - this.padding * 2, this.cellSize - this.padding * 2);
        }
    }
    drawSpriteOnBoard(ctx, location, sprite, angle) {
        if ('number' === typeof angle) {
            ctx.translate(location.x * this.cellSize + sprite.width / 2, location.y * this.cellSize + sprite.height / 2);
            ctx.rotate(angle);
            ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return;
        }
        ctx.drawImage(sprite, location.x * this.cellSize, location.y * this.cellSize);
    }
    gameOver() {
        this._isGameOver = true;
    }
}
exports.GameController = GameController;


/***/ }),

/***/ "./src/entities/GameOverLayer.ts":
/*!***************************************!*\
  !*** ./src/entities/GameOverLayer.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameOverLayer = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
class GameOverLayer extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.GO_TEXT = 'GAME OVER SNEK!';
        this.PLAY_AGAIN_TEXT = '[ PRESS SPACE TO RESTART ]';
        this.maxForBlink = 24;
        this.blinkCounter = 0;
    }
    init(scene) {
        super.init(scene);
        this.gc = scene.get('gameController');
    }
    render(canvas, ctx, dt, delta, fps) {
        if (this.gc.isGameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '40px bold';
            const mt = ctx.measureText(this.GO_TEXT);
            ctx.fillText(this.GO_TEXT, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2);
            this.blinkCounter++;
            if (this.blinkCounter < this.maxForBlink / 2) {
                ctx.fillStyle = 'yellow';
                ctx.font = '16px bold';
                const mt = ctx.measureText(this.PLAY_AGAIN_TEXT);
                ctx.fillText(this.PLAY_AGAIN_TEXT, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2 + 45);
            }
            else if (this.blinkCounter >= this.maxForBlink) {
                this.blinkCounter = 0;
            }
        }
    }
}
exports.GameOverLayer = GameOverLayer;


/***/ }),

/***/ "./src/entities/Snake.ts":
/*!*******************************!*\
  !*** ./src/entities/Snake.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snake = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const rndClr = (from = 100, to = 255) => (from + Math.random() * (to - from) | 0).toString(16);
const randomGreenBody = () => {
    const green = rndClr(160, 200);
    const sec = rndClr(50, 70);
    return `#${sec}${green}${sec}`;
};
class SnakeSegment {
    constructor() {
        this.location = new Vector2_1.Vector2(0, 0);
        this.color = randomGreenBody();
    }
    render(ctx, gc) {
        gc.drawCell(ctx, this.location, this.color);
    }
    follow(next) {
        this.location = next.location.clone();
    }
    moveBy(deltaLoc) {
        this.location = this.location.add(deltaLoc);
    }
}
SnakeSegment.HEAD_COLOR = 'lime';
SnakeSegment.BODY_COLOR = 'green';
class SnakeHeadSegment extends SnakeSegment {
    constructor(location) {
        super();
        this.color = SnakeSegment.HEAD_COLOR;
        this.location = location.clone();
    }
}
class Snake extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.MOVE_INTERVAL = 8; // todo use dt
        this.MIN_MOVE_INTERVAL = 3;
        this.MAX_LENGTH = 100;
        this.DEFAULT_DELTA = new Vector2_1.Vector2(0, 1);
        this.lastAcceptedDtLoc = this.DEFAULT_DELTA;
        this.ticksToNextMove = this.MOVE_INTERVAL;
        this.toGrow = 0;
    }
    init(scene) {
        super.init(scene);
        this.gc = scene.get('gameController');
        if (!this.gc) {
            throw new Error('GameController not found');
        }
        this.reset();
    }
    update(dt, input) {
        if (this.gc.isGameOver) {
            return;
        }
        // snek cannot change direction to an opposite!
        const ladl = this.lastAcceptedDtLoc;
        const isLen1 = this.segmentList.length === 1;
        if (input.up
            && (isLen1 || !ladl.equal(Vector2_1.Vector2.down()))) {
            this.deltaLoc = Vector2_1.Vector2.up();
        }
        else if (input.down
            && (isLen1 || !ladl.equal(Vector2_1.Vector2.up()))) {
            this.deltaLoc = Vector2_1.Vector2.down();
        }
        else if (input.left
            && (isLen1 || !ladl.equal(Vector2_1.Vector2.right()))) {
            this.deltaLoc = Vector2_1.Vector2.left();
        }
        else if (input.right
            && (isLen1 || !ladl.equal(Vector2_1.Vector2.left()))) {
            this.deltaLoc = Vector2_1.Vector2.right();
        }
        this.ticksToNextMove -= 1;
        if (this.ticksToNextMove <= 0) {
            // grow
            if (input.shiftKey) {
                this.grow();
            }
            while (this.toGrow > 0) {
                this.grow();
                this.toGrow--;
            }
            // one step delta loc
            const deltaLoc = this.deltaLoc.clone();
            // last accepted dt loc
            this.lastAcceptedDtLoc = deltaLoc.clone();
            // detect out of the board
            // transfer to another side?
            {
                const nextCell = this.head.location.add(deltaLoc);
                if (nextCell.x < 0) {
                    deltaLoc.x = this.gc.boardSize.w - 1; // move to the very right 
                }
                if (nextCell.x >= this.gc.boardSize.w) {
                    deltaLoc.x = 1 - this.gc.boardSize.w; // move to the very left
                }
                if (nextCell.y < 0) {
                    deltaLoc.y = this.gc.boardSize.h - 1; // move to the very bottom
                }
                if (nextCell.y >= this.gc.boardSize.h) {
                    deltaLoc.y = 1 - this.gc.boardSize.h; // move to the very top
                }
            }
            // detect collision with the tail
            // game over
            {
                const nextCell = this.head.location.add(deltaLoc);
                const isCollidedTheTail = this.segmentList
                    .slice(0, -1)
                    .some(seg => seg.location.equal(nextCell));
                if (isCollidedTheTail) {
                    this.gc.gameOver();
                    return;
                }
            }
            // - detect collision with an obstacle
            // - detect collision with an apple
            //  \_ are conducted by GameController
            this.moveBy(deltaLoc);
            this.ticksToNextMove = Math.max(this.MOVE_INTERVAL / (this.segmentList.length / 2) | 0, this.MIN_MOVE_INTERVAL);
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        this.segmentList.slice(1).forEach(seg => {
            seg.render(ctx, this.gc);
        });
        // draw head
        let angle = 0;
        if (this.deltaLoc.equal(Vector2_1.Vector2.up())) {
            angle = 0;
        }
        else if (this.deltaLoc.equal(Vector2_1.Vector2.down())) {
            angle = Math.PI;
        }
        else if (this.deltaLoc.equal(Vector2_1.Vector2.left())) {
            angle = Math.PI * 1.5;
        }
        else if (this.deltaLoc.equal(Vector2_1.Vector2.right())) {
            angle = Math.PI / 2;
        }
        this.gc.drawSpriteOnBoard(ctx, this.head.location, this.scene.imageLoader.get('snek'), angle);
    }
    reset() {
        this.startLocation = new Vector2_1.Vector2((this.gc.boardSize.w / 2 | 0) - 1, (this.gc.boardSize.h / 2 | 0) - 1);
        this.segmentList = [new SnakeHeadSegment(this.startLocation)];
        this.head = this.segmentList[0];
        this.deltaLoc = this.DEFAULT_DELTA;
    }
    getPositionList() {
        return this.segmentList.map(seg => seg.location.clone());
    }
    getHeadPosition() {
        return this.head.location.clone();
    }
    willGrow() {
        this.toGrow++;
    }
    grow() {
        if (this.segmentList.length < this.MAX_LENGTH) {
            this.segmentList.push(new SnakeSegment());
        }
    }
    moveBy(deltaLoc) {
        for (let i = this.segmentList.length - 1; i > 0; i--) {
            this.segmentList[i]
                .follow(this.segmentList[i - 1]);
        }
        this.head.moveBy(deltaLoc);
    }
}
exports.Snake = Snake;


/***/ }),

/***/ "./src/infrastructure/AEntity.ts":
/*!***************************************!*\
  !*** ./src/infrastructure/AEntity.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AEntity = void 0;
class AEntity {
    constructor(name = 'unnamed' + crypto.randomUUID()) {
        this.name = name;
        this.tagList = [];
    }
    init(scene) {
        this.scene = scene;
    }
    update(dt, input) {
    }
    render(canvas, ctx, dt, delta, fps) {
    }
    destroy() {
        this.scene.remove(this.name);
    }
}
exports.AEntity = AEntity;


/***/ }),

/***/ "./src/infrastructure/AScene.ts":
/*!**************************************!*\
  !*** ./src/infrastructure/AScene.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AScene = void 0;
const Collider_1 = __webpack_require__(/*! ./Collider */ "./src/infrastructure/Collider.ts");
const Size2_1 = __webpack_require__(/*! ./Size2 */ "./src/infrastructure/Size2.ts");
const ImageLoader_1 = __webpack_require__(/*! ./ImageLoader */ "./src/infrastructure/ImageLoader.ts");
class AScene {
    constructor() {
        this._entityMap = {};
        this._tagDict = {}; // tag -> nameList
        this._collisionBodyMap = {};
        this.imageLoader = new ImageLoader_1.ImageLoader(); // todo asset or resource loader
        this.frameSize = new Size2_1.Size2(0, 0);
    }
    get entityList() {
        return Object.values(this._entityMap);
    }
    get collisionBodyList() {
        return Object.values(this._collisionBodyMap);
    }
    init(engine, canvas) {
        this.frameSize = new Size2_1.Size2(canvas.width, canvas.height);
        this._engine = engine;
        return Promise.resolve(Promise.all(this.entityList.map(entity => entity.init(this)))).then();
    }
    update(dt, input) {
        // Collisions
        const { coupleList, tagMap } = new Collider_1.Collider(this.collisionBodyList)
            .process();
        coupleList.forEach(([a, b]) => {
            a.callCollision(b);
            b.callCollision(a);
        });
        [...tagMap.keys()].forEach(b => {
            const oneTagBranch = tagMap.get(b);
            Object.keys(oneTagBranch).forEach(tag => {
                b.callTagCollision(tag, oneTagBranch[tag]);
            });
        });
        // Update
        for (const entity of this.entityList) {
            entity.update(dt, input);
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        // Default clear scene before all the entities rendered
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const entity of this.entityList) {
            entity.render(canvas, ctx, dt, delta, fps);
        }
    }
    add(...args) {
        var _a;
        let name;
        let entity;
        if (args.length > 1 && 'string' === typeof args[0]) {
            name = args[0];
            entity = args[1];
            entity.name = name;
        }
        else {
            entity = args[0];
            name = entity.name;
        }
        this._entityMap[name] = entity;
        // Tags
        entity.tagList.forEach(tag => {
            var _a;
            var _b;
            (_a = (_b = this._tagDict)[tag]) !== null && _a !== void 0 ? _a : (_b[tag] = []);
            this._tagDict[tag].push(name);
        });
        // Collisions
        if ((_a = entity === null || entity === void 0 ? void 0 : entity.componentList) === null || _a === void 0 ? void 0 : _a.includes('boxCollider')) {
            this._collisionBodyMap[name] = entity;
        }
    }
    remove(name) {
        if (!this._entityMap[name])
            return;
        this._entityMap[name].tagList.forEach(tag => {
            this._tagDict[tag] = this._tagDict[tag].filter(entityName => entityName !== name);
        });
        delete this._entityMap[name];
        delete this._collisionBodyMap[name];
    }
    get(name) {
        return this._entityMap[name];
    }
    findByTag(tag) {
        return (this._tagDict[tag] || []).map(name => this.get(name));
    }
}
exports.AScene = AScene;


/***/ }),

/***/ "./src/infrastructure/Collider.ts":
/*!****************************************!*\
  !*** ./src/infrastructure/Collider.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Collider = void 0;
class Collider {
    constructor(_bodyList) {
        this._bodyList = _bodyList;
    }
    process() {
        const openFirstOrder = ['open', 'close']; // if two figures stay on one line they must cross
        const xRefList = this._bodyList.reduce((acc, b) => {
            acc.push({ v: b.scruff.x, pos: 'open', ref: b });
            acc.push({ v: b.scruff.x + b.size.w, pos: 'close', ref: b });
            return acc;
        }, []).sort((a, b) => {
            return a.v - b.v || (openFirstOrder.indexOf(a.pos) - openFirstOrder.indexOf(b.pos));
        });
        const xCandidatePathMap = new Map();
        let currOpenMap = new Map();
        xRefList.forEach(cr => {
            if (cr.pos === 'open') {
                // pair with all open
                ;
                [...currOpenMap.values()].forEach(openCr => {
                    // push both-direction paths
                    xCandidatePathMap.set(cr.ref, (xCandidatePathMap.get(cr.ref) || new Set()).add(openCr.ref));
                    xCandidatePathMap.set(openCr.ref, (xCandidatePathMap.get(openCr.ref) || new Set()).add(cr.ref));
                });
                // set open itself
                currOpenMap.set(cr.ref, cr);
            }
            else {
                // close
                currOpenMap.delete(cr.ref);
            }
        });
        const yRefList = this._bodyList.reduce((acc, b) => {
            acc.push({ v: b.scruff.y, pos: 'open', ref: b });
            acc.push({ v: b.scruff.y + b.size.h, pos: 'close', ref: b });
            return acc;
        }, []).sort((a, b) => {
            return a.v - b.v || (openFirstOrder.indexOf(a.pos) - openFirstOrder.indexOf(b.pos));
        });
        currOpenMap = new Map();
        const coupleList = [];
        const tagMap = new Map();
        yRefList.forEach(cr => {
            if (cr.pos === 'open') {
                // check existing collisions by x (one direction is enough)
                ;
                [...currOpenMap.values()].forEach(openCr => {
                    const xRoot = xCandidatePathMap.get(cr.ref);
                    if (xRoot && xRoot.has(openCr.ref)) {
                        coupleList.push([cr.ref, openCr.ref]);
                        const tagDict = (tagMap.get(cr.ref) || {});
                        openCr.ref.tagList.forEach(tag => {
                            var _a;
                            (_a = tagDict[tag]) !== null && _a !== void 0 ? _a : (tagDict[tag] = []);
                            tagDict[tag].push(openCr.ref);
                        });
                        if (Object.keys(tagDict).length > 0) {
                            tagMap.set(cr.ref, tagDict);
                        }
                    }
                });
                // set open itself
                currOpenMap.set(cr.ref, cr);
            }
            else {
                // close
                currOpenMap.delete(cr.ref);
            }
        });
        return { coupleList, tagMap };
    }
}
exports.Collider = Collider;


/***/ }),

/***/ "./src/infrastructure/Engine.ts":
/*!**************************************!*\
  !*** ./src/infrastructure/Engine.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Engine = void 0;
class Engine {
    constructor() {
        this.FRAME_RATE = 60;
        this.isDebugOn = false;
    }
    get canvas() {
        return this._canvas;
    }
    get ctx() {
        return this._ctx;
    }
    get input() {
        return this._input;
    }
    start(canvas, ctx, input, scene) {
        return __awaiter(this, void 0, void 0, function* () {
            this._canvas = canvas;
            this._ctx = ctx;
            this._input = input;
            this._currentScene = scene;
            this._input.onKeyPress('KeyG', () => {
                this.isDebugOn = !this.isDebugOn;
            });
            this._input.start();
            yield Promise.resolve(scene.init(this, canvas));
            this._lastFrameTime = Date.now();
            requestAnimationFrame(time => this._gameLoop(time));
        });
    }
    changeScene() {
        // TODO
    }
    _gameLoop(time) {
        const delta = time - this._lastFrameTime;
        this._lastFrameTime = time;
        const fps = Math.floor(1000 / delta);
        const dt = Math.max(0, Number(Math.round(delta / (1000 / this.FRAME_RATE)).toFixed(2)));
        // input
        this._input.update(dt);
        // update
        this._currentScene.update(dt, this._input);
        // render
        this._currentScene.render(this._canvas, this._ctx, dt, delta, fps);
        // debug
        this._debug(dt, delta, fps);
        // next iteration
        requestAnimationFrame(time => this._gameLoop(time));
    }
    _debug(dt, delta, fps) {
        if (this.isDebugOn) {
            this._ctx.fillStyle = 'black';
            this._ctx.strokeStyle = 'white';
            this._ctx.fillRect(0, 0, 120, 85);
            this._ctx.font = '15px serif';
            this._ctx.strokeText(`∂ ${dt}`, 10, 15, 100);
            this._ctx.strokeText(`Δ: ${delta}`, 10, 30, 100);
            this._ctx.strokeText(`fps: ${fps}`, 10, 45, 100);
            this._ctx.strokeText(`obj.count: ${this._currentScene.entityList.length}`, 10, 60, 100);
            this._ctx.strokeText(`in H,V: ${this._input.horizontal.toFixed(2)},${this.input.vertical.toFixed(2)}`, 10, 75, 100);
        }
    }
}
exports.Engine = Engine;


/***/ }),

/***/ "./src/infrastructure/ImageLoader.ts":
/*!*******************************************!*\
  !*** ./src/infrastructure/ImageLoader.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ImageLoader = void 0;
class ImageLoader {
    constructor() {
        this._map = new Map();
    }
    load(name, src) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((r, j) => {
                const img = new Image();
                img.src = src;
                img.onerror = j;
                img.onload = () => {
                    this._map.set(name, img);
                    r();
                };
            });
        });
    }
    delete(name) {
        this._map.delete(name);
    }
    get(name) {
        return this._map.get(name);
    }
}
exports.ImageLoader = ImageLoader;


/***/ }),

/***/ "./src/infrastructure/InputManager.ts":
/*!********************************************!*\
  !*** ./src/infrastructure/InputManager.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputManager = void 0;
// TODO add mouse
class InputManager {
    constructor() {
        this.up = false;
        this.left = false;
        this.right = false;
        this.down = false;
        this.space = false;
        this.horizontal = 0;
        this.vertical = 0;
        this.key = void 0;
        this.code = void 0;
        this.altKey = false;
        this.ctrlKey = false;
        this.metaKey = false;
        this.shiftKey = false;
        this._started = false;
        this._subscriptionDict = {};
        this._keyDownListener = (e) => {
            this.key = e.key;
            this.code = e.code;
            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.metaKey = e.metaKey;
            this.shiftKey = e.shiftKey;
            switch (e.code) {
                case 'Space':
                    this.space = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.left = true;
                    if (this.horizontal > 0)
                        this.horizontal = 0;
                    this._axisCurrHorizontalMove = this._axisTable.hde;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.right = true;
                    if (this.horizontal < 0)
                        this.horizontal = 0;
                    this._axisCurrHorizontalMove = this._axisTable.hie;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.up = true;
                    if (this.vertical < 0)
                        this.vertical = 0;
                    this._axisCurrVerticalMove = this._axisTable.vde;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.down = true;
                    if (this.vertical > 0)
                        this.vertical = 0;
                    this._axisCurrVerticalMove = this._axisTable.vie;
                    break;
            }
            ;
            (this._subscriptionDict[e.code] || []).forEach(cb => cb());
        };
        this._keyUpListener = (e) => {
            this.key = e.key;
            this.code = e.code;
            this.altKey = e.altKey;
            this.ctrlKey = e.ctrlKey;
            this.metaKey = e.metaKey;
            this.shiftKey = e.shiftKey;
            switch (e.code) {
                case 'Space':
                    this.space = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.left = false;
                    if (!this.right) {
                        this._axisCurrHorizontalMove = this._axisTable.hiz;
                    }
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.right = false;
                    if (!this.left) {
                        this._axisCurrHorizontalMove = this._axisTable.hdz;
                    }
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.up = false;
                    if (!this.down) {
                        this._axisCurrVerticalMove = this._axisTable.viz;
                    }
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.down = false;
                    if (!this.up) {
                        this._axisCurrVerticalMove = this._axisTable.vdz;
                    }
                    break;
            }
        };
        this.axisSensitivity = 1 / 10;
        this._axisTable = {
            hie: (dt) => {
                const v = this.horizontal + dt * this.axisSensitivity;
                return v >= 1 ? 1 : v;
            },
            hiz: (dt) => {
                const v = this.horizontal + dt * this.axisSensitivity;
                return v >= 0 ? 0 : v;
            },
            hde: (dt) => {
                const v = this.horizontal - dt * this.axisSensitivity;
                return v <= -1 ? -1 : v;
            },
            hdz: (dt) => {
                const v = this.horizontal - dt * this.axisSensitivity;
                return v <= 0 ? 0 : v;
            },
            vie: (dt) => {
                const v = this.vertical + dt * this.axisSensitivity;
                return v >= 1 ? 1 : v;
            },
            viz: (dt) => {
                const v = this.vertical + dt * this.axisSensitivity;
                return v >= 0 ? 0 : v;
            },
            vde: (dt) => {
                const v = this.vertical - dt * this.axisSensitivity;
                return v <= -1 ? -1 : v;
            },
            vdz: (dt) => {
                const v = this.vertical - dt * this.axisSensitivity;
                return v <= 0 ? 0 : v;
            },
        };
        this._axisCurrHorizontalMove = this._axisTable.hiz;
        this._axisCurrVerticalMove = this._axisTable.viz;
    }
    start() {
        if (this._started)
            return;
        document.addEventListener('keydown', this._keyDownListener);
        document.addEventListener('keyup', this._keyUpListener);
        this._started = true;
    }
    stop() {
        if (!this._started)
            return;
        document.removeEventListener('keydown', this._keyDownListener);
        document.removeEventListener('keyup', this._keyUpListener);
        this._started = false;
    }
    update(dt) {
        this.horizontal = this._axisCurrHorizontalMove(dt);
        this.vertical = this._axisCurrVerticalMove(dt);
    }
    onKeyPress(code, cb) {
        var _a;
        var _b;
        (_a = (_b = this._subscriptionDict)[code]) !== null && _a !== void 0 ? _a : (_b[code] = []);
        this._subscriptionDict[code].push(cb);
    }
    unsubscribeKeyPress(code, cb) {
        if (!this._subscriptionDict[code])
            return;
        this._subscriptionDict[code] = this._subscriptionDict[code].filter(listener => listener !== cb);
    }
}
exports.InputManager = InputManager;


/***/ }),

/***/ "./src/infrastructure/Size2.ts":
/*!*************************************!*\
  !*** ./src/infrastructure/Size2.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Size2 = void 0;
class Size2 {
    constructor(...args) {
        this.w = 0;
        this.h = 0;
        if ('number' === typeof args[0]) {
            this.w = args[0];
            this.h = 'number' === typeof args[1] ? args[1] : args[0];
        }
        else {
            this.w = args[0].w;
            this.h = args[0].h;
        }
    }
    add(subj) {
        if ('number' === typeof subj) {
            this.w += subj;
            this.h += subj;
            return this;
        }
        this.w += subj.w;
        this.h += subj.h;
        return this;
    }
    mul(subj) {
        if ('number' === typeof subj) {
            this.w *= subj;
            this.h *= subj;
            return this;
        }
        this.w *= subj.w;
        this.h *= subj.h;
        return this;
    }
}
exports.Size2 = Size2;


/***/ }),

/***/ "./src/infrastructure/Vector2.ts":
/*!***************************************!*\
  !*** ./src/infrastructure/Vector2.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector2 = void 0;
class Vector2 {
    constructor(...args) {
        this.x = 0;
        this.y = 0;
        if ('number' === typeof args[0]) {
            this.x = args[0];
            this.y = args[1];
        }
        else {
            this.x = args[0].x;
            this.y = args[0].y;
        }
    }
    add(subj) {
        if ('number' === typeof subj) {
            return new Vector2(this.x + subj, this.y + subj);
        }
        return new Vector2(this.x + subj.x, this.y + subj.y);
    }
    sub(subj) {
        if ('number' === typeof subj) {
            return new Vector2(this.x - subj, this.y - subj);
        }
        return new Vector2(this.x - subj.x, this.y - subj.y);
    }
    mul(subj) {
        if ('number' === typeof subj) {
            return new Vector2(this.x * subj, this.y * subj);
        }
        return new Vector2(this.x * subj.x, this.y * subj.y);
    }
    moveTo(target, step) {
        return Vector2.moveTo(this, target, step);
    }
    distanceTo(target) {
        return Vector2.distance(this, target);
    }
    clone() {
        return new Vector2(this);
    }
    equal(other) {
        return this.x === other.x && this.y === other.y;
    }
    static up() {
        return new Vector2(0, -1);
    }
    static down() {
        return new Vector2(0, 1);
    }
    static left() {
        return new Vector2(-1, 0);
    }
    static right() {
        return new Vector2(1, 0);
    }
    static zero() {
        return new Vector2(0, 0);
    }
    static moveTo(subject, target, step) {
        const direction = Vector2.normalize(target.sub(subject));
        return subject.add(direction.mul(step));
    }
    static distance(a, b) {
        return Vector2.len(b.sub(a));
    }
    static len(a) {
        return Math.sqrt(a.x ** 2 + a.y ** 2);
    }
    static normalize(a) {
        const length = Vector2.len(a);
        return new Vector2(a.x / length, a.y / length);
    }
}
exports.Vector2 = Vector2;


/***/ }),

/***/ "./src/scenes/DefaultScene.ts":
/*!************************************!*\
  !*** ./src/scenes/DefaultScene.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultScene = void 0;
const BoardMap_1 = __webpack_require__(/*! ../entities/BoardMap */ "./src/entities/BoardMap.ts");
const GameController_1 = __webpack_require__(/*! ../entities/GameController */ "./src/entities/GameController.ts");
const GameOverLayer_1 = __webpack_require__(/*! ../entities/GameOverLayer */ "./src/entities/GameOverLayer.ts");
const Snake_1 = __webpack_require__(/*! ../entities/Snake */ "./src/entities/Snake.ts");
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    this.imageLoader.load('apple', 'assets/apple.png'),
                    this.imageLoader.load('wall', 'assets/wall.png'),
                    this.imageLoader.load('snek', 'assets/snek.png'),
                ]);
            }
            catch (e) {
                console.error(e);
                throw ('Cannot load sprite');
            }
            this.add('gameController', new GameController_1.GameController());
            this.add('snake', new Snake_1.Snake());
            this.add('boardMap', new BoardMap_1.BoardMap());
            this.add('gameOverLayer', new GameOverLayer_1.GameOverLayer());
            _super.init.call(this, engine, canvas);
        });
    }
}
exports.DefaultScene = DefaultScene;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const DefaultScene_1 = __webpack_require__(/*! ./scenes/DefaultScene */ "./src/scenes/DefaultScene.ts");
const Engine_1 = __webpack_require__(/*! ./infrastructure/Engine */ "./src/infrastructure/Engine.ts");
const InputManager_1 = __webpack_require__(/*! ./infrastructure/InputManager */ "./src/infrastructure/InputManager.ts");
window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.setAttribute('class', 'main-canvas');
    document.getElementById('root').appendChild(canvas);
    const inputManager = new InputManager_1.InputManager();
    const defaultScene = new DefaultScene_1.DefaultScene();
    const engine = new Engine_1.Engine();
    Promise.resolve(engine.start(canvas, canvas.getContext('2d'), inputManager, defaultScene)).catch(e => (console.error(e)));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0EsMERBQTBEO0FBQzFEO0FBQ0E7QUFDQSwwREFBMEQ7QUFDMUQ7QUFDQTtBQUNBLDBEQUEwRDtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsT0FBTztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7Ozs7OztBQy9LQTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7Ozs7Ozs7Ozs7O0FDN0tQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDckNBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDNUVGO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxvQkFBb0I7QUFDcEIsbUJBQW1CLG1CQUFPLENBQUMsd0RBQXNCO0FBQ2pELHlCQUF5QixtQkFBTyxDQUFDLG9FQUE0QjtBQUM3RCx3QkFBd0IsbUJBQU8sQ0FBQyxrRUFBMkI7QUFDM0QsZ0JBQWdCLG1CQUFPLENBQUMsa0RBQW1CO0FBQzNDLGlCQUFpQixtQkFBTyxDQUFDLGdFQUEwQjtBQUNuRDtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEIsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7OztVQzFDcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCx1QkFBdUIsbUJBQU8sQ0FBQywyREFBdUI7QUFDdEQsaUJBQWlCLG1CQUFPLENBQUMsK0RBQXlCO0FBQ2xELHVCQUF1QixtQkFBTyxDQUFDLDJFQUErQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvQXBwbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL0JvYXJkTWFwLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9HYW1lQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvR2FtZU92ZXJMYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvU25ha2UudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FTY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQ29sbGlkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0VuZ2luZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvSW1hZ2VMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0lucHV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvU2l6ZTIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL1ZlY3RvcjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9EZWZhdWx0U2NlbmUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFwcGxlID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FFbnRpdHlcIik7XG5sZXQgYXBwbGVDb3VudGVyID0gMDtcbmNsYXNzIEFwcGxlIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKGxvY2F0aW9uLCBzcHJpdGUpIHtcbiAgICAgICAgc3VwZXIoYEFwcGxlJHthcHBsZUNvdW50ZXIrK31gKTtcbiAgICAgICAgdGhpcy5maWxsQ29sb3IgPSAncmVkJztcbiAgICAgICAgdGhpcy5zdHJva2VDb2xvciA9ICd5ZWxsb3cnO1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gbG9jYXRpb24uY2xvbmUoKTtcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5nYyA9IHNjZW5lLmdldCgnZ2FtZUNvbnRyb2xsZXInKTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICB0aGlzLmdjLmRyYXdTcHJpdGVPbkJvYXJkKGN0eCwgdGhpcy5sb2NhdGlvbiwgdGhpcy5zcHJpdGUpO1xuICAgIH1cbn1cbmV4cG9ydHMuQXBwbGUgPSBBcHBsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Cb2FyZE1hcCA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jbGFzcyBCb2FyZE1hcCBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5jb2xvciA9ICdncmV5JztcbiAgICAgICAgdGhpcy53YWxsTGlzdCA9IFtdO1xuICAgIH1cbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUpO1xuICAgICAgICB0aGlzLmdjID0gc2NlbmUuZ2V0KCdnYW1lQ29udHJvbGxlcicpO1xuICAgICAgICB0aGlzLnNldHVwV2FsbHMoKTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICB0aGlzLndhbGxMaXN0LmZvckVhY2god2FsbCA9PiB7XG4gICAgICAgICAgICB0aGlzLmdjLmRyYXdTcHJpdGVPbkJvYXJkKGN0eCwgd2FsbCwgdGhpcy5zY2VuZS5pbWFnZUxvYWRlci5nZXQoJ3dhbGwnKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRBbGxXYWxsc0xvY2F0aW9uTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FsbExpc3QubWFwKHcgPT4gdy5jbG9uZSgpKTtcbiAgICB9XG4gICAgc2V0dXBXYWxscygpIHtcbiAgICAgICAgY29uc3QgdyA9IHRoaXMuZ2MuYm9hcmRTaXplLnc7XG4gICAgICAgIGNvbnN0IGggPSB0aGlzLmdjLmJvYXJkU2l6ZS5oO1xuICAgICAgICBmb3IgKGxldCBpID0gaCAvIDQgfCAwOyBpIDwgaCAtIChoIC8gNCB8IDApOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMud2FsbExpc3QucHVzaChuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMywgaSkpO1xuICAgICAgICAgICAgdGhpcy53YWxsTGlzdC5wdXNoKG5ldyBWZWN0b3IyXzEuVmVjdG9yMih3IC0gMSAtIDMsIGkpKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gdyAvIDQgfCAwOyBpIDwgdyAtICh3IC8gNCB8IDApOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMud2FsbExpc3QucHVzaChuZXcgVmVjdG9yMl8xLlZlY3RvcjIoaSwgMykpO1xuICAgICAgICAgICAgdGhpcy53YWxsTGlzdC5wdXNoKG5ldyBWZWN0b3IyXzEuVmVjdG9yMihpLCBoIC0gMSAtIDMpKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuQm9hcmRNYXAgPSBCb2FyZE1hcDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lQ29udHJvbGxlciA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgQXBwbGVfMSA9IHJlcXVpcmUoXCIuL0FwcGxlXCIpO1xuY2xhc3MgR2FtZUNvbnRyb2xsZXIgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSAyMDtcbiAgICAgICAgdGhpcy5zY3JlZW5Db2xvciA9ICdibGFjayc7XG4gICAgICAgIHRoaXMuX2lzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5hcHBsZUxpc3QgPSBbXTtcbiAgICAgICAgdGhpcy5NQVhfQVBQTEVfTlVNID0gNTtcbiAgICAgICAgdGhpcy5BUFBMRV9BUFBFQVJfSU5URVJWQUwgPSA2MCAqIDM7XG4gICAgICAgIHRoaXMuY3VycmVudENvdW50ZG93blRvUGxhY2VBbkFwcGxlID0gdGhpcy5BUFBMRV9BUFBFQVJfSU5URVJWQUwgKiBNYXRoLnJhbmRvbSgpIHwgMDtcbiAgICAgICAgdGhpcy5wYWRkaW5nID0gMjtcbiAgICB9XG4gICAgZ2V0IGJvYXJkU2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvYXJkU2l6ZTtcbiAgICB9XG4gICAgZ2V0IGlzR2FtZU92ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0dhbWVPdmVyO1xuICAgIH1cbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUpO1xuICAgICAgICB0aGlzLl9ib2FyZFNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMigoc2NlbmUuZnJhbWVTaXplLncgLyB0aGlzLmNlbGxTaXplKSB8IDAsIChzY2VuZS5mcmFtZVNpemUuaCAvIHRoaXMuY2VsbFNpemUpIHwgMCk7XG4gICAgICAgIHRoaXMuc25layA9IHRoaXMuc2NlbmUuZ2V0KCdzbmFrZScpO1xuICAgICAgICB0aGlzLmJvYXJkTWFwID0gdGhpcy5zY2VuZS5nZXQoJ2JvYXJkTWFwJyk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHYW1lT3ZlciAmJiBpbnB1dC5zcGFjZSkge1xuICAgICAgICAgICAgdGhpcy5zbmVrLnJlc2V0KCk7XG4gICAgICAgICAgICB0aGlzLl9pc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNHYW1lT3Zlcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdhbGxzIGNvbGxpc2lvblxuICAgICAgICBjb25zdCBjb2xsaWRlQVdhbGwgPSB0aGlzLmJvYXJkTWFwLmdldEFsbFdhbGxzTG9jYXRpb25MaXN0KCkuc29tZSh3ID0+IHcuZXF1YWwodGhpcy5zbmVrLmdldEhlYWRQb3NpdGlvbigpKSk7XG4gICAgICAgIGlmIChjb2xsaWRlQVdhbGwpIHtcbiAgICAgICAgICAgIHRoaXMuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBhcHBsZSBjb2xsaXNpb25zXG4gICAgICAgIHRoaXMuYXBwbGVMaXN0ID0gdGhpcy5hcHBsZUxpc3QucmVkdWNlKChhY2MsIGFwcGxlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zbmVrLmdldEhlYWRQb3NpdGlvbigpLmVxdWFsKGFwcGxlLmxvY2F0aW9uKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc25lay53aWxsR3JvdygpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKGFwcGxlLm5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhY2MucHVzaChhcHBsZSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSk7XG4gICAgICAgIC8vIG5ldyBhcHBsZXNcbiAgICAgICAgdGhpcy5jdXJyZW50Q291bnRkb3duVG9QbGFjZUFuQXBwbGUtLTtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudENvdW50ZG93blRvUGxhY2VBbkFwcGxlIDw9IDApIHtcbiAgICAgICAgICAgIHN3aXRjaCAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgKHRoaXMuYXBwbGVMaXN0Lmxlbmd0aCA8IHRoaXMuTUFYX0FQUExFX05VTSk6IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFrZW5Mb2NhdGlvbnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi50aGlzLmFwcGxlTGlzdC5tYXAoYSA9PiBhLmxvY2F0aW9uLmNsb25lKCkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5ib2FyZE1hcC5nZXRBbGxXYWxsc0xvY2F0aW9uTGlzdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4udGhpcy5zbmVrLmdldFBvc2l0aW9uTGlzdCgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zbmVrLmdldEhlYWRQb3NpdGlvbigpLmFkZChWZWN0b3IyXzEuVmVjdG9yMi51cCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc25lay5nZXRIZWFkUG9zaXRpb24oKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc25lay5nZXRIZWFkUG9zaXRpb24oKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIubGVmdCgpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc25lay5nZXRIZWFkUG9zaXRpb24oKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIucmlnaHQoKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNuZWsuZ2V0SGVhZFBvc2l0aW9uKCkuYWRkKFZlY3RvcjJfMS5WZWN0b3IyLnVwKCkuYWRkKFZlY3RvcjJfMS5WZWN0b3IyLnJpZ2h0KCkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc25lay5nZXRIZWFkUG9zaXRpb24oKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIucmlnaHQoKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNuZWsuZ2V0SGVhZFBvc2l0aW9uKCkuYWRkKFZlY3RvcjJfMS5WZWN0b3IyLmRvd24oKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIubGVmdCgpKSksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNuZWsuZ2V0SGVhZFBvc2l0aW9uKCkuYWRkKFZlY3RvcjJfMS5WZWN0b3IyLmxlZnQoKS5hZGQoVmVjdG9yMl8xLlZlY3RvcjIudXAoKSkpLFxuICAgICAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXBwbGVMb2M7XG4gICAgICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcGxlTG9jID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKCh0aGlzLmJvYXJkU2l6ZS53IC0gMSkgKiBNYXRoLnJhbmRvbSgpIHwgMCwgKHRoaXMuYm9hcmRTaXplLmggLSAxKSAqIE1hdGgucmFuZG9tKCkgfCAwKTtcbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAodGFrZW5Mb2NhdGlvbnMuc29tZSh0ID0+IHQuZXF1YWwoYXBwbGVMb2MpKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5ld0FwcGxlID0gbmV3IEFwcGxlXzEuQXBwbGUoYXBwbGVMb2MsIHRoaXMuc2NlbmUuaW1hZ2VMb2FkZXIuZ2V0KCdhcHBsZScpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQobmV3QXBwbGUpO1xuICAgICAgICAgICAgICAgICAgICBuZXdBcHBsZS5pbml0KHRoaXMuc2NlbmUpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFwcGxlTGlzdC5wdXNoKG5ld0FwcGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRDb3VudGRvd25Ub1BsYWNlQW5BcHBsZSA9IHRoaXMuQVBQTEVfQVBQRUFSX0lOVEVSVkFMICogTWF0aC5yYW5kb20oKSB8IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuc2NyZWVuQ29sb3I7XG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIH1cbiAgICBkcmF3Q2VsbChjdHgsIGxvY2F0aW9uLCBjb2xvciwgc3Ryb2tlQ29sb3IpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICBjdHguZmlsbFJlY3QobG9jYXRpb24ueCAqIHRoaXMuY2VsbFNpemUgKyB0aGlzLnBhZGRpbmcsIGxvY2F0aW9uLnkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5wYWRkaW5nLCB0aGlzLmNlbGxTaXplIC0gdGhpcy5wYWRkaW5nICogMiwgdGhpcy5jZWxsU2l6ZSAtIHRoaXMucGFkZGluZyAqIDIpO1xuICAgICAgICBpZiAoc3Ryb2tlQ29sb3IpIHtcbiAgICAgICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZUNvbG9yO1xuICAgICAgICAgICAgY3R4LnN0cm9rZVJlY3QobG9jYXRpb24ueCAqIHRoaXMuY2VsbFNpemUgKyB0aGlzLnBhZGRpbmcsIGxvY2F0aW9uLnkgKiB0aGlzLmNlbGxTaXplICsgdGhpcy5wYWRkaW5nLCB0aGlzLmNlbGxTaXplIC0gdGhpcy5wYWRkaW5nICogMiwgdGhpcy5jZWxsU2l6ZSAtIHRoaXMucGFkZGluZyAqIDIpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGRyYXdTcHJpdGVPbkJvYXJkKGN0eCwgbG9jYXRpb24sIHNwcml0ZSwgYW5nbGUpIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgYW5nbGUpIHtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUobG9jYXRpb24ueCAqIHRoaXMuY2VsbFNpemUgKyBzcHJpdGUud2lkdGggLyAyLCBsb2NhdGlvbi55ICogdGhpcy5jZWxsU2l6ZSArIHNwcml0ZS5oZWlnaHQgLyAyKTtcbiAgICAgICAgICAgIGN0eC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShzcHJpdGUsIC1zcHJpdGUud2lkdGggLyAyLCAtc3ByaXRlLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdHguZHJhd0ltYWdlKHNwcml0ZSwgbG9jYXRpb24ueCAqIHRoaXMuY2VsbFNpemUsIGxvY2F0aW9uLnkgKiB0aGlzLmNlbGxTaXplKTtcbiAgICB9XG4gICAgZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuX2lzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbn1cbmV4cG9ydHMuR2FtZUNvbnRyb2xsZXIgPSBHYW1lQ29udHJvbGxlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lT3ZlckxheWVyID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FFbnRpdHlcIik7XG5jbGFzcyBHYW1lT3ZlckxheWVyIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLkdPX1RFWFQgPSAnR0FNRSBPVkVSIFNORUshJztcbiAgICAgICAgdGhpcy5QTEFZX0FHQUlOX1RFWFQgPSAnWyBQUkVTUyBTUEFDRSBUTyBSRVNUQVJUIF0nO1xuICAgICAgICB0aGlzLm1heEZvckJsaW5rID0gMjQ7XG4gICAgICAgIHRoaXMuYmxpbmtDb3VudGVyID0gMDtcbiAgICB9XG4gICAgaW5pdChzY2VuZSkge1xuICAgICAgICBzdXBlci5pbml0KHNjZW5lKTtcbiAgICAgICAgdGhpcy5nYyA9IHNjZW5lLmdldCgnZ2FtZUNvbnRyb2xsZXInKTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBpZiAodGhpcy5nYy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgICAgICAgICBjdHguZm9udCA9ICc0MHB4IGJvbGQnO1xuICAgICAgICAgICAgY29uc3QgbXQgPSBjdHgubWVhc3VyZVRleHQodGhpcy5HT19URVhUKTtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLkdPX1RFWFQsIHRoaXMuc2NlbmUuZnJhbWVTaXplLncgLyAyIC0gbXQud2lkdGggLyAyLCB0aGlzLnNjZW5lLmZyYW1lU2l6ZS5oIC8gMik7XG4gICAgICAgICAgICB0aGlzLmJsaW5rQ291bnRlcisrO1xuICAgICAgICAgICAgaWYgKHRoaXMuYmxpbmtDb3VudGVyIDwgdGhpcy5tYXhGb3JCbGluayAvIDIpIHtcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3llbGxvdyc7XG4gICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnMTZweCBib2xkJztcbiAgICAgICAgICAgICAgICBjb25zdCBtdCA9IGN0eC5tZWFzdXJlVGV4dCh0aGlzLlBMQVlfQUdBSU5fVEVYVCk7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMuUExBWV9BR0FJTl9URVhULCB0aGlzLnNjZW5lLmZyYW1lU2l6ZS53IC8gMiAtIG10LndpZHRoIC8gMiwgdGhpcy5zY2VuZS5mcmFtZVNpemUuaCAvIDIgKyA0NSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmJsaW5rQ291bnRlciA+PSB0aGlzLm1heEZvckJsaW5rKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibGlua0NvdW50ZXIgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5HYW1lT3ZlckxheWVyID0gR2FtZU92ZXJMYXllcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TbmFrZSA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jb25zdCBybmRDbHIgPSAoZnJvbSA9IDEwMCwgdG8gPSAyNTUpID0+IChmcm9tICsgTWF0aC5yYW5kb20oKSAqICh0byAtIGZyb20pIHwgMCkudG9TdHJpbmcoMTYpO1xuY29uc3QgcmFuZG9tR3JlZW5Cb2R5ID0gKCkgPT4ge1xuICAgIGNvbnN0IGdyZWVuID0gcm5kQ2xyKDE2MCwgMjAwKTtcbiAgICBjb25zdCBzZWMgPSBybmRDbHIoNTAsIDcwKTtcbiAgICByZXR1cm4gYCMke3NlY30ke2dyZWVufSR7c2VjfWA7XG59O1xuY2xhc3MgU25ha2VTZWdtZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAwKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IHJhbmRvbUdyZWVuQm9keSgpO1xuICAgIH1cbiAgICByZW5kZXIoY3R4LCBnYykge1xuICAgICAgICBnYy5kcmF3Q2VsbChjdHgsIHRoaXMubG9jYXRpb24sIHRoaXMuY29sb3IpO1xuICAgIH1cbiAgICBmb2xsb3cobmV4dCkge1xuICAgICAgICB0aGlzLmxvY2F0aW9uID0gbmV4dC5sb2NhdGlvbi5jbG9uZSgpO1xuICAgIH1cbiAgICBtb3ZlQnkoZGVsdGFMb2MpIHtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IHRoaXMubG9jYXRpb24uYWRkKGRlbHRhTG9jKTtcbiAgICB9XG59XG5TbmFrZVNlZ21lbnQuSEVBRF9DT0xPUiA9ICdsaW1lJztcblNuYWtlU2VnbWVudC5CT0RZX0NPTE9SID0gJ2dyZWVuJztcbmNsYXNzIFNuYWtlSGVhZFNlZ21lbnQgZXh0ZW5kcyBTbmFrZVNlZ21lbnQge1xuICAgIGNvbnN0cnVjdG9yKGxvY2F0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY29sb3IgPSBTbmFrZVNlZ21lbnQuSEVBRF9DT0xPUjtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IGxvY2F0aW9uLmNsb25lKCk7XG4gICAgfVxufVxuY2xhc3MgU25ha2UgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuTU9WRV9JTlRFUlZBTCA9IDg7IC8vIHRvZG8gdXNlIGR0XG4gICAgICAgIHRoaXMuTUlOX01PVkVfSU5URVJWQUwgPSAzO1xuICAgICAgICB0aGlzLk1BWF9MRU5HVEggPSAxMDA7XG4gICAgICAgIHRoaXMuREVGQVVMVF9ERUxUQSA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCAxKTtcbiAgICAgICAgdGhpcy5sYXN0QWNjZXB0ZWREdExvYyA9IHRoaXMuREVGQVVMVF9ERUxUQTtcbiAgICAgICAgdGhpcy50aWNrc1RvTmV4dE1vdmUgPSB0aGlzLk1PVkVfSU5URVJWQUw7XG4gICAgICAgIHRoaXMudG9Hcm93ID0gMDtcbiAgICB9XG4gICAgaW5pdChzY2VuZSkge1xuICAgICAgICBzdXBlci5pbml0KHNjZW5lKTtcbiAgICAgICAgdGhpcy5nYyA9IHNjZW5lLmdldCgnZ2FtZUNvbnRyb2xsZXInKTtcbiAgICAgICAgaWYgKCF0aGlzLmdjKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dhbWVDb250cm9sbGVyIG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5nYy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gc25layBjYW5ub3QgY2hhbmdlIGRpcmVjdGlvbiB0byBhbiBvcHBvc2l0ZSFcbiAgICAgICAgY29uc3QgbGFkbCA9IHRoaXMubGFzdEFjY2VwdGVkRHRMb2M7XG4gICAgICAgIGNvbnN0IGlzTGVuMSA9IHRoaXMuc2VnbWVudExpc3QubGVuZ3RoID09PSAxO1xuICAgICAgICBpZiAoaW5wdXQudXBcbiAgICAgICAgICAgICYmIChpc0xlbjEgfHwgIWxhZGwuZXF1YWwoVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpKSkpIHtcbiAgICAgICAgICAgIHRoaXMuZGVsdGFMb2MgPSBWZWN0b3IyXzEuVmVjdG9yMi51cCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0LmRvd25cbiAgICAgICAgICAgICYmIChpc0xlbjEgfHwgIWxhZGwuZXF1YWwoVmVjdG9yMl8xLlZlY3RvcjIudXAoKSkpKSB7XG4gICAgICAgICAgICB0aGlzLmRlbHRhTG9jID0gVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0LmxlZnRcbiAgICAgICAgICAgICYmIChpc0xlbjEgfHwgIWxhZGwuZXF1YWwoVmVjdG9yMl8xLlZlY3RvcjIucmlnaHQoKSkpKSB7XG4gICAgICAgICAgICB0aGlzLmRlbHRhTG9jID0gVmVjdG9yMl8xLlZlY3RvcjIubGVmdCgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlucHV0LnJpZ2h0XG4gICAgICAgICAgICAmJiAoaXNMZW4xIHx8ICFsYWRsLmVxdWFsKFZlY3RvcjJfMS5WZWN0b3IyLmxlZnQoKSkpKSB7XG4gICAgICAgICAgICB0aGlzLmRlbHRhTG9jID0gVmVjdG9yMl8xLlZlY3RvcjIucmlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRpY2tzVG9OZXh0TW92ZSAtPSAxO1xuICAgICAgICBpZiAodGhpcy50aWNrc1RvTmV4dE1vdmUgPD0gMCkge1xuICAgICAgICAgICAgLy8gZ3Jvd1xuICAgICAgICAgICAgaWYgKGlucHV0LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB3aGlsZSAodGhpcy50b0dyb3cgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm93KCk7XG4gICAgICAgICAgICAgICAgdGhpcy50b0dyb3ctLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIG9uZSBzdGVwIGRlbHRhIGxvY1xuICAgICAgICAgICAgY29uc3QgZGVsdGFMb2MgPSB0aGlzLmRlbHRhTG9jLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBsYXN0IGFjY2VwdGVkIGR0IGxvY1xuICAgICAgICAgICAgdGhpcy5sYXN0QWNjZXB0ZWREdExvYyA9IGRlbHRhTG9jLmNsb25lKCk7XG4gICAgICAgICAgICAvLyBkZXRlY3Qgb3V0IG9mIHRoZSBib2FyZFxuICAgICAgICAgICAgLy8gdHJhbnNmZXIgdG8gYW5vdGhlciBzaWRlP1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDZWxsID0gdGhpcy5oZWFkLmxvY2F0aW9uLmFkZChkZWx0YUxvYyk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRDZWxsLnggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhTG9jLnggPSB0aGlzLmdjLmJvYXJkU2l6ZS53IC0gMTsgLy8gbW92ZSB0byB0aGUgdmVyeSByaWdodCBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG5leHRDZWxsLnggPj0gdGhpcy5nYy5ib2FyZFNpemUudykge1xuICAgICAgICAgICAgICAgICAgICBkZWx0YUxvYy54ID0gMSAtIHRoaXMuZ2MuYm9hcmRTaXplLnc7IC8vIG1vdmUgdG8gdGhlIHZlcnkgbGVmdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dENlbGwueSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsdGFMb2MueSA9IHRoaXMuZ2MuYm9hcmRTaXplLmggLSAxOyAvLyBtb3ZlIHRvIHRoZSB2ZXJ5IGJvdHRvbVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmV4dENlbGwueSA+PSB0aGlzLmdjLmJvYXJkU2l6ZS5oKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbHRhTG9jLnkgPSAxIC0gdGhpcy5nYy5ib2FyZFNpemUuaDsgLy8gbW92ZSB0byB0aGUgdmVyeSB0b3BcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBkZXRlY3QgY29sbGlzaW9uIHdpdGggdGhlIHRhaWxcbiAgICAgICAgICAgIC8vIGdhbWUgb3ZlclxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRDZWxsID0gdGhpcy5oZWFkLmxvY2F0aW9uLmFkZChkZWx0YUxvYyk7XG4gICAgICAgICAgICAgICAgY29uc3QgaXNDb2xsaWRlZFRoZVRhaWwgPSB0aGlzLnNlZ21lbnRMaXN0XG4gICAgICAgICAgICAgICAgICAgIC5zbGljZSgwLCAtMSlcbiAgICAgICAgICAgICAgICAgICAgLnNvbWUoc2VnID0+IHNlZy5sb2NhdGlvbi5lcXVhbChuZXh0Q2VsbCkpO1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbGxpZGVkVGhlVGFpbCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmdjLmdhbWVPdmVyKCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAtIGRldGVjdCBjb2xsaXNpb24gd2l0aCBhbiBvYnN0YWNsZVxuICAgICAgICAgICAgLy8gLSBkZXRlY3QgY29sbGlzaW9uIHdpdGggYW4gYXBwbGVcbiAgICAgICAgICAgIC8vICBcXF8gYXJlIGNvbmR1Y3RlZCBieSBHYW1lQ29udHJvbGxlclxuICAgICAgICAgICAgdGhpcy5tb3ZlQnkoZGVsdGFMb2MpO1xuICAgICAgICAgICAgdGhpcy50aWNrc1RvTmV4dE1vdmUgPSBNYXRoLm1heCh0aGlzLk1PVkVfSU5URVJWQUwgLyAodGhpcy5zZWdtZW50TGlzdC5sZW5ndGggLyAyKSB8IDAsIHRoaXMuTUlOX01PVkVfSU5URVJWQUwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgdGhpcy5zZWdtZW50TGlzdC5zbGljZSgxKS5mb3JFYWNoKHNlZyA9PiB7XG4gICAgICAgICAgICBzZWcucmVuZGVyKGN0eCwgdGhpcy5nYyk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBkcmF3IGhlYWRcbiAgICAgICAgbGV0IGFuZ2xlID0gMDtcbiAgICAgICAgaWYgKHRoaXMuZGVsdGFMb2MuZXF1YWwoVmVjdG9yMl8xLlZlY3RvcjIudXAoKSkpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRlbHRhTG9jLmVxdWFsKFZlY3RvcjJfMS5WZWN0b3IyLmRvd24oKSkpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gTWF0aC5QSTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRlbHRhTG9jLmVxdWFsKFZlY3RvcjJfMS5WZWN0b3IyLmxlZnQoKSkpIHtcbiAgICAgICAgICAgIGFuZ2xlID0gTWF0aC5QSSAqIDEuNTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLmRlbHRhTG9jLmVxdWFsKFZlY3RvcjJfMS5WZWN0b3IyLnJpZ2h0KCkpKSB7XG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguUEkgLyAyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2MuZHJhd1Nwcml0ZU9uQm9hcmQoY3R4LCB0aGlzLmhlYWQubG9jYXRpb24sIHRoaXMuc2NlbmUuaW1hZ2VMb2FkZXIuZ2V0KCdzbmVrJyksIGFuZ2xlKTtcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuc3RhcnRMb2NhdGlvbiA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigodGhpcy5nYy5ib2FyZFNpemUudyAvIDIgfCAwKSAtIDEsICh0aGlzLmdjLmJvYXJkU2l6ZS5oIC8gMiB8IDApIC0gMSk7XG4gICAgICAgIHRoaXMuc2VnbWVudExpc3QgPSBbbmV3IFNuYWtlSGVhZFNlZ21lbnQodGhpcy5zdGFydExvY2F0aW9uKV07XG4gICAgICAgIHRoaXMuaGVhZCA9IHRoaXMuc2VnbWVudExpc3RbMF07XG4gICAgICAgIHRoaXMuZGVsdGFMb2MgPSB0aGlzLkRFRkFVTFRfREVMVEE7XG4gICAgfVxuICAgIGdldFBvc2l0aW9uTGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VnbWVudExpc3QubWFwKHNlZyA9PiBzZWcubG9jYXRpb24uY2xvbmUoKSk7XG4gICAgfVxuICAgIGdldEhlYWRQb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZC5sb2NhdGlvbi5jbG9uZSgpO1xuICAgIH1cbiAgICB3aWxsR3JvdygpIHtcbiAgICAgICAgdGhpcy50b0dyb3crKztcbiAgICB9XG4gICAgZ3JvdygpIHtcbiAgICAgICAgaWYgKHRoaXMuc2VnbWVudExpc3QubGVuZ3RoIDwgdGhpcy5NQVhfTEVOR1RIKSB7XG4gICAgICAgICAgICB0aGlzLnNlZ21lbnRMaXN0LnB1c2gobmV3IFNuYWtlU2VnbWVudCgpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtb3ZlQnkoZGVsdGFMb2MpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuc2VnbWVudExpc3QubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xuICAgICAgICAgICAgdGhpcy5zZWdtZW50TGlzdFtpXVxuICAgICAgICAgICAgICAgIC5mb2xsb3codGhpcy5zZWdtZW50TGlzdFtpIC0gMV0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGVhZC5tb3ZlQnkoZGVsdGFMb2MpO1xuICAgIH1cbn1cbmV4cG9ydHMuU25ha2UgPSBTbmFrZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BRW50aXR5ID0gdm9pZCAwO1xuY2xhc3MgQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IobmFtZSA9ICd1bm5hbWVkJyArIGNyeXB0by5yYW5kb21VVUlEKCkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy50YWdMaXN0ID0gW107XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5uYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi9Db2xsaWRlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi9TaXplMlwiKTtcbmNvbnN0IEltYWdlTG9hZGVyXzEgPSByZXF1aXJlKFwiLi9JbWFnZUxvYWRlclwiKTtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgICAgICB0aGlzLl90YWdEaWN0ID0ge307IC8vIHRhZyAtPiBuYW1lTGlzdFxuICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwID0ge307XG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIgPSBuZXcgSW1hZ2VMb2FkZXJfMS5JbWFnZUxvYWRlcigpOyAvLyB0b2RvIGFzc2V0IG9yIHJlc291cmNlIGxvYWRlclxuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgZ2V0IGNvbGxpc2lvbkJvZHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9jb2xsaXNpb25Cb2R5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShQcm9taXNlLmFsbCh0aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkuaW5pdCh0aGlzKSkpKS50aGVuKCk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgLy8gQ29sbGlzaW9uc1xuICAgICAgICBjb25zdCB7IGNvdXBsZUxpc3QsIHRhZ01hcCB9ID0gbmV3IENvbGxpZGVyXzEuQ29sbGlkZXIodGhpcy5jb2xsaXNpb25Cb2R5TGlzdClcbiAgICAgICAgICAgIC5wcm9jZXNzKCk7XG4gICAgICAgIGNvdXBsZUxpc3QuZm9yRWFjaCgoW2EsIGJdKSA9PiB7XG4gICAgICAgICAgICBhLmNhbGxDb2xsaXNpb24oYik7XG4gICAgICAgICAgICBiLmNhbGxDb2xsaXNpb24oYSk7XG4gICAgICAgIH0pO1xuICAgICAgICBbLi4udGFnTWFwLmtleXMoKV0uZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9uZVRhZ0JyYW5jaCA9IHRhZ01hcC5nZXQoYik7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhvbmVUYWdCcmFuY2gpLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICBiLmNhbGxUYWdDb2xsaXNpb24odGFnLCBvbmVUYWdCcmFuY2hbdGFnXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFVwZGF0ZVxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS51cGRhdGUoZHQsIGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIC8vIERlZmF1bHQgY2xlYXIgc2NlbmUgYmVmb3JlIGFsbCB0aGUgZW50aXRpZXMgcmVuZGVyZWRcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS5yZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoLi4uYXJncykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGxldCBuYW1lO1xuICAgICAgICBsZXQgZW50aXR5O1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAxICYmICdzdHJpbmcnID09PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgICAgICAgbmFtZSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBlbnRpdHkgPSBhcmdzWzFdO1xuICAgICAgICAgICAgZW50aXR5Lm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW50aXR5ID0gYXJnc1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBlbnRpdHkubmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbnRpdHlNYXBbbmFtZV0gPSBlbnRpdHk7XG4gICAgICAgIC8vIFRhZ3NcbiAgICAgICAgZW50aXR5LnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIF9iO1xuICAgICAgICAgICAgKF9hID0gKF9iID0gdGhpcy5fdGFnRGljdClbdGFnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW3RhZ10gPSBbXSk7XG4gICAgICAgICAgICB0aGlzLl90YWdEaWN0W3RhZ10ucHVzaChuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENvbGxpc2lvbnNcbiAgICAgICAgaWYgKChfYSA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5jb21wb25lbnRMaXN0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5jbHVkZXMoJ2JveENvbGxpZGVyJykpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbkJvZHlNYXBbbmFtZV0gPSBlbnRpdHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbnRpdHlNYXBbbmFtZV0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXS50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3RhZ0RpY3RbdGFnXSA9IHRoaXMuX3RhZ0RpY3RbdGFnXS5maWx0ZXIoZW50aXR5TmFtZSA9PiBlbnRpdHlOYW1lICE9PSBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbnRpdHlNYXBbbmFtZV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwW25hbWVdO1xuICAgIH1cbiAgICBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXR5TWFwW25hbWVdO1xuICAgIH1cbiAgICBmaW5kQnlUYWcodGFnKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fdGFnRGljdFt0YWddIHx8IFtdKS5tYXAobmFtZSA9PiB0aGlzLmdldChuYW1lKSk7XG4gICAgfVxufVxuZXhwb3J0cy5BU2NlbmUgPSBBU2NlbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29sbGlkZXIgPSB2b2lkIDA7XG5jbGFzcyBDb2xsaWRlciB7XG4gICAgY29uc3RydWN0b3IoX2JvZHlMaXN0KSB7XG4gICAgICAgIHRoaXMuX2JvZHlMaXN0ID0gX2JvZHlMaXN0O1xuICAgIH1cbiAgICBwcm9jZXNzKCkge1xuICAgICAgICBjb25zdCBvcGVuRmlyc3RPcmRlciA9IFsnb3BlbicsICdjbG9zZSddOyAvLyBpZiB0d28gZmlndXJlcyBzdGF5IG9uIG9uZSBsaW5lIHRoZXkgbXVzdCBjcm9zc1xuICAgICAgICBjb25zdCB4UmVmTGlzdCA9IHRoaXMuX2JvZHlMaXN0LnJlZHVjZSgoYWNjLCBiKSA9PiB7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLngsIHBvczogJ29wZW4nLCByZWY6IGIgfSk7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnggKyBiLnNpemUudywgcG9zOiAnY2xvc2UnLCByZWY6IGIgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEudiAtIGIudiB8fCAob3BlbkZpcnN0T3JkZXIuaW5kZXhPZihhLnBvcykgLSBvcGVuRmlyc3RPcmRlci5pbmRleE9mKGIucG9zKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB4Q2FuZGlkYXRlUGF0aE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgbGV0IGN1cnJPcGVuTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB4UmVmTGlzdC5mb3JFYWNoKGNyID0+IHtcbiAgICAgICAgICAgIGlmIChjci5wb3MgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgICAgIC8vIHBhaXIgd2l0aCBhbGwgb3BlblxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBbLi4uY3Vyck9wZW5NYXAudmFsdWVzKCldLmZvckVhY2gob3BlbkNyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCBib3RoLWRpcmVjdGlvbiBwYXRoc1xuICAgICAgICAgICAgICAgICAgICB4Q2FuZGlkYXRlUGF0aE1hcC5zZXQoY3IucmVmLCAoeENhbmRpZGF0ZVBhdGhNYXAuZ2V0KGNyLnJlZikgfHwgbmV3IFNldCgpKS5hZGQob3BlbkNyLnJlZikpO1xuICAgICAgICAgICAgICAgICAgICB4Q2FuZGlkYXRlUGF0aE1hcC5zZXQob3BlbkNyLnJlZiwgKHhDYW5kaWRhdGVQYXRoTWFwLmdldChvcGVuQ3IucmVmKSB8fCBuZXcgU2V0KCkpLmFkZChjci5yZWYpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgb3BlbiBpdHNlbGZcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5zZXQoY3IucmVmLCBjcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbG9zZVxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLmRlbGV0ZShjci5yZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeVJlZkxpc3QgPSB0aGlzLl9ib2R5TGlzdC5yZWR1Y2UoKGFjYywgYikgPT4ge1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi55LCBwb3M6ICdvcGVuJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi55ICsgYi5zaXplLmgsIHBvczogJ2Nsb3NlJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLnYgLSBiLnYgfHwgKG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYS5wb3MpIC0gb3BlbkZpcnN0T3JkZXIuaW5kZXhPZihiLnBvcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgY3Vyck9wZW5NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGNvdXBsZUxpc3QgPSBbXTtcbiAgICAgICAgY29uc3QgdGFnTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB5UmVmTGlzdC5mb3JFYWNoKGNyID0+IHtcbiAgICAgICAgICAgIGlmIChjci5wb3MgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGV4aXN0aW5nIGNvbGxpc2lvbnMgYnkgeCAob25lIGRpcmVjdGlvbiBpcyBlbm91Z2gpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIFsuLi5jdXJyT3Blbk1hcC52YWx1ZXMoKV0uZm9yRWFjaChvcGVuQ3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4Um9vdCA9IHhDYW5kaWRhdGVQYXRoTWFwLmdldChjci5yZWYpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeFJvb3QgJiYgeFJvb3QuaGFzKG9wZW5Dci5yZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VwbGVMaXN0LnB1c2goW2NyLnJlZiwgb3BlbkNyLnJlZl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFnRGljdCA9ICh0YWdNYXAuZ2V0KGNyLnJlZikgfHwge30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbkNyLnJlZi50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9hID0gdGFnRGljdFt0YWddKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAodGFnRGljdFt0YWddID0gW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ0RpY3RbdGFnXS5wdXNoKG9wZW5Dci5yZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGFnRGljdCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ01hcC5zZXQoY3IucmVmLCB0YWdEaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCBvcGVuIGl0c2VsZlxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLnNldChjci5yZWYsIGNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNsb3NlXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuZGVsZXRlKGNyLnJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyBjb3VwbGVMaXN0LCB0YWdNYXAgfTtcbiAgICB9XG59XG5leHBvcnRzLkNvbGxpZGVyID0gQ29sbGlkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmdpbmUgPSB2b2lkIDA7XG5jbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZSQU1FX1JBVEUgPSA2MDtcbiAgICAgICAgdGhpcy5pc0RlYnVnT24gPSBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IGNhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcbiAgICB9XG4gICAgZ2V0IGN0eCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgZ2V0IGlucHV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIHN0YXJ0KGNhbnZhcywgY3R4LCBpbnB1dCwgc2NlbmUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgICAgIHRoaXMuX2N0eCA9IGN0eDtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0Lm9uS2V5UHJlc3MoJ0tleUcnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYnVnT24gPSAhdGhpcy5pc0RlYnVnT247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnN0YXJ0KCk7XG4gICAgICAgICAgICB5aWVsZCBQcm9taXNlLnJlc29sdmUoc2NlbmUuaW5pdCh0aGlzLCBjYW52YXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hhbmdlU2NlbmUoKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICB9XG4gICAgX2dhbWVMb29wKHRpbWUpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aW1lIC0gdGhpcy5fbGFzdEZyYW1lVGltZTtcbiAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZSA9IHRpbWU7XG4gICAgICAgIGNvbnN0IGZwcyA9IE1hdGguZmxvb3IoMTAwMCAvIGRlbHRhKTtcbiAgICAgICAgY29uc3QgZHQgPSBNYXRoLm1heCgwLCBOdW1iZXIoTWF0aC5yb3VuZChkZWx0YSAvICgxMDAwIC8gdGhpcy5GUkFNRV9SQVRFKSkudG9GaXhlZCgyKSkpO1xuICAgICAgICAvLyBpbnB1dFxuICAgICAgICB0aGlzLl9pbnB1dC51cGRhdGUoZHQpO1xuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnVwZGF0ZShkdCwgdGhpcy5faW5wdXQpO1xuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnJlbmRlcih0aGlzLl9jYW52YXMsIHRoaXMuX2N0eCwgZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICAvLyBkZWJ1Z1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIG5leHQgaXRlcmF0aW9uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lID0+IHRoaXMuX2dhbWVMb29wKHRpbWUpKTtcbiAgICB9XG4gICAgX2RlYnVnKGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWdPbikge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxSZWN0KDAsIDAsIDEyMCwgODUpO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSAnMTVweCBzZXJpZic7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChg4oiCICR7ZHR9YCwgMTAsIDE1LCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYM6UOiAke2RlbHRhfWAsIDEwLCAzMCwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBmcHM6ICR7ZnBzfWAsIDEwLCA0NSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBvYmouY291bnQ6ICR7dGhpcy5fY3VycmVudFNjZW5lLmVudGl0eUxpc3QubGVuZ3RofWAsIDEwLCA2MCwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBpbiBILFY6ICR7dGhpcy5faW5wdXQuaG9yaXpvbnRhbC50b0ZpeGVkKDIpfSwke3RoaXMuaW5wdXQudmVydGljYWwudG9GaXhlZCgyKX1gLCAxMCwgNzUsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkVuZ2luZSA9IEVuZ2luZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkltYWdlTG9hZGVyID0gdm9pZCAwO1xuY2xhc3MgSW1hZ2VMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9tYXAgPSBuZXcgTWFwKCk7XG4gICAgfVxuICAgIGxvYWQobmFtZSwgc3JjKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHIsIGopID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgIGltZy5vbmVycm9yID0gajtcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXAuc2V0KG5hbWUsIGltZyk7XG4gICAgICAgICAgICAgICAgICAgIHIoKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBkZWxldGUobmFtZSkge1xuICAgICAgICB0aGlzLl9tYXAuZGVsZXRlKG5hbWUpO1xuICAgIH1cbiAgICBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbWFwLmdldChuYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkltYWdlTG9hZGVyID0gSW1hZ2VMb2FkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gdm9pZCAwO1xuLy8gVE9ETyBhZGQgbW91c2VcbmNsYXNzIElucHV0TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgIHRoaXMua2V5ID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmNvZGUgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuYWx0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3QgPSB7fTtcbiAgICAgICAgdGhpcy5fa2V5RG93bkxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvcml6b250YWwgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oZGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbCA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICh0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2UuY29kZV0gfHwgW10pLmZvckVhY2goY2IgPT4gY2IoKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2tleVVwTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGl6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5heGlzU2Vuc2l0aXZpdHkgPSAxIC8gMTA7XG4gICAgICAgIHRoaXMuX2F4aXNUYWJsZSA9IHtcbiAgICAgICAgICAgIGhpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmllOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAtMSA/IC0xIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZHo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZShkdCk7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZShkdCk7XG4gICAgfVxuICAgIG9uS2V5UHJlc3MoY29kZSwgY2IpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3QpW2NvZGVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2JbY29kZV0gPSBbXSk7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0ucHVzaChjYik7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlS2V5UHJlc3MoY29kZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXS5maWx0ZXIobGlzdGVuZXIgPT4gbGlzdGVuZXIgIT09IGNiKTtcbiAgICB9XG59XG5leHBvcnRzLklucHV0TWFuYWdlciA9IElucHV0TWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TaXplMiA9IHZvaWQgMDtcbmNsYXNzIFNpemUyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMudyA9IDA7XG4gICAgICAgIHRoaXMuaCA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLmggPSAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMV0gPyBhcmdzWzFdIDogYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF0udztcbiAgICAgICAgICAgIHRoaXMuaCA9IGFyZ3NbMF0uaDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKz0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCArPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICs9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICs9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG11bChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMudyAqPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy5oICo9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLncgKj0gc3Viai53O1xuICAgICAgICB0aGlzLmggKj0gc3Viai5oO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5leHBvcnRzLlNpemUyID0gU2l6ZTI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcbmNsYXNzIFZlY3RvcjIge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy54ID0gMDtcbiAgICAgICAgdGhpcy55ID0gMDtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgICAgICAgdGhpcy54ID0gYXJnc1swXTtcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3NbMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSBhcmdzWzBdLng7XG4gICAgICAgICAgICB0aGlzLnkgPSBhcmdzWzBdLnk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCArIHN1YmosIHRoaXMueSArIHN1YmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyBzdWJqLngsIHRoaXMueSArIHN1YmoueSk7XG4gICAgfVxuICAgIHN1YihzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggLSBzdWJqLCB0aGlzLnkgLSBzdWJqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gc3Viai54LCB0aGlzLnkgLSBzdWJqLnkpO1xuICAgIH1cbiAgICBtdWwoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICogc3ViaiwgdGhpcy55ICogc3Viaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIHN1YmoueCwgdGhpcy55ICogc3Viai55KTtcbiAgICB9XG4gICAgbW92ZVRvKHRhcmdldCwgc3RlcCkge1xuICAgICAgICByZXR1cm4gVmVjdG9yMi5tb3ZlVG8odGhpcywgdGFyZ2V0LCBzdGVwKTtcbiAgICB9XG4gICAgZGlzdGFuY2VUbyh0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGFyZ2V0KTtcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzKTtcbiAgICB9XG4gICAgZXF1YWwob3RoZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCA9PT0gb3RoZXIueCAmJiB0aGlzLnkgPT09IG90aGVyLnk7XG4gICAgfVxuICAgIHN0YXRpYyB1cCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIC0xKTtcbiAgICB9XG4gICAgc3RhdGljIGRvd24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcbiAgICB9XG4gICAgc3RhdGljIGxlZnQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigtMSwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyByaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgemVybygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgbW92ZVRvKHN1YmplY3QsIHRhcmdldCwgc3RlcCkge1xuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBWZWN0b3IyLm5vcm1hbGl6ZSh0YXJnZXQuc3ViKHN1YmplY3QpKTtcbiAgICAgICAgcmV0dXJuIHN1YmplY3QuYWRkKGRpcmVjdGlvbi5tdWwoc3RlcCkpO1xuICAgIH1cbiAgICBzdGF0aWMgZGlzdGFuY2UoYSwgYikge1xuICAgICAgICByZXR1cm4gVmVjdG9yMi5sZW4oYi5zdWIoYSkpO1xuICAgIH1cbiAgICBzdGF0aWMgbGVuKGEpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChhLnggKiogMiArIGEueSAqKiAyKTtcbiAgICB9XG4gICAgc3RhdGljIG5vcm1hbGl6ZShhKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IFZlY3RvcjIubGVuKGEpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoYS54IC8gbGVuZ3RoLCBhLnkgLyBsZW5ndGgpO1xuICAgIH1cbn1cbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5EZWZhdWx0U2NlbmUgPSB2b2lkIDA7XG5jb25zdCBCb2FyZE1hcF8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL0JvYXJkTWFwXCIpO1xuY29uc3QgR2FtZUNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9HYW1lQ29udHJvbGxlclwiKTtcbmNvbnN0IEdhbWVPdmVyTGF5ZXJfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9HYW1lT3ZlckxheWVyXCIpO1xuY29uc3QgU25ha2VfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9TbmFrZVwiKTtcbmNvbnN0IEFTY2VuZV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FTY2VuZVwiKTtcbmNsYXNzIERlZmF1bHRTY2VuZSBleHRlbmRzIEFTY2VuZV8xLkFTY2VuZSB7XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICBjb25zdCBfc3VwZXIgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgICAgIGluaXQ6IHsgZ2V0OiAoKSA9PiBzdXBlci5pbml0IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHlpZWxkIFByb21pc2UuYWxsKFtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZUxvYWRlci5sb2FkKCdhcHBsZScsICdhc3NldHMvYXBwbGUucG5nJyksXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIubG9hZCgnd2FsbCcsICdhc3NldHMvd2FsbC5wbmcnKSxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWFnZUxvYWRlci5sb2FkKCdzbmVrJywgJ2Fzc2V0cy9zbmVrLnBuZycpLFxuICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgIHRocm93ICgnQ2Fubm90IGxvYWQgc3ByaXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFkZCgnZ2FtZUNvbnRyb2xsZXInLCBuZXcgR2FtZUNvbnRyb2xsZXJfMS5HYW1lQ29udHJvbGxlcigpKTtcbiAgICAgICAgICAgIHRoaXMuYWRkKCdzbmFrZScsIG5ldyBTbmFrZV8xLlNuYWtlKCkpO1xuICAgICAgICAgICAgdGhpcy5hZGQoJ2JvYXJkTWFwJywgbmV3IEJvYXJkTWFwXzEuQm9hcmRNYXAoKSk7XG4gICAgICAgICAgICB0aGlzLmFkZCgnZ2FtZU92ZXJMYXllcicsIG5ldyBHYW1lT3ZlckxheWVyXzEuR2FtZU92ZXJMYXllcigpKTtcbiAgICAgICAgICAgIF9zdXBlci5pbml0LmNhbGwodGhpcywgZW5naW5lLCBjYW52YXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IERlZmF1bHRTY2VuZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IERlZmF1bHRTY2VuZV8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0RlZmF1bHRTY2VuZVwiKTtcbmNvbnN0IEVuZ2luZV8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvRW5naW5lXCIpO1xuY29uc3QgSW5wdXRNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9pbmZyYXN0cnVjdHVyZS9JbnB1dE1hbmFnZXJcIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgZGVmYXVsdFNjZW5lID0gbmV3IERlZmF1bHRTY2VuZV8xLkRlZmF1bHRTY2VuZSgpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBQcm9taXNlLnJlc29sdmUoZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgZGVmYXVsdFNjZW5lKSkuY2F0Y2goZSA9PiAoY29uc29sZS5lcnJvcihlKSkpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=