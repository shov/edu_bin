/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities/Enemy.ts":
/*!*******************************!*\
  !*** ./src/entities/Enemy.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Enemy_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Enemy = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
const transform_1 = __webpack_require__(/*! ../mixins/transform */ "./src/mixins/transform.ts");
const boxCollieder_1 = __webpack_require__(/*! ../mixins/boxCollieder */ "./src/mixins/boxCollieder.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const EnemyProjectile_1 = __webpack_require__(/*! ./EnemyProjectile */ "./src/entities/EnemyProjectile.ts");
let Enemy = Enemy_1 = class Enemy extends AEntity_1.AEntity {
    constructor(position) {
        super();
        this.tagList = ['enemy'];
        this.isFireSet = false;
        this.fireFreq = 3000; // ms
        this.score = 10;
        this.canFire = () => {
            this.isFireSet = false;
        };
        this.position = position;
        this.size = new Size2_1.Size2(16, 15);
        this.anchor = new Vector2_1.Vector2(0, 0);
    }
    update(dt, input) {
        if (this.vertices()[3].y >= this.scene.frameSize.h) {
            const gameController = this.scene.get('gameController');
            gameController.gameOver();
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'black';
        ctx.fillRect(...this.body());
    }
    firstRowFire() {
        if (!this.isFireSet && Math.random() <= Enemy_1.fireDesire) {
            this.isFireSet = true;
            this.fire();
            setTimeout(this.canFire, this.fireFreq);
            return true;
        }
        return false;
    }
    fire() {
        const projectile = new EnemyProjectile_1.EnemyProjectile(new Vector2_1.Vector2(this.position.x + this.size.w / 2, this.scruff.y + 6));
        this.scene.add(projectile);
        projectile.init(this.scene);
    }
};
Enemy.fireDesire = 0.2; // %
Enemy = Enemy_1 = __decorate([
    (0, Mixer_1.mixin)(boxCollieder_1.boxCollider),
    (0, Mixer_1.mixin)(transform_1.transform),
    __metadata("design:paramtypes", [Object])
], Enemy);
exports.Enemy = Enemy;


/***/ }),

/***/ "./src/entities/EnemyProjectile.ts":
/*!*****************************************!*\
  !*** ./src/entities/EnemyProjectile.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnemyProjectile = void 0;
const Projectile_1 = __webpack_require__(/*! ./Projectile */ "./src/entities/Projectile.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
class EnemyProjectile extends Projectile_1.Projectile {
    constructor() {
        super(...arguments);
        this.tagList = ['enemyProjectile'];
        this.SPEED = Vector2_1.Vector2.down().mul(2);
    }
    create(position) {
        this.position = position;
        this.size = new Size2_1.Size2(6, 6);
        this.anchor = new Vector2_1.Vector2(3, 3);
        this.onCollisionWith('player', (targetList) => {
            targetList[0].destroy();
            const gameController = this.scene.get('gameController');
            gameController.gameOver();
            this.destroy();
        });
    }
    update(dt, input) {
        if (this.position.y > this.scene.frameSize.h + 10) {
            this.destroy();
        }
        this.position = this.position.add(this.SPEED.mul(dt));
    }
}
exports.EnemyProjectile = EnemyProjectile;


/***/ }),

/***/ "./src/entities/GameController.ts":
/*!****************************************!*\
  !*** ./src/entities/GameController.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameController = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Enemy_1 = __webpack_require__(/*! ./Enemy */ "./src/entities/Enemy.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
class GameController extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.score = 0;
        this.isGameOver = false;
    }
    init(scene) {
        super.init(scene);
        const eSize = new Enemy_1.Enemy(Vector2_1.Vector2.zero()).size;
        const width = this.scene.frameSize.w;
        const enemyInRow = 20;
        const rest = width - eSize.w * enemyInRow;
        const gapW = rest / (enemyInRow + 1);
        const startY = 0 - eSize.h;
        const step = 10;
        const time = 1000;
        const spawnEverySteps = Math.ceil((gapW + eSize.h) / step);
        let enemyArray = [];
        let stepsBehind = 0;
        let interval = setInterval(() => {
            if (this.isGameOver) {
                clearInterval(interval);
            }
            // Roll down
            const reEnemyArray = [];
            let row;
            let edgeRow = true;
            while (row = enemyArray.pop()) {
                const reRow = [];
                let name;
                while (name = row.pop()) {
                    const enemy = this.scene.get(name);
                    if (!enemy)
                        continue;
                    enemy.position = enemy.position.add(Vector2_1.Vector2.down().mul(step));
                    if (edgeRow) {
                        enemy.firstRowFire();
                    }
                    reRow.push(name);
                }
                if (reRow.length > 0) {
                    reEnemyArray.unshift(reRow);
                    edgeRow = false;
                }
            }
            enemyArray = reEnemyArray;
            // Spawn new
            if (stepsBehind % spawnEverySteps === 0) {
                enemyArray.unshift([]);
                const row = enemyArray[0];
                const randCount = Math.ceil(20 - Math.random() * 20);
                const leftGap = (this.scene.frameSize.w - randCount * eSize.w - (randCount - 1) * gapW) / 2;
                for (let i = 0; i < randCount; i++) {
                    const enemy = new Enemy_1.Enemy(new Vector2_1.Vector2(leftGap + (i * (eSize.w + gapW)), startY));
                    this.scene.add(enemy);
                    enemy.init(this.scene);
                    row.push(enemy.name);
                }
            }
            stepsBehind++;
        }, time);
    }
    addScore(enemy) {
        this.score += enemy.score;
        if (this.score > 0 && 0 === this.score % 50) {
            // this.scene.get<PlayerBar>('playerBar')?.moveUp(10)
            // this.scene.get<PlayerBar>('playerBar')?.increaseSpeed(1.5)
        }
        if (this.score > 0 && 0 === this.score % 30) {
            //this.scene.get<Ball>('ball')?.speedUp({x: 0.5, y: 0.5})
        }
    }
    gameOver() {
        this.isGameOver = true;
    }
    update(dt, input) {
        if (this.isGameOver) {
            this.scene.entityList.filter(e => e.name !== this.name).forEach(e => this.scene.remove(e.name));
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        if (!this.isGameOver) {
            ctx.fillStyle = 'black';
            ctx.font = '10 serif';
            ctx.fillText(`score: ${this.score}`, 15, this.scene.frameSize.h - 9);
        }
        if (this.isGameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '65px serif';
            ctx.fillText(`GAME OVER`, this.scene.frameSize.w / 2 - 200, this.scene.frameSize.h / 2 + 10);
        }
    }
}
exports.GameController = GameController;


/***/ }),

/***/ "./src/entities/PlayerSpaceShip.ts":
/*!*****************************************!*\
  !*** ./src/entities/PlayerSpaceShip.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerSpaceShip = void 0;
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
const transform_1 = __webpack_require__(/*! ../mixins/transform */ "./src/mixins/transform.ts");
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Projectile_1 = __webpack_require__(/*! ./Projectile */ "./src/entities/Projectile.ts");
const boxCollieder_1 = __webpack_require__(/*! ../mixins/boxCollieder */ "./src/mixins/boxCollieder.ts");
let PlayerSpaceShip = class PlayerSpaceShip extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.tagList = ['player'];
        this.SPEED = 10;
        this.isFireSet = false;
        this.fireFreq = 150; // ms
        this.canFire = () => {
            this.isFireSet = false;
        };
    }
    init(scene) {
        this.size = new Size2_1.Size2(15, 25);
        this.anchor = new Vector2_1.Vector2(this.size.w / 2, this.size.h / 2);
        this.position = new Vector2_1.Vector2({
            x: scene.frameSize.w / 2,
            y: scene.frameSize.h - 15 - this.size.h / 2,
        });
        super.init(scene);
    }
    update(dt, input) {
        this.position = this.position.add(Vector2_1.Vector2.right().mul(dt * input.horizontal * this.SPEED));
        const { x } = this.scruff;
        if (x <= 0) {
            this.position = new Vector2_1.Vector2(this.anchor.x, this.position.y);
        }
        if (x >= this.scene.frameSize.w) {
            this.position = new Vector2_1.Vector2(this.scene.frameSize.w - this.size.w + this.anchor.x, this.position.y);
        }
        if (input.space && !this.isFireSet) {
            this.isFireSet = true;
            this.fire();
            setTimeout(this.canFire, this.fireFreq);
        }
    }
    fire() {
        const projectile = new Projectile_1.Projectile(new Vector2_1.Vector2(this.position.x, this.scruff.y - 6));
        this.scene.add(projectile);
        projectile.init(this.scene);
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'black';
        ctx.fillRect(...this.body());
    }
};
PlayerSpaceShip = __decorate([
    (0, Mixer_1.mixin)(boxCollieder_1.boxCollider),
    (0, Mixer_1.mixin)(transform_1.transform)
], PlayerSpaceShip);
exports.PlayerSpaceShip = PlayerSpaceShip;


/***/ }),

/***/ "./src/entities/Projectile.ts":
/*!************************************!*\
  !*** ./src/entities/Projectile.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Projectile = void 0;
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
const transform_1 = __webpack_require__(/*! ../mixins/transform */ "./src/mixins/transform.ts");
const boxCollieder_1 = __webpack_require__(/*! ../mixins/boxCollieder */ "./src/mixins/boxCollieder.ts");
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
let Projectile = class Projectile extends AEntity_1.AEntity {
    constructor(position) {
        super();
        this.SPEED = Vector2_1.Vector2.up().mul(10);
        this.create(position);
    }
    create(position) {
        this.position = position;
        this.size = new Size2_1.Size2(6, 6);
        this.anchor = new Vector2_1.Vector2(3, 3);
        this.onCollisionWith('enemy', (targetList) => {
            const gameController = this.scene.get('gameController');
            targetList.forEach(enemy => {
                gameController.addScore(enemy);
                enemy.destroy();
            });
            this.destroy();
        });
        this.onCollisionWith('enemyProjectile', (targetList) => {
            targetList.forEach(enemyProjectile => {
                enemyProjectile.destroy();
            });
            this.destroy();
        });
    }
    update(dt, input) {
        if (this.position.y < -10) {
            this.destroy();
        }
        this.position = this.position.add(this.SPEED.mul(dt));
    }
    render(canvas, ctx, dt, delta, fps) {
        const { x, y } = this.position;
        const { w, h } = this.size;
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
};
Projectile = __decorate([
    (0, Mixer_1.mixin)(boxCollieder_1.boxCollider),
    (0, Mixer_1.mixin)(transform_1.transform),
    __metadata("design:paramtypes", [Object])
], Projectile);
exports.Projectile = Projectile;


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
class AScene {
    constructor() {
        this._entityMap = {};
        this._tagDict = {}; // tag -> nameList
        this._collisionBodyMap = {};
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
        this.entityList.forEach(entity => {
            entity.init(this);
        });
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
/***/ ((__unused_webpack_module, exports) => {


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
        this._canvas = canvas;
        this._ctx = ctx;
        this._input = input;
        this._currentScene = scene;
        this._input.onKeyPress('KeyG', () => {
            this.isDebugOn = !this.isDebugOn;
        });
        this._input.start();
        scene.init(this, canvas);
        this._lastFrameTime = Date.now();
        requestAnimationFrame(time => this._gameLoop(time));
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
                    this._axisCurrHorizontalMove = this._axisTable.hde;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.right = true;
                    this._axisCurrHorizontalMove = this._axisTable.hie;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.up = true;
                    this._axisCurrVerticalMove = this._axisTable.vde;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.down = true;
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

/***/ "./src/infrastructure/Mixer.ts":
/*!*************************************!*\
  !*** ./src/infrastructure/Mixer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mixin = exports.MIXIN_REQUIRE_SYMBOL = exports.MIXIN_NAME_SYMBOL = void 0;
exports.MIXIN_NAME_SYMBOL = Symbol.for('$mixinName');
exports.MIXIN_REQUIRE_SYMBOL = Symbol.for('$mixinRequire');
function mixin(mixIn, rules = null) {
    return function decorator(Base) {
        var _a;
        var _b;
        ;
        (mixIn[exports.MIXIN_REQUIRE_SYMBOL] || []).forEach((requiredMixinName) => {
            if (!(Base.prototype.componentList || []).includes(requiredMixinName)) {
                throw new Error(`Mixin ${mixIn[exports.MIXIN_NAME_SYMBOL]} requires ${requiredMixinName}, but it hasn't applied to ${Base.name} yet`);
            }
        });
        Object.getOwnPropertyNames(mixIn).forEach(name => {
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Object.defineProperty(Base.prototype, ((rules || {})[name] || name), Object.getOwnPropertyDescriptor(mixIn, name));
            }
        });
        (_a = (_b = Base.prototype).componentList) !== null && _a !== void 0 ? _a : (_b.componentList = []);
        Base.prototype.componentList.push(mixIn[exports.MIXIN_NAME_SYMBOL]);
        return Base;
    };
}
exports.mixin = mixin;


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
            this.x += subj;
            this.y += subj;
            return this;
        }
        this.x += subj.x;
        this.y += subj.y;
        return this;
    }
    sub(subj) {
        if ('number' === typeof subj) {
            this.x -= subj;
            this.y -= subj;
            return this;
        }
        this.x -= subj.x;
        this.y -= subj.y;
        return this;
    }
    mul(subj) {
        if ('number' === typeof subj) {
            this.x *= subj;
            this.y *= subj;
            return this;
        }
        this.x *= subj.x;
        this.y *= subj.y;
        return this;
    }
    moveTo(target, step) {
        Vector2.moveTo(this, target, step);
        return this;
    }
    distanceTo(target) {
        return Vector2.distance(this, target);
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
        subject.add(direction.mul(step));
        return subject;
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

/***/ "./src/mixins/boxCollieder.ts":
/*!************************************!*\
  !*** ./src/mixins/boxCollieder.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boxCollider = void 0;
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
exports.boxCollider = {
    [Mixer_1.MIXIN_NAME_SYMBOL]: 'boxCollider',
    [Mixer_1.MIXIN_REQUIRE_SYMBOL]: ['transform'],
    vertices() {
        const topLeft = this.scruff;
        const size = this.size;
        return [
            topLeft,
            new Vector2_1.Vector2({ x: topLeft.x + size.w, y: topLeft.y }),
            new Vector2_1.Vector2({ x: topLeft.x + size.w, y: topLeft.y + size.h }),
            new Vector2_1.Vector2({ x: topLeft.x, y: topLeft.y + size.h }),
        ];
    },
    hasCollisionWith(target) {
        // Another boxCollider entity
        const currVertices = this.vertices();
        const targetVertices = target.vertices();
        return currVertices[0].x < targetVertices[1].x
            && currVertices[1].x > targetVertices[0].x
            && currVertices[0].y < targetVertices[2].y
            && currVertices[2].y > targetVertices[0].y;
    },
    onCollisionWith(target, cb) {
        var _a, _b, _c;
        var _d;
        if ('string' === typeof target) {
            (_a = this['boxCollider.tagSubscriptionDict']) !== null && _a !== void 0 ? _a : (this['boxCollider.tagSubscriptionDict'] = {});
            (_b = (_d = this['boxCollider.tagSubscriptionDict'])[target]) !== null && _b !== void 0 ? _b : (_d[target] = []);
            this['boxCollider.tagSubscriptionDict'][target].push(cb);
        }
        else {
            (_c = this['boxCollider.bodySubscriptionMap']) !== null && _c !== void 0 ? _c : (this['boxCollider.bodySubscriptionMap'] = new Map());
            const listenerList = this['boxCollider.bodySubscriptionMap'].get(target) || [];
            listenerList.push(cb);
            this['boxCollider.bodySubscriptionMap'].set(target, listenerList);
        }
    },
    unsubscribeFromCollisionWith(target, cb) {
        var _a, _b;
        if ('string' === typeof target) {
            (_a = this['boxCollider.tagSubscriptionDict']) !== null && _a !== void 0 ? _a : (this['boxCollider.tagSubscriptionDict'] = {});
            if (!cb) {
                delete this['boxCollider.tagSubscriptionDict'][target];
                return;
            }
            if (!this['boxCollider.tagSubscriptionDict'][target]) {
                return;
            }
            ;
            this['boxCollider.tagSubscriptionDict'][target]
                = this['boxCollider.tagSubscriptionDict'][target]
                    .filter(listener => listener !== cb);
        }
        else {
            (_b = this['boxCollider.bodySubscriptionMap']) !== null && _b !== void 0 ? _b : (this['boxCollider.bodySubscriptionMap'] = new Map());
            if (!cb) {
                ;
                this['boxCollider.bodySubscriptionMap'].delete(target);
                return;
            }
            let listenerList = this['boxCollider.bodySubscriptionMap'].get(target);
            if (!listenerList) {
                return;
            }
            listenerList = listenerList.filter(listener => listener !== cb);
            this['boxCollider.bodySubscriptionMap'].set(target, listenerList);
        }
    },
    callCollision(body) {
        var _a;
        (_a = this['boxCollider.bodySubscriptionMap']) !== null && _a !== void 0 ? _a : (this['boxCollider.bodySubscriptionMap'] = new Map());
        (this['boxCollider.bodySubscriptionMap'].get(body) || []).forEach(cb => cb(body));
    },
    callTagCollision(tag, bodyList) {
        var _a;
        (_a = this['boxCollider.tagSubscriptionDict']) !== null && _a !== void 0 ? _a : (this['boxCollider.tagSubscriptionDict'] = {});
        if (!this['boxCollider.tagSubscriptionDict'][tag]) {
            return;
        }
        ;
        this['boxCollider.tagSubscriptionDict'][tag].forEach(cb => cb(bodyList));
    },
};


/***/ }),

/***/ "./src/mixins/transform.ts":
/*!*********************************!*\
  !*** ./src/mixins/transform.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.transform = void 0;
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
exports.transform = {
    [Mixer_1.MIXIN_NAME_SYMBOL]: 'transform',
    ['$transform.position.x']: 0,
    ['$transform.position.y']: 0,
    ['$transform.size.w']: 1,
    ['$transform.size.h']: 1,
    ['$transform.anchor.x']: 0,
    ['$transform.anchor.y']: 0,
    get position() {
        return new Vector2_1.Vector2(this['$transform.position.x'], this['$transform.position.y']);
    },
    set position(vector) {
        this['$transform.position.x'] = vector.x;
        this['$transform.position.y'] = vector.y;
    },
    get size() {
        return new Size2_1.Size2(this['$transform.size.w'], this['$transform.size.h']);
    },
    set size(size) {
        this['$transform.size.w'] = size.w;
        this['$transform.size.h'] = size.h;
    },
    get anchor() {
        return new Vector2_1.Vector2(this['$transform.anchor.x'], this['$transform.anchor.y']);
    },
    set anchor(vector) {
        this['$transform.anchor.x'] = vector.x;
        this['$transform.anchor.y'] = vector.y;
    },
    get scruff() {
        return new Vector2_1.Vector2(this['$transform.position.x'] - this['$transform.anchor.x'], this['$transform.position.y'] - this['$transform.anchor.y']);
    },
    /**
     * Return [x, y, w, h] where x,y is the scruff (top left corner of the entity)
     */
    body() {
        return [
            this['$transform.position.x'] - this['$transform.anchor.x'],
            this['$transform.position.y'] - this['$transform.anchor.y'],
            this['$transform.size.w'],
            this['$transform.size.h'],
        ];
    },
    moveTo(target, step) {
        this.position = this.position.moveTo(target.position, step);
    },
    distanceTo(target) {
        return this.position.distanceTo(target.position);
    }
};


/***/ }),

/***/ "./src/scenes/DefaultScene.ts":
/*!************************************!*\
  !*** ./src/scenes/DefaultScene.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultScene = void 0;
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
const GameController_1 = __webpack_require__(/*! ../entities/GameController */ "./src/entities/GameController.ts");
const PlayerSpaceShip_1 = __webpack_require__(/*! ../entities/PlayerSpaceShip */ "./src/entities/PlayerSpaceShip.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        this.add('gameController', new GameController_1.GameController());
        this.add('player', new PlayerSpaceShip_1.PlayerSpaceShip());
        super.init(engine, canvas);
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
    engine.start(canvas, canvas.getContext('2d'), inputManager, defaultScene);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Ly8uL3NyYy9lbnRpdGllcy9FbmVteVByb2plY3RpbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL0dhbWVDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9QbGF5ZXJTcGFjZVNoaXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL1Byb2plY3RpbGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FTY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQ29sbGlkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0VuZ2luZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvSW5wdXRNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9NaXhlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvU2l6ZTIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL1ZlY3RvcjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy9ib3hDb2xsaWVkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy90cmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9EZWZhdWx0U2NlbmUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XG59O1xudmFyIEVuZW15XzE7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVuZW15ID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FFbnRpdHlcIik7XG5jb25zdCBNaXhlcl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL01peGVyXCIpO1xuY29uc3QgdHJhbnNmb3JtXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL3RyYW5zZm9ybVwiKTtcbmNvbnN0IGJveENvbGxpZWRlcl8xID0gcmVxdWlyZShcIi4uL21peGlucy9ib3hDb2xsaWVkZXJcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBFbmVteVByb2plY3RpbGVfMSA9IHJlcXVpcmUoXCIuL0VuZW15UHJvamVjdGlsZVwiKTtcbmxldCBFbmVteSA9IEVuZW15XzEgPSBjbGFzcyBFbmVteSBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnRhZ0xpc3QgPSBbJ2VuZW15J107XG4gICAgICAgIHRoaXMuaXNGaXJlU2V0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZmlyZUZyZXEgPSAzMDAwOyAvLyBtc1xuICAgICAgICB0aGlzLnNjb3JlID0gMTA7XG4gICAgICAgIHRoaXMuY2FuRmlyZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNGaXJlU2V0ID0gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUyXzEuU2l6ZTIoMTYsIDE1KTtcbiAgICAgICAgdGhpcy5hbmNob3IgPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMCwgMCk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMudmVydGljZXMoKVszXS55ID49IHRoaXMuc2NlbmUuZnJhbWVTaXplLmgpIHtcbiAgICAgICAgICAgIGNvbnN0IGdhbWVDb250cm9sbGVyID0gdGhpcy5zY2VuZS5nZXQoJ2dhbWVDb250cm9sbGVyJyk7XG4gICAgICAgICAgICBnYW1lQ29udHJvbGxlci5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIGN0eC5maWxsUmVjdCguLi50aGlzLmJvZHkoKSk7XG4gICAgfVxuICAgIGZpcnN0Um93RmlyZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzRmlyZVNldCAmJiBNYXRoLnJhbmRvbSgpIDw9IEVuZW15XzEuZmlyZURlc2lyZSkge1xuICAgICAgICAgICAgdGhpcy5pc0ZpcmVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5maXJlKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuY2FuRmlyZSwgdGhpcy5maXJlRnJlcSk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZpcmUoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RpbGUgPSBuZXcgRW5lbXlQcm9qZWN0aWxlXzEuRW5lbXlQcm9qZWN0aWxlKG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzLnBvc2l0aW9uLnggKyB0aGlzLnNpemUudyAvIDIsIHRoaXMuc2NydWZmLnkgKyA2KSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHByb2plY3RpbGUpO1xuICAgICAgICBwcm9qZWN0aWxlLmluaXQodGhpcy5zY2VuZSk7XG4gICAgfVxufTtcbkVuZW15LmZpcmVEZXNpcmUgPSAwLjI7IC8vICVcbkVuZW15ID0gRW5lbXlfMSA9IF9fZGVjb3JhdGUoW1xuICAgICgwLCBNaXhlcl8xLm1peGluKShib3hDb2xsaWVkZXJfMS5ib3hDb2xsaWRlciksXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKHRyYW5zZm9ybV8xLnRyYW5zZm9ybSksXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKVxuXSwgRW5lbXkpO1xuZXhwb3J0cy5FbmVteSA9IEVuZW15O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVuZW15UHJvamVjdGlsZSA9IHZvaWQgMDtcbmNvbnN0IFByb2plY3RpbGVfMSA9IHJlcXVpcmUoXCIuL1Byb2plY3RpbGVcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jbGFzcyBFbmVteVByb2plY3RpbGUgZXh0ZW5kcyBQcm9qZWN0aWxlXzEuUHJvamVjdGlsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFsnZW5lbXlQcm9qZWN0aWxlJ107XG4gICAgICAgIHRoaXMuU1BFRUQgPSBWZWN0b3IyXzEuVmVjdG9yMi5kb3duKCkubXVsKDIpO1xuICAgIH1cbiAgICBjcmVhdGUocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMig2LCA2KTtcbiAgICAgICAgdGhpcy5hbmNob3IgPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoMywgMyk7XG4gICAgICAgIHRoaXMub25Db2xsaXNpb25XaXRoKCdwbGF5ZXInLCAodGFyZ2V0TGlzdCkgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0TGlzdFswXS5kZXN0cm95KCk7XG4gICAgICAgICAgICBjb25zdCBnYW1lQ29udHJvbGxlciA9IHRoaXMuc2NlbmUuZ2V0KCdnYW1lQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgZ2FtZUNvbnRyb2xsZXIuZ2FtZU92ZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55ID4gdGhpcy5zY2VuZS5mcmFtZVNpemUuaCArIDEwKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5TUEVFRC5tdWwoZHQpKTtcbiAgICB9XG59XG5leHBvcnRzLkVuZW15UHJvamVjdGlsZSA9IEVuZW15UHJvamVjdGlsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5HYW1lQ29udHJvbGxlciA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgRW5lbXlfMSA9IHJlcXVpcmUoXCIuL0VuZW15XCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jbGFzcyBHYW1lQ29udHJvbGxlciBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XG4gICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IGZhbHNlO1xuICAgIH1cbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUpO1xuICAgICAgICBjb25zdCBlU2l6ZSA9IG5ldyBFbmVteV8xLkVuZW15KFZlY3RvcjJfMS5WZWN0b3IyLnplcm8oKSkuc2l6ZTtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLnNjZW5lLmZyYW1lU2l6ZS53O1xuICAgICAgICBjb25zdCBlbmVteUluUm93ID0gMjA7XG4gICAgICAgIGNvbnN0IHJlc3QgPSB3aWR0aCAtIGVTaXplLncgKiBlbmVteUluUm93O1xuICAgICAgICBjb25zdCBnYXBXID0gcmVzdCAvIChlbmVteUluUm93ICsgMSk7XG4gICAgICAgIGNvbnN0IHN0YXJ0WSA9IDAgLSBlU2l6ZS5oO1xuICAgICAgICBjb25zdCBzdGVwID0gMTA7XG4gICAgICAgIGNvbnN0IHRpbWUgPSAxMDAwO1xuICAgICAgICBjb25zdCBzcGF3bkV2ZXJ5U3RlcHMgPSBNYXRoLmNlaWwoKGdhcFcgKyBlU2l6ZS5oKSAvIHN0ZXApO1xuICAgICAgICBsZXQgZW5lbXlBcnJheSA9IFtdO1xuICAgICAgICBsZXQgc3RlcHNCZWhpbmQgPSAwO1xuICAgICAgICBsZXQgaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBSb2xsIGRvd25cbiAgICAgICAgICAgIGNvbnN0IHJlRW5lbXlBcnJheSA9IFtdO1xuICAgICAgICAgICAgbGV0IHJvdztcbiAgICAgICAgICAgIGxldCBlZGdlUm93ID0gdHJ1ZTtcbiAgICAgICAgICAgIHdoaWxlIChyb3cgPSBlbmVteUFycmF5LnBvcCgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVSb3cgPSBbXTtcbiAgICAgICAgICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobmFtZSA9IHJvdy5wb3AoKSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmVteSA9IHRoaXMuc2NlbmUuZ2V0KG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWVuZW15KVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGVuZW15LnBvc2l0aW9uID0gZW5lbXkucG9zaXRpb24uYWRkKFZlY3RvcjJfMS5WZWN0b3IyLmRvd24oKS5tdWwoc3RlcCkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWRnZVJvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5lbXkuZmlyc3RSb3dGaXJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmVSb3cucHVzaChuYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlUm93Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVFbmVteUFycmF5LnVuc2hpZnQocmVSb3cpO1xuICAgICAgICAgICAgICAgICAgICBlZGdlUm93ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW5lbXlBcnJheSA9IHJlRW5lbXlBcnJheTtcbiAgICAgICAgICAgIC8vIFNwYXduIG5ld1xuICAgICAgICAgICAgaWYgKHN0ZXBzQmVoaW5kICUgc3Bhd25FdmVyeVN0ZXBzID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZW5lbXlBcnJheS51bnNoaWZ0KFtdKTtcbiAgICAgICAgICAgICAgICBjb25zdCByb3cgPSBlbmVteUFycmF5WzBdO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJhbmRDb3VudCA9IE1hdGguY2VpbCgyMCAtIE1hdGgucmFuZG9tKCkgKiAyMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgbGVmdEdhcCA9ICh0aGlzLnNjZW5lLmZyYW1lU2l6ZS53IC0gcmFuZENvdW50ICogZVNpemUudyAtIChyYW5kQ291bnQgLSAxKSAqIGdhcFcpIC8gMjtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJhbmRDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVuZW15ID0gbmV3IEVuZW15XzEuRW5lbXkobmV3IFZlY3RvcjJfMS5WZWN0b3IyKGxlZnRHYXAgKyAoaSAqIChlU2l6ZS53ICsgZ2FwVykpLCBzdGFydFkpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoZW5lbXkpO1xuICAgICAgICAgICAgICAgICAgICBlbmVteS5pbml0KHRoaXMuc2NlbmUpO1xuICAgICAgICAgICAgICAgICAgICByb3cucHVzaChlbmVteS5uYW1lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdGVwc0JlaGluZCsrO1xuICAgICAgICB9LCB0aW1lKTtcbiAgICB9XG4gICAgYWRkU2NvcmUoZW5lbXkpIHtcbiAgICAgICAgdGhpcy5zY29yZSArPSBlbmVteS5zY29yZTtcbiAgICAgICAgaWYgKHRoaXMuc2NvcmUgPiAwICYmIDAgPT09IHRoaXMuc2NvcmUgJSA1MCkge1xuICAgICAgICAgICAgLy8gdGhpcy5zY2VuZS5nZXQ8UGxheWVyQmFyPigncGxheWVyQmFyJyk/Lm1vdmVVcCgxMClcbiAgICAgICAgICAgIC8vIHRoaXMuc2NlbmUuZ2V0PFBsYXllckJhcj4oJ3BsYXllckJhcicpPy5pbmNyZWFzZVNwZWVkKDEuNSlcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zY29yZSA+IDAgJiYgMCA9PT0gdGhpcy5zY29yZSAlIDMwKSB7XG4gICAgICAgICAgICAvL3RoaXMuc2NlbmUuZ2V0PEJhbGw+KCdiYWxsJyk/LnNwZWVkVXAoe3g6IDAuNSwgeTogMC41fSlcbiAgICAgICAgfVxuICAgIH1cbiAgICBnYW1lT3ZlcigpIHtcbiAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gdHJ1ZTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmVudGl0eUxpc3QuZmlsdGVyKGUgPT4gZS5uYW1lICE9PSB0aGlzLm5hbWUpLmZvckVhY2goZSA9PiB0aGlzLnNjZW5lLnJlbW92ZShlLm5hbWUpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzEwIHNlcmlmJztcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChgc2NvcmU6ICR7dGhpcy5zY29yZX1gLCAxNSwgdGhpcy5zY2VuZS5mcmFtZVNpemUuaCAtIDkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzR2FtZU92ZXIpIHtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmVkJztcbiAgICAgICAgICAgIGN0eC5mb250ID0gJzY1cHggc2VyaWYnO1xuICAgICAgICAgICAgY3R4LmZpbGxUZXh0KGBHQU1FIE9WRVJgLCB0aGlzLnNjZW5lLmZyYW1lU2l6ZS53IC8gMiAtIDIwMCwgdGhpcy5zY2VuZS5mcmFtZVNpemUuaCAvIDIgKyAxMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkdhbWVDb250cm9sbGVyID0gR2FtZUNvbnRyb2xsZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyU3BhY2VTaGlwID0gdm9pZCAwO1xuY29uc3QgTWl4ZXJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9NaXhlclwiKTtcbmNvbnN0IHRyYW5zZm9ybV8xID0gcmVxdWlyZShcIi4uL21peGlucy90cmFuc2Zvcm1cIik7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IFByb2plY3RpbGVfMSA9IHJlcXVpcmUoXCIuL1Byb2plY3RpbGVcIik7XG5jb25zdCBib3hDb2xsaWVkZXJfMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvYm94Q29sbGllZGVyXCIpO1xubGV0IFBsYXllclNwYWNlU2hpcCA9IGNsYXNzIFBsYXllclNwYWNlU2hpcCBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy50YWdMaXN0ID0gWydwbGF5ZXInXTtcbiAgICAgICAgdGhpcy5TUEVFRCA9IDEwO1xuICAgICAgICB0aGlzLmlzRmlyZVNldCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpcmVGcmVxID0gMTUwOyAvLyBtc1xuICAgICAgICB0aGlzLmNhbkZpcmUgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZVNldCA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDE1LCAyNSk7XG4gICAgICAgIHRoaXMuYW5jaG9yID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHRoaXMuc2l6ZS53IC8gMiwgdGhpcy5zaXplLmggLyAyKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMih7XG4gICAgICAgICAgICB4OiBzY2VuZS5mcmFtZVNpemUudyAvIDIsXG4gICAgICAgICAgICB5OiBzY2VuZS5mcmFtZVNpemUuaCAtIDE1IC0gdGhpcy5zaXplLmggLyAyLFxuICAgICAgICB9KTtcbiAgICAgICAgc3VwZXIuaW5pdChzY2VuZSk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKFZlY3RvcjJfMS5WZWN0b3IyLnJpZ2h0KCkubXVsKGR0ICogaW5wdXQuaG9yaXpvbnRhbCAqIHRoaXMuU1BFRUQpKTtcbiAgICAgICAgY29uc3QgeyB4IH0gPSB0aGlzLnNjcnVmZjtcbiAgICAgICAgaWYgKHggPD0gMCkge1xuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzLmFuY2hvci54LCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh4ID49IHRoaXMuc2NlbmUuZnJhbWVTaXplLncpIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpcy5zY2VuZS5mcmFtZVNpemUudyAtIHRoaXMuc2l6ZS53ICsgdGhpcy5hbmNob3IueCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW5wdXQuc3BhY2UgJiYgIXRoaXMuaXNGaXJlU2V0KSB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZVNldCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmZpcmUoKTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQodGhpcy5jYW5GaXJlLCB0aGlzLmZpcmVGcmVxKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmaXJlKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0aWxlID0gbmV3IFByb2plY3RpbGVfMS5Qcm9qZWN0aWxlKG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzLnBvc2l0aW9uLngsIHRoaXMuc2NydWZmLnkgLSA2KSk7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHByb2plY3RpbGUpO1xuICAgICAgICBwcm9qZWN0aWxlLmluaXQodGhpcy5zY2VuZSk7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIGN0eC5maWxsUmVjdCguLi50aGlzLmJvZHkoKSk7XG4gICAgfVxufTtcblBsYXllclNwYWNlU2hpcCA9IF9fZGVjb3JhdGUoW1xuICAgICgwLCBNaXhlcl8xLm1peGluKShib3hDb2xsaWVkZXJfMS5ib3hDb2xsaWRlciksXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKHRyYW5zZm9ybV8xLnRyYW5zZm9ybSlcbl0sIFBsYXllclNwYWNlU2hpcCk7XG5leHBvcnRzLlBsYXllclNwYWNlU2hpcCA9IFBsYXllclNwYWNlU2hpcDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUHJvamVjdGlsZSA9IHZvaWQgMDtcbmNvbnN0IE1peGVyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvTWl4ZXJcIik7XG5jb25zdCB0cmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvdHJhbnNmb3JtXCIpO1xuY29uc3QgYm94Q29sbGllZGVyXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL2JveENvbGxpZWRlclwiKTtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xubGV0IFByb2plY3RpbGUgPSBjbGFzcyBQcm9qZWN0aWxlIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuU1BFRUQgPSBWZWN0b3IyXzEuVmVjdG9yMi51cCgpLm11bCgxMCk7XG4gICAgICAgIHRoaXMuY3JlYXRlKHBvc2l0aW9uKTtcbiAgICB9XG4gICAgY3JlYXRlKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUyXzEuU2l6ZTIoNiwgNik7XG4gICAgICAgIHRoaXMuYW5jaG9yID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDMsIDMpO1xuICAgICAgICB0aGlzLm9uQ29sbGlzaW9uV2l0aCgnZW5lbXknLCAodGFyZ2V0TGlzdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLmdldCgnZ2FtZUNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgIHRhcmdldExpc3QuZm9yRWFjaChlbmVteSA9PiB7XG4gICAgICAgICAgICAgICAgZ2FtZUNvbnRyb2xsZXIuYWRkU2NvcmUoZW5lbXkpO1xuICAgICAgICAgICAgICAgIGVuZW15LmRlc3Ryb3koKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLm9uQ29sbGlzaW9uV2l0aCgnZW5lbXlQcm9qZWN0aWxlJywgKHRhcmdldExpc3QpID0+IHtcbiAgICAgICAgICAgIHRhcmdldExpc3QuZm9yRWFjaChlbmVteVByb2plY3RpbGUgPT4ge1xuICAgICAgICAgICAgICAgIGVuZW15UHJvamVjdGlsZS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICBpZiAodGhpcy5wb3NpdGlvbi55IDwgLTEwKSB7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy5TUEVFRC5tdWwoZHQpKTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBjb25zdCB7IHgsIHkgfSA9IHRoaXMucG9zaXRpb247XG4gICAgICAgIGNvbnN0IHsgdywgaCB9ID0gdGhpcy5zaXplO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBjdHguZWxsaXBzZSh4LCB5LCB3IC8gMiwgaCAvIDIsIDAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgY3R4LmNsb3NlUGF0aCgpO1xuICAgIH1cbn07XG5Qcm9qZWN0aWxlID0gX19kZWNvcmF0ZShbXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKGJveENvbGxpZWRlcl8xLmJveENvbGxpZGVyKSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikodHJhbnNmb3JtXzEudHJhbnNmb3JtKSxcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnBhcmFtdHlwZXNcIiwgW09iamVjdF0pXG5dLCBQcm9qZWN0aWxlKTtcbmV4cG9ydHMuUHJvamVjdGlsZSA9IFByb2plY3RpbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQUVudGl0eSA9IHZvaWQgMDtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSAndW5uYW1lZCcgKyBjcnlwdG8ucmFuZG9tVVVJRCgpKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFtdO1xuICAgIH1cbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBzY2VuZTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgfVxuICAgIGRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMubmFtZSk7XG4gICAgfVxufVxuZXhwb3J0cy5BRW50aXR5ID0gQUVudGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BU2NlbmUgPSB2b2lkIDA7XG5jb25zdCBDb2xsaWRlcl8xID0gcmVxdWlyZShcIi4vQ29sbGlkZXJcIik7XG5jb25zdCBTaXplMl8xID0gcmVxdWlyZShcIi4vU2l6ZTJcIik7XG5jbGFzcyBBU2NlbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9lbnRpdHlNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5fdGFnRGljdCA9IHt9OyAvLyB0YWcgLT4gbmFtZUxpc3RcbiAgICAgICAgdGhpcy5fY29sbGlzaW9uQm9keU1hcCA9IHt9O1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgZ2V0IGNvbGxpc2lvbkJvZHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9jb2xsaXNpb25Cb2R5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgdGhpcy5lbnRpdHlMaXN0LmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICAgIGVudGl0eS5pbml0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICAvLyBDb2xsaXNpb25zXG4gICAgICAgIGNvbnN0IHsgY291cGxlTGlzdCwgdGFnTWFwIH0gPSBuZXcgQ29sbGlkZXJfMS5Db2xsaWRlcih0aGlzLmNvbGxpc2lvbkJvZHlMaXN0KVxuICAgICAgICAgICAgLnByb2Nlc3MoKTtcbiAgICAgICAgY291cGxlTGlzdC5mb3JFYWNoKChbYSwgYl0pID0+IHtcbiAgICAgICAgICAgIGEuY2FsbENvbGxpc2lvbihiKTtcbiAgICAgICAgICAgIGIuY2FsbENvbGxpc2lvbihhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFsuLi50YWdNYXAua2V5cygpXS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb25lVGFnQnJhbmNoID0gdGFnTWFwLmdldChiKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9uZVRhZ0JyYW5jaCkuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgIGIuY2FsbFRhZ0NvbGxpc2lvbih0YWcsIG9uZVRhZ0JyYW5jaFt0YWddKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZW50aXR5TGlzdCkge1xuICAgICAgICAgICAgZW50aXR5LnVwZGF0ZShkdCwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgLy8gRGVmYXVsdCBjbGVhciBzY2VuZSBiZWZvcmUgYWxsIHRoZSBlbnRpdGllcyByZW5kZXJlZFxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZW50aXR5TGlzdCkge1xuICAgICAgICAgICAgZW50aXR5LnJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZCguLi5hcmdzKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgIGxldCBlbnRpdHk7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDEgJiYgJ3N0cmluZycgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICBuYW1lID0gYXJnc1swXTtcbiAgICAgICAgICAgIGVudGl0eSA9IGFyZ3NbMV07XG4gICAgICAgICAgICBlbnRpdHkubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbnRpdHkgPSBhcmdzWzBdO1xuICAgICAgICAgICAgbmFtZSA9IGVudGl0eS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICAgICAgLy8gVGFnc1xuICAgICAgICBlbnRpdHkudGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgX2I7XG4gICAgICAgICAgICAoX2EgPSAoX2IgPSB0aGlzLl90YWdEaWN0KVt0YWddKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2JbdGFnXSA9IFtdKTtcbiAgICAgICAgICAgIHRoaXMuX3RhZ0RpY3RbdGFnXS5wdXNoKG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ29sbGlzaW9uc1xuICAgICAgICBpZiAoKF9hID0gZW50aXR5ID09PSBudWxsIHx8IGVudGl0eSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50aXR5LmNvbXBvbmVudExpc3QpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcygnYm94Q29sbGlkZXInKSkge1xuICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uQm9keU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW1vdmUobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2VudGl0eU1hcFtuYW1lXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fZW50aXR5TWFwW25hbWVdLnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGFnRGljdFt0YWddID0gdGhpcy5fdGFnRGljdFt0YWddLmZpbHRlcihlbnRpdHlOYW1lID0+IGVudGl0eU5hbWUgIT09IG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbGxpc2lvbkJvZHlNYXBbbmFtZV07XG4gICAgfVxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdHlNYXBbbmFtZV07XG4gICAgfVxuICAgIGZpbmRCeVRhZyh0YWcpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl90YWdEaWN0W3RhZ10gfHwgW10pLm1hcChuYW1lID0+IHRoaXMuZ2V0KG5hbWUpKTtcbiAgICB9XG59XG5leHBvcnRzLkFTY2VuZSA9IEFTY2VuZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Db2xsaWRlciA9IHZvaWQgMDtcbmNsYXNzIENvbGxpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihfYm9keUxpc3QpIHtcbiAgICAgICAgdGhpcy5fYm9keUxpc3QgPSBfYm9keUxpc3Q7XG4gICAgfVxuICAgIHByb2Nlc3MoKSB7XG4gICAgICAgIGNvbnN0IG9wZW5GaXJzdE9yZGVyID0gWydvcGVuJywgJ2Nsb3NlJ107IC8vIGlmIHR3byBmaWd1cmVzIHN0YXkgb24gb25lIGxpbmUgdGhleSBtdXN0IGNyb3NzXG4gICAgICAgIGNvbnN0IHhSZWZMaXN0ID0gdGhpcy5fYm9keUxpc3QucmVkdWNlKChhY2MsIGIpID0+IHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueCwgcG9zOiAnb3BlbicsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueCArIGIuc2l6ZS53LCBwb3M6ICdjbG9zZScsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS52IC0gYi52IHx8IChvcGVuRmlyc3RPcmRlci5pbmRleE9mKGEucG9zKSAtIG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYi5wb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHhDYW5kaWRhdGVQYXRoTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBsZXQgY3Vyck9wZW5NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHhSZWZMaXN0LmZvckVhY2goY3IgPT4ge1xuICAgICAgICAgICAgaWYgKGNyLnBvcyA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFpciB3aXRoIGFsbCBvcGVuXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIFsuLi5jdXJyT3Blbk1hcC52YWx1ZXMoKV0uZm9yRWFjaChvcGVuQ3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIGJvdGgtZGlyZWN0aW9uIHBhdGhzXG4gICAgICAgICAgICAgICAgICAgIHhDYW5kaWRhdGVQYXRoTWFwLnNldChjci5yZWYsICh4Q2FuZGlkYXRlUGF0aE1hcC5nZXQoY3IucmVmKSB8fCBuZXcgU2V0KCkpLmFkZChvcGVuQ3IucmVmKSk7XG4gICAgICAgICAgICAgICAgICAgIHhDYW5kaWRhdGVQYXRoTWFwLnNldChvcGVuQ3IucmVmLCAoeENhbmRpZGF0ZVBhdGhNYXAuZ2V0KG9wZW5Dci5yZWYpIHx8IG5ldyBTZXQoKSkuYWRkKGNyLnJlZikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCBvcGVuIGl0c2VsZlxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLnNldChjci5yZWYsIGNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNsb3NlXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuZGVsZXRlKGNyLnJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB5UmVmTGlzdCA9IHRoaXMuX2JvZHlMaXN0LnJlZHVjZSgoYWNjLCBiKSA9PiB7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnksIHBvczogJ29wZW4nLCByZWY6IGIgfSk7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnkgKyBiLnNpemUuaCwgcG9zOiAnY2xvc2UnLCByZWY6IGIgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEudiAtIGIudiB8fCAob3BlbkZpcnN0T3JkZXIuaW5kZXhPZihhLnBvcykgLSBvcGVuRmlyc3RPcmRlci5pbmRleE9mKGIucG9zKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjdXJyT3Blbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgY291cGxlTGlzdCA9IFtdO1xuICAgICAgICBjb25zdCB0YWdNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHlSZWZMaXN0LmZvckVhY2goY3IgPT4ge1xuICAgICAgICAgICAgaWYgKGNyLnBvcyA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZXhpc3RpbmcgY29sbGlzaW9ucyBieSB4IChvbmUgZGlyZWN0aW9uIGlzIGVub3VnaClcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgWy4uLmN1cnJPcGVuTWFwLnZhbHVlcygpXS5mb3JFYWNoKG9wZW5DciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhSb290ID0geENhbmRpZGF0ZVBhdGhNYXAuZ2V0KGNyLnJlZik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4Um9vdCAmJiB4Um9vdC5oYXMob3BlbkNyLnJlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXBsZUxpc3QucHVzaChbY3IucmVmLCBvcGVuQ3IucmVmXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWdEaWN0ID0gKHRhZ01hcC5nZXQoY3IucmVmKSB8fCB7fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuQ3IucmVmLnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSB0YWdEaWN0W3RhZ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0YWdEaWN0W3RhZ10gPSBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnRGljdFt0YWddLnB1c2gob3BlbkNyLnJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0YWdEaWN0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnTWFwLnNldChjci5yZWYsIHRhZ0RpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9wZW4gaXRzZWxmXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuc2V0KGNyLnJlZiwgY3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5kZWxldGUoY3IucmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7IGNvdXBsZUxpc3QsIHRhZ01hcCB9O1xuICAgIH1cbn1cbmV4cG9ydHMuQ29sbGlkZXIgPSBDb2xsaWRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmdpbmUgPSB2b2lkIDA7XG5jbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZSQU1FX1JBVEUgPSA2MDtcbiAgICAgICAgdGhpcy5pc0RlYnVnT24gPSBmYWxzZTtcbiAgICB9XG4gICAgZ2V0IGNhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcbiAgICB9XG4gICAgZ2V0IGN0eCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgZ2V0IGlucHV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIHN0YXJ0KGNhbnZhcywgY3R4LCBpbnB1dCwgc2NlbmUpIHtcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLl9jdHggPSBjdHg7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICB0aGlzLl9pbnB1dC5vbktleVByZXNzKCdLZXlHJywgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0RlYnVnT24gPSAhdGhpcy5pc0RlYnVnT247XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLl9pbnB1dC5zdGFydCgpO1xuICAgICAgICBzY2VuZS5pbml0KHRoaXMsIGNhbnZhcyk7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIGNoYW5nZVNjZW5lKCkge1xuICAgICAgICAvLyBUT0RPXG4gICAgfVxuICAgIF9nYW1lTG9vcCh0aW1lKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGltZSAtIHRoaXMuX2xhc3RGcmFtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSB0aW1lO1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLmZsb29yKDEwMDAgLyBkZWx0YSk7XG4gICAgICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgTnVtYmVyKE1hdGgucm91bmQoZGVsdGEgLyAoMTAwMCAvIHRoaXMuRlJBTUVfUkFURSkpLnRvRml4ZWQoMikpKTtcbiAgICAgICAgLy8gaW5wdXRcbiAgICAgICAgdGhpcy5faW5wdXQudXBkYXRlKGR0KTtcbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS51cGRhdGUoZHQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5yZW5kZXIodGhpcy5fY2FudmFzLCB0aGlzLl9jdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy8gZGVidWdcbiAgICAgICAgdGhpcy5fZGVidWcoZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICAvLyBuZXh0IGl0ZXJhdGlvblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIF9kZWJ1ZyhkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBpZiAodGhpcy5pc0RlYnVnT24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCAxMjAsIDg1KTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5mb250ID0gJzE1cHggc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYOKIgiAke2R0fWAsIDEwLCAxNSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDOlDogJHtkZWx0YX1gLCAxMCwgMzAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgZnBzOiAke2Zwc31gLCAxMCwgNDUsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgb2JqLmNvdW50OiAke3RoaXMuX2N1cnJlbnRTY2VuZS5lbnRpdHlMaXN0Lmxlbmd0aH1gLCAxMCwgNjAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgaW4gSCxWOiAke3RoaXMuX2lucHV0Lmhvcml6b250YWwudG9GaXhlZCgyKX0sJHt0aGlzLmlucHV0LnZlcnRpY2FsLnRvRml4ZWQoMil9YCwgMTAsIDc1LCAxMDApO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5FbmdpbmUgPSBFbmdpbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gdm9pZCAwO1xuLy8gVE9ETyBhZGQgbW91c2VcbmNsYXNzIElucHV0TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgIHRoaXMua2V5ID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmNvZGUgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuYWx0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3QgPSB7fTtcbiAgICAgICAgdGhpcy5fa2V5RG93bkxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlTJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICh0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2UuY29kZV0gfHwgW10pLmZvckVhY2goY2IgPT4gY2IoKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2tleVVwTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGl6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5heGlzU2Vuc2l0aXZpdHkgPSAxIC8gMTA7XG4gICAgICAgIHRoaXMuX2F4aXNUYWJsZSA9IHtcbiAgICAgICAgICAgIGhpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmllOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAtMSA/IC0xIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZHo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZShkdCk7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZShkdCk7XG4gICAgfVxuICAgIG9uS2V5UHJlc3MoY29kZSwgY2IpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3QpW2NvZGVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2JbY29kZV0gPSBbXSk7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0ucHVzaChjYik7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlS2V5UHJlc3MoY29kZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXS5maWx0ZXIobGlzdGVuZXIgPT4gbGlzdGVuZXIgIT09IGNiKTtcbiAgICB9XG59XG5leHBvcnRzLklucHV0TWFuYWdlciA9IElucHV0TWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5taXhpbiA9IGV4cG9ydHMuTUlYSU5fUkVRVUlSRV9TWU1CT0wgPSBleHBvcnRzLk1JWElOX05BTUVfU1lNQk9MID0gdm9pZCAwO1xuZXhwb3J0cy5NSVhJTl9OQU1FX1NZTUJPTCA9IFN5bWJvbC5mb3IoJyRtaXhpbk5hbWUnKTtcbmV4cG9ydHMuTUlYSU5fUkVRVUlSRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCckbWl4aW5SZXF1aXJlJyk7XG5mdW5jdGlvbiBtaXhpbihtaXhJbiwgcnVsZXMgPSBudWxsKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlY29yYXRvcihCYXNlKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICA7XG4gICAgICAgIChtaXhJbltleHBvcnRzLk1JWElOX1JFUVVJUkVfU1lNQk9MXSB8fCBbXSkuZm9yRWFjaCgocmVxdWlyZWRNaXhpbk5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmICghKEJhc2UucHJvdG90eXBlLmNvbXBvbmVudExpc3QgfHwgW10pLmluY2x1ZGVzKHJlcXVpcmVkTWl4aW5OYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTWl4aW4gJHttaXhJbltleHBvcnRzLk1JWElOX05BTUVfU1lNQk9MXX0gcmVxdWlyZXMgJHtyZXF1aXJlZE1peGluTmFtZX0sIGJ1dCBpdCBoYXNuJ3QgYXBwbGllZCB0byAke0Jhc2UubmFtZX0geWV0YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtaXhJbikuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGlmIChydWxlcyB8fCB0eXBlb2YgQmFzZS5wcm90b3R5cGVbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2UucHJvdG90eXBlLCAoKHJ1bGVzIHx8IHt9KVtuYW1lXSB8fCBuYW1lKSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtaXhJbiwgbmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgKF9hID0gKF9iID0gQmFzZS5wcm90b3R5cGUpLmNvbXBvbmVudExpc3QpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYi5jb21wb25lbnRMaXN0ID0gW10pO1xuICAgICAgICBCYXNlLnByb3RvdHlwZS5jb21wb25lbnRMaXN0LnB1c2gobWl4SW5bZXhwb3J0cy5NSVhJTl9OQU1FX1NZTUJPTF0pO1xuICAgICAgICByZXR1cm4gQmFzZTtcbiAgICB9O1xufVxuZXhwb3J0cy5taXhpbiA9IG1peGluO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNpemUyID0gdm9pZCAwO1xuY2xhc3MgU2l6ZTIge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy53ID0gMDtcbiAgICAgICAgdGhpcy5oID0gMDtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgICAgICAgdGhpcy53ID0gYXJnc1swXTtcbiAgICAgICAgICAgIHRoaXMuaCA9ICdudW1iZXInID09PSB0eXBlb2YgYXJnc1sxXSA/IGFyZ3NbMV0gOiBhcmdzWzBdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy53ID0gYXJnc1swXS53O1xuICAgICAgICAgICAgdGhpcy5oID0gYXJnc1swXS5oO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMudyArPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy5oICs9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLncgKz0gc3Viai53O1xuICAgICAgICB0aGlzLmggKz0gc3Viai5oO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbXVsKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy53ICo9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLmggKj0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudyAqPSBzdWJqLnc7XG4gICAgICAgIHRoaXMuaCAqPSBzdWJqLmg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbmV4cG9ydHMuU2l6ZTIgPSBTaXplMjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5WZWN0b3IyID0gdm9pZCAwO1xuY2xhc3MgVmVjdG9yMiB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLnggPSAwO1xuICAgICAgICB0aGlzLnkgPSAwO1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICB0aGlzLnggPSBhcmdzWzBdO1xuICAgICAgICAgICAgdGhpcy55ID0gYXJnc1sxXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3NbMF0ueDtcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3NbMF0ueTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLnggKz0gc3ViajtcbiAgICAgICAgICAgIHRoaXMueSArPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54ICs9IHN1YmoueDtcbiAgICAgICAgdGhpcy55ICs9IHN1YmoueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHN1YihzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMueCAtPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy55IC09IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnggLT0gc3Viai54O1xuICAgICAgICB0aGlzLnkgLT0gc3Viai55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbXVsKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy54ICo9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLnkgKj0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueCAqPSBzdWJqLng7XG4gICAgICAgIHRoaXMueSAqPSBzdWJqLnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBtb3ZlVG8odGFyZ2V0LCBzdGVwKSB7XG4gICAgICAgIFZlY3RvcjIubW92ZVRvKHRoaXMsIHRhcmdldCwgc3RlcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBkaXN0YW5jZVRvKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gVmVjdG9yMi5kaXN0YW5jZSh0aGlzLCB0YXJnZXQpO1xuICAgIH1cbiAgICBzdGF0aWMgdXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XG4gICAgfVxuICAgIHN0YXRpYyBkb3duKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XG4gICAgfVxuICAgIHN0YXRpYyBsZWZ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgcmlnaHQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIHplcm8oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIG1vdmVUbyhzdWJqZWN0LCB0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gVmVjdG9yMi5ub3JtYWxpemUodGFyZ2V0LnN1YihzdWJqZWN0KSk7XG4gICAgICAgIHN1YmplY3QuYWRkKGRpcmVjdGlvbi5tdWwoc3RlcCkpO1xuICAgICAgICByZXR1cm4gc3ViamVjdDtcbiAgICB9XG4gICAgc3RhdGljIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIubGVuKGIuc3ViKGEpKTtcbiAgICB9XG4gICAgc3RhdGljIGxlbihhKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoYS54ICoqIDIgKyBhLnkgKiogMik7XG4gICAgfVxuICAgIHN0YXRpYyBub3JtYWxpemUoYSkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBWZWN0b3IyLmxlbihhKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKGEueCAvIGxlbmd0aCwgYS55IC8gbGVuZ3RoKTtcbiAgICB9XG59XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJveENvbGxpZGVyID0gdm9pZCAwO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jb25zdCBNaXhlcl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL01peGVyXCIpO1xuZXhwb3J0cy5ib3hDb2xsaWRlciA9IHtcbiAgICBbTWl4ZXJfMS5NSVhJTl9OQU1FX1NZTUJPTF06ICdib3hDb2xsaWRlcicsXG4gICAgW01peGVyXzEuTUlYSU5fUkVRVUlSRV9TWU1CT0xdOiBbJ3RyYW5zZm9ybSddLFxuICAgIHZlcnRpY2VzKCkge1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gdGhpcy5zY3J1ZmY7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLnNpemU7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0b3BMZWZ0LFxuICAgICAgICAgICAgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHsgeDogdG9wTGVmdC54ICsgc2l6ZS53LCB5OiB0b3BMZWZ0LnkgfSksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoeyB4OiB0b3BMZWZ0LnggKyBzaXplLncsIHk6IHRvcExlZnQueSArIHNpemUuaCB9KSxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyXzEuVmVjdG9yMih7IHg6IHRvcExlZnQueCwgeTogdG9wTGVmdC55ICsgc2l6ZS5oIH0pLFxuICAgICAgICBdO1xuICAgIH0sXG4gICAgaGFzQ29sbGlzaW9uV2l0aCh0YXJnZXQpIHtcbiAgICAgICAgLy8gQW5vdGhlciBib3hDb2xsaWRlciBlbnRpdHlcbiAgICAgICAgY29uc3QgY3VyclZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcygpO1xuICAgICAgICBjb25zdCB0YXJnZXRWZXJ0aWNlcyA9IHRhcmdldC52ZXJ0aWNlcygpO1xuICAgICAgICByZXR1cm4gY3VyclZlcnRpY2VzWzBdLnggPCB0YXJnZXRWZXJ0aWNlc1sxXS54XG4gICAgICAgICAgICAmJiBjdXJyVmVydGljZXNbMV0ueCA+IHRhcmdldFZlcnRpY2VzWzBdLnhcbiAgICAgICAgICAgICYmIGN1cnJWZXJ0aWNlc1swXS55IDwgdGFyZ2V0VmVydGljZXNbMl0ueVxuICAgICAgICAgICAgJiYgY3VyclZlcnRpY2VzWzJdLnkgPiB0YXJnZXRWZXJ0aWNlc1swXS55O1xuICAgIH0sXG4gICAgb25Db2xsaXNpb25XaXRoKHRhcmdldCwgY2IpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIHZhciBfZDtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdGFyZ2V0KSB7XG4gICAgICAgICAgICAoX2EgPSB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10gPSB7fSk7XG4gICAgICAgICAgICAoX2IgPSAoX2QgPSB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10pW3RhcmdldF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfZFt0YXJnZXRdID0gW10pO1xuICAgICAgICAgICAgdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhcmdldF0ucHVzaChjYik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoX2MgPSB0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10pICE9PSBudWxsICYmIF9jICE9PSB2b2lkIDAgPyBfYyA6ICh0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10gPSBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgY29uc3QgbGlzdGVuZXJMaXN0ID0gdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddLmdldCh0YXJnZXQpIHx8IFtdO1xuICAgICAgICAgICAgbGlzdGVuZXJMaXN0LnB1c2goY2IpO1xuICAgICAgICAgICAgdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddLnNldCh0YXJnZXQsIGxpc3RlbmVyTGlzdCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHVuc3Vic2NyaWJlRnJvbUNvbGxpc2lvbldpdGgodGFyZ2V0LCBjYikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICBpZiAoJ3N0cmluZycgPT09IHR5cGVvZiB0YXJnZXQpIHtcbiAgICAgICAgICAgIChfYSA9IHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXSA9IHt9KTtcbiAgICAgICAgICAgIGlmICghY2IpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhcmdldF07XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J11bdGFyZ2V0XSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgIHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXVt0YXJnZXRdXG4gICAgICAgICAgICAgICAgPSB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J11bdGFyZ2V0XVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBjYik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoX2IgPSB0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6ICh0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10gPSBuZXcgTWFwKCkpO1xuICAgICAgICAgICAgaWYgKCFjYikge1xuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICB0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10uZGVsZXRlKHRhcmdldCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IGxpc3RlbmVyTGlzdCA9IHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXS5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIGlmICghbGlzdGVuZXJMaXN0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGlzdGVuZXJMaXN0ID0gbGlzdGVuZXJMaXN0LmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lciAhPT0gY2IpO1xuICAgICAgICAgICAgdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddLnNldCh0YXJnZXQsIGxpc3RlbmVyTGlzdCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNhbGxDb2xsaXNpb24oYm9keSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXSA9IG5ldyBNYXAoKSk7XG4gICAgICAgICh0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10uZ2V0KGJvZHkpIHx8IFtdKS5mb3JFYWNoKGNiID0+IGNiKGJvZHkpKTtcbiAgICB9LFxuICAgIGNhbGxUYWdDb2xsaXNpb24odGFnLCBib2R5TGlzdCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIChfYSA9IHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXSA9IHt9KTtcbiAgICAgICAgaWYgKCF0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J11bdGFnXSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhZ10uZm9yRWFjaChjYiA9PiBjYihib2R5TGlzdCkpO1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnRyYW5zZm9ybSA9IHZvaWQgMDtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IE1peGVyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvTWl4ZXJcIik7XG5leHBvcnRzLnRyYW5zZm9ybSA9IHtcbiAgICBbTWl4ZXJfMS5NSVhJTl9OQU1FX1NZTUJPTF06ICd0cmFuc2Zvcm0nLFxuICAgIFsnJHRyYW5zZm9ybS5wb3NpdGlvbi54J106IDAsXG4gICAgWyckdHJhbnNmb3JtLnBvc2l0aW9uLnknXTogMCxcbiAgICBbJyR0cmFuc2Zvcm0uc2l6ZS53J106IDEsXG4gICAgWyckdHJhbnNmb3JtLnNpemUuaCddOiAxLFxuICAgIFsnJHRyYW5zZm9ybS5hbmNob3IueCddOiAwLFxuICAgIFsnJHRyYW5zZm9ybS5hbmNob3IueSddOiAwLFxuICAgIGdldCBwb3NpdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzWyckdHJhbnNmb3JtLnBvc2l0aW9uLngnXSwgdGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi55J10pO1xuICAgIH0sXG4gICAgc2V0IHBvc2l0aW9uKHZlY3Rvcikge1xuICAgICAgICB0aGlzWyckdHJhbnNmb3JtLnBvc2l0aW9uLngnXSA9IHZlY3Rvci54O1xuICAgICAgICB0aGlzWyckdHJhbnNmb3JtLnBvc2l0aW9uLnknXSA9IHZlY3Rvci55O1xuICAgIH0sXG4gICAgZ2V0IHNpemUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2l6ZTJfMS5TaXplMih0aGlzWyckdHJhbnNmb3JtLnNpemUudyddLCB0aGlzWyckdHJhbnNmb3JtLnNpemUuaCddKTtcbiAgICB9LFxuICAgIHNldCBzaXplKHNpemUpIHtcbiAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5zaXplLncnXSA9IHNpemUudztcbiAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5zaXplLmgnXSA9IHNpemUuaDtcbiAgICB9LFxuICAgIGdldCBhbmNob3IoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpc1snJHRyYW5zZm9ybS5hbmNob3IueCddLCB0aGlzWyckdHJhbnNmb3JtLmFuY2hvci55J10pO1xuICAgIH0sXG4gICAgc2V0IGFuY2hvcih2ZWN0b3IpIHtcbiAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5hbmNob3IueCddID0gdmVjdG9yLng7XG4gICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0uYW5jaG9yLnknXSA9IHZlY3Rvci55O1xuICAgIH0sXG4gICAgZ2V0IHNjcnVmZigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzWyckdHJhbnNmb3JtLnBvc2l0aW9uLngnXSAtIHRoaXNbJyR0cmFuc2Zvcm0uYW5jaG9yLngnXSwgdGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi55J10gLSB0aGlzWyckdHJhbnNmb3JtLmFuY2hvci55J10pO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJuIFt4LCB5LCB3LCBoXSB3aGVyZSB4LHkgaXMgdGhlIHNjcnVmZiAodG9wIGxlZnQgY29ybmVyIG9mIHRoZSBlbnRpdHkpXG4gICAgICovXG4gICAgYm9keSgpIHtcbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0ucG9zaXRpb24ueCddIC0gdGhpc1snJHRyYW5zZm9ybS5hbmNob3IueCddLFxuICAgICAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi55J10gLSB0aGlzWyckdHJhbnNmb3JtLmFuY2hvci55J10sXG4gICAgICAgICAgICB0aGlzWyckdHJhbnNmb3JtLnNpemUudyddLFxuICAgICAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5zaXplLmgnXSxcbiAgICAgICAgXTtcbiAgICB9LFxuICAgIG1vdmVUbyh0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24ubW92ZVRvKHRhcmdldC5wb3NpdGlvbiwgc3RlcCk7XG4gICAgfSxcbiAgICBkaXN0YW5jZVRvKHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5kaXN0YW5jZVRvKHRhcmdldC5wb3NpdGlvbik7XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5EZWZhdWx0U2NlbmUgPSB2b2lkIDA7XG5jb25zdCBBU2NlbmVfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BU2NlbmVcIik7XG5jb25zdCBHYW1lQ29udHJvbGxlcl8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL0dhbWVDb250cm9sbGVyXCIpO1xuY29uc3QgUGxheWVyU3BhY2VTaGlwXzEgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvUGxheWVyU3BhY2VTaGlwXCIpO1xuY2xhc3MgRGVmYXVsdFNjZW5lIGV4dGVuZHMgQVNjZW5lXzEuQVNjZW5lIHtcbiAgICBpbml0KGVuZ2luZSwgY2FudmFzKSB7XG4gICAgICAgIHRoaXMuYWRkKCdnYW1lQ29udHJvbGxlcicsIG5ldyBHYW1lQ29udHJvbGxlcl8xLkdhbWVDb250cm9sbGVyKCkpO1xuICAgICAgICB0aGlzLmFkZCgncGxheWVyJywgbmV3IFBsYXllclNwYWNlU2hpcF8xLlBsYXllclNwYWNlU2hpcCgpKTtcbiAgICAgICAgc3VwZXIuaW5pdChlbmdpbmUsIGNhbnZhcyk7XG4gICAgfVxufVxuZXhwb3J0cy5EZWZhdWx0U2NlbmUgPSBEZWZhdWx0U2NlbmU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBEZWZhdWx0U2NlbmVfMSA9IHJlcXVpcmUoXCIuL3NjZW5lcy9EZWZhdWx0U2NlbmVcIik7XG5jb25zdCBFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2luZnJhc3RydWN0dXJlL0VuZ2luZVwiKTtcbmNvbnN0IElucHV0TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvSW5wdXRNYW5hZ2VyXCIpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gNjQwO1xuICAgIGNhbnZhcy5oZWlnaHQgPSA0ODA7XG4gICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWFpbi1jYW52YXMnKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgY29uc3QgaW5wdXRNYW5hZ2VyID0gbmV3IElucHV0TWFuYWdlcl8xLklucHV0TWFuYWdlcigpO1xuICAgIGNvbnN0IGRlZmF1bHRTY2VuZSA9IG5ldyBEZWZhdWx0U2NlbmVfMS5EZWZhdWx0U2NlbmUoKTtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgRW5naW5lXzEuRW5naW5lKCk7XG4gICAgZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgZGVmYXVsdFNjZW5lKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9