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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QyxRQUFRO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhO0FBQ2Isa0JBQWtCLG1CQUFPLENBQUMsa0VBQTJCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLDhEQUF5QjtBQUNqRCxvQkFBb0IsbUJBQU8sQ0FBQyxzREFBcUI7QUFDakQsdUJBQXVCLG1CQUFPLENBQUMsNERBQXdCO0FBQ3ZELGtCQUFrQixtQkFBTyxDQUFDLGtFQUEyQjtBQUNyRCxnQkFBZ0IsbUJBQU8sQ0FBQyw4REFBeUI7QUFDakQsMEJBQTBCLG1CQUFPLENBQUMsNERBQW1CO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7Ozs7OztBQ2pFQTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCx1QkFBdUI7QUFDdkIscUJBQXFCLG1CQUFPLENBQUMsa0RBQWM7QUFDM0Msa0JBQWtCLG1CQUFPLENBQUMsa0VBQTJCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLDhEQUF5QjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7Ozs7Ozs7Ozs7QUM5QlY7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsc0JBQXNCO0FBQ3RCLGtCQUFrQixtQkFBTyxDQUFDLGtFQUEyQjtBQUNyRCxnQkFBZ0IsbUJBQU8sQ0FBQyx3Q0FBUztBQUNqQyxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBMkI7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsZUFBZTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFELGVBQWU7QUFDcEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxXQUFXO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7Ozs7Ozs7Ozs7O0FDbkdUO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCx1QkFBdUI7QUFDdkIsZ0JBQWdCLG1CQUFPLENBQUMsOERBQXlCO0FBQ2pELG9CQUFvQixtQkFBTyxDQUFDLHNEQUFxQjtBQUNqRCxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBMkI7QUFDckQsa0JBQWtCLG1CQUFPLENBQUMsa0VBQTJCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLDhEQUF5QjtBQUNqRCxxQkFBcUIsbUJBQU8sQ0FBQyxrREFBYztBQUMzQyx1QkFBdUIsbUJBQU8sQ0FBQyw0REFBd0I7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLElBQUk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qjs7Ozs7Ozs7Ozs7QUNqRVY7QUFDYjtBQUNBO0FBQ0E7QUFDQSw2Q0FBNkMsUUFBUTtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFrQjtBQUNsQixnQkFBZ0IsbUJBQU8sQ0FBQyw4REFBeUI7QUFDakQsb0JBQW9CLG1CQUFPLENBQUMsc0RBQXFCO0FBQ2pELHVCQUF1QixtQkFBTyxDQUFDLDREQUF3QjtBQUN2RCxrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBMkI7QUFDckQsZ0JBQWdCLG1CQUFPLENBQUMsOERBQXlCO0FBQ2pELGtCQUFrQixtQkFBTyxDQUFDLGtFQUEyQjtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsT0FBTztBQUN2QixnQkFBZ0IsT0FBTztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7Ozs7Ozs7Ozs7O0FDaEVMO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDbkJGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZCxtQkFBbUIsbUJBQU8sQ0FBQyxvREFBWTtBQUN2QyxnQkFBZ0IsbUJBQU8sQ0FBQyw4Q0FBUztBQUNqQztBQUNBO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IscUJBQXFCO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUM3RkQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0Q7QUFDbEQ7QUFDQSx1QkFBdUIsb0NBQW9DO0FBQzNELHVCQUF1QixnREFBZ0Q7QUFDdkU7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSx1QkFBdUIsb0NBQW9DO0FBQzNELHVCQUF1QixnREFBZ0Q7QUFDdkU7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGdCQUFnQjs7Ozs7Ozs7Ozs7QUMzRUg7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsR0FBRztBQUN6Qyx1Q0FBdUMsTUFBTTtBQUM3Qyx5Q0FBeUMsSUFBSTtBQUM3QywrQ0FBK0MscUNBQXFDO0FBQ3BGLDRDQUE0QyxrQ0FBa0MsR0FBRywrQkFBK0I7QUFDaEg7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUMvREQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COzs7Ozs7Ozs7OztBQzdLUDtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxhQUFhLEdBQUcsNEJBQTRCLEdBQUcseUJBQXlCO0FBQ3hFLHlCQUF5QjtBQUN6Qiw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsa0NBQWtDLFdBQVcsa0JBQWtCLDZCQUE2QixXQUFXO0FBQ2hKO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDekJBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDckNBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOzs7Ozs7Ozs7OztBQ3BGRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxtQkFBbUI7QUFDbkIsa0JBQWtCLG1CQUFPLENBQUMsa0VBQTJCO0FBQ3JELGdCQUFnQixtQkFBTyxDQUFDLDhEQUF5QjtBQUNqRCxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MscUNBQXFDO0FBQ3pFLG9DQUFvQyw4Q0FBOEM7QUFDbEYsb0NBQW9DLHFDQUFxQztBQUN6RTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUlBQXlJO0FBQ3pJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSx5SUFBeUk7QUFDekk7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EscUlBQXFJO0FBQ3JJO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7Ozs7Ozs7Ozs7O0FDdkZhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQjtBQUNqQixrQkFBa0IsbUJBQU8sQ0FBQyxrRUFBMkI7QUFDckQsZ0JBQWdCLG1CQUFPLENBQUMsOERBQXlCO0FBQ2pELGdCQUFnQixtQkFBTyxDQUFDLDhEQUF5QjtBQUNqRCxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdkRhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG9CQUFvQjtBQUNwQixpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBMEI7QUFDbkQseUJBQXlCLG1CQUFPLENBQUMsb0VBQTRCO0FBQzdELDBCQUEwQixtQkFBTyxDQUFDLHNFQUE2QjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7OztVQ2JwQjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHVCQUF1QixtQkFBTyxDQUFDLDJEQUF1QjtBQUN0RCxpQkFBaUIsbUJBQU8sQ0FBQywrREFBeUI7QUFDbEQsdUJBQXVCLG1CQUFPLENBQUMsMkVBQStCO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9FbmVteS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvRW5lbXlQcm9qZWN0aWxlLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9HYW1lQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZW50aXRpZXMvUGxheWVyU3BhY2VTaGlwLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9Qcm9qZWN0aWxlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9BRW50aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9BU2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0NvbGxpZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9FbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0lucHV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvTWl4ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL1NpemUyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyLnRzIiwid2VicGFjazovLy8uL3NyYy9taXhpbnMvYm94Q29sbGllZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9taXhpbnMvdHJhbnNmb3JtLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvRGVmYXVsdFNjZW5lLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fbWV0YWRhdGEgPSAodGhpcyAmJiB0aGlzLl9fbWV0YWRhdGEpIHx8IGZ1bmN0aW9uIChrLCB2KSB7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKGssIHYpO1xufTtcbnZhciBFbmVteV8xO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmVteSA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgTWl4ZXJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9NaXhlclwiKTtcbmNvbnN0IHRyYW5zZm9ybV8xID0gcmVxdWlyZShcIi4uL21peGlucy90cmFuc2Zvcm1cIik7XG5jb25zdCBib3hDb2xsaWVkZXJfMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvYm94Q29sbGllZGVyXCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jb25zdCBTaXplMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1NpemUyXCIpO1xuY29uc3QgRW5lbXlQcm9qZWN0aWxlXzEgPSByZXF1aXJlKFwiLi9FbmVteVByb2plY3RpbGVcIik7XG5sZXQgRW5lbXkgPSBFbmVteV8xID0gY2xhc3MgRW5lbXkgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IocG9zaXRpb24pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50YWdMaXN0ID0gWydlbmVteSddO1xuICAgICAgICB0aGlzLmlzRmlyZVNldCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmZpcmVGcmVxID0gMzAwMDsgLy8gbXNcbiAgICAgICAgdGhpcy5zY29yZSA9IDEwO1xuICAgICAgICB0aGlzLmNhbkZpcmUgPSAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRmlyZVNldCA9IGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDE2LCAxNSk7XG4gICAgICAgIHRoaXMuYW5jaG9yID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDAsIDApO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2VzKClbM10ueSA+PSB0aGlzLnNjZW5lLmZyYW1lU2l6ZS5oKSB7XG4gICAgICAgICAgICBjb25zdCBnYW1lQ29udHJvbGxlciA9IHRoaXMuc2NlbmUuZ2V0KCdnYW1lQ29udHJvbGxlcicpO1xuICAgICAgICAgICAgZ2FtZUNvbnRyb2xsZXIuZ2FtZU92ZXIoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjdHguZmlsbFJlY3QoLi4udGhpcy5ib2R5KCkpO1xuICAgIH1cbiAgICBmaXJzdFJvd0ZpcmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5pc0ZpcmVTZXQgJiYgTWF0aC5yYW5kb20oKSA8PSBFbmVteV8xLmZpcmVEZXNpcmUpIHtcbiAgICAgICAgICAgIHRoaXMuaXNGaXJlU2V0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuZmlyZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dCh0aGlzLmNhbkZpcmUsIHRoaXMuZmlyZUZyZXEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaXJlKCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0aWxlID0gbmV3IEVuZW15UHJvamVjdGlsZV8xLkVuZW15UHJvamVjdGlsZShuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpcy5wb3NpdGlvbi54ICsgdGhpcy5zaXplLncgLyAyLCB0aGlzLnNjcnVmZi55ICsgNikpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwcm9qZWN0aWxlKTtcbiAgICAgICAgcHJvamVjdGlsZS5pbml0KHRoaXMuc2NlbmUpO1xuICAgIH1cbn07XG5FbmVteS5maXJlRGVzaXJlID0gMC4yOyAvLyAlXG5FbmVteSA9IEVuZW15XzEgPSBfX2RlY29yYXRlKFtcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikoYm94Q29sbGllZGVyXzEuYm94Q29sbGlkZXIpLFxuICAgICgwLCBNaXhlcl8xLm1peGluKSh0cmFuc2Zvcm1fMS50cmFuc2Zvcm0pLFxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbT2JqZWN0XSlcbl0sIEVuZW15KTtcbmV4cG9ydHMuRW5lbXkgPSBFbmVteTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmVteVByb2plY3RpbGUgPSB2b2lkIDA7XG5jb25zdCBQcm9qZWN0aWxlXzEgPSByZXF1aXJlKFwiLi9Qcm9qZWN0aWxlXCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jb25zdCBTaXplMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1NpemUyXCIpO1xuY2xhc3MgRW5lbXlQcm9qZWN0aWxlIGV4dGVuZHMgUHJvamVjdGlsZV8xLlByb2plY3RpbGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnRhZ0xpc3QgPSBbJ2VuZW15UHJvamVjdGlsZSddO1xuICAgICAgICB0aGlzLlNQRUVEID0gVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpLm11bCgyKTtcbiAgICB9XG4gICAgY3JlYXRlKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUyXzEuU2l6ZTIoNiwgNik7XG4gICAgICAgIHRoaXMuYW5jaG9yID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDMsIDMpO1xuICAgICAgICB0aGlzLm9uQ29sbGlzaW9uV2l0aCgncGxheWVyJywgKHRhcmdldExpc3QpID0+IHtcbiAgICAgICAgICAgIHRhcmdldExpc3RbMF0uZGVzdHJveSgpO1xuICAgICAgICAgICAgY29uc3QgZ2FtZUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLmdldCgnZ2FtZUNvbnRyb2xsZXInKTtcbiAgICAgICAgICAgIGdhbWVDb250cm9sbGVyLmdhbWVPdmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA+IHRoaXMuc2NlbmUuZnJhbWVTaXplLmggKyAxMCkge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuU1BFRUQubXVsKGR0KSk7XG4gICAgfVxufVxuZXhwb3J0cy5FbmVteVByb2plY3RpbGUgPSBFbmVteVByb2plY3RpbGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2FtZUNvbnRyb2xsZXIgPSB2b2lkIDA7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IEVuZW15XzEgPSByZXF1aXJlKFwiLi9FbmVteVwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY2xhc3MgR2FtZUNvbnRyb2xsZXIgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSAwO1xuICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSBmYWxzZTtcbiAgICB9XG4gICAgaW5pdChzY2VuZSkge1xuICAgICAgICBzdXBlci5pbml0KHNjZW5lKTtcbiAgICAgICAgY29uc3QgZVNpemUgPSBuZXcgRW5lbXlfMS5FbmVteShWZWN0b3IyXzEuVmVjdG9yMi56ZXJvKCkpLnNpemU7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5zY2VuZS5mcmFtZVNpemUudztcbiAgICAgICAgY29uc3QgZW5lbXlJblJvdyA9IDIwO1xuICAgICAgICBjb25zdCByZXN0ID0gd2lkdGggLSBlU2l6ZS53ICogZW5lbXlJblJvdztcbiAgICAgICAgY29uc3QgZ2FwVyA9IHJlc3QgLyAoZW5lbXlJblJvdyArIDEpO1xuICAgICAgICBjb25zdCBzdGFydFkgPSAwIC0gZVNpemUuaDtcbiAgICAgICAgY29uc3Qgc3RlcCA9IDEwO1xuICAgICAgICBjb25zdCB0aW1lID0gMTAwMDtcbiAgICAgICAgY29uc3Qgc3Bhd25FdmVyeVN0ZXBzID0gTWF0aC5jZWlsKChnYXBXICsgZVNpemUuaCkgLyBzdGVwKTtcbiAgICAgICAgbGV0IGVuZW15QXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IHN0ZXBzQmVoaW5kID0gMDtcbiAgICAgICAgbGV0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNHYW1lT3Zlcikge1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUm9sbCBkb3duXG4gICAgICAgICAgICBjb25zdCByZUVuZW15QXJyYXkgPSBbXTtcbiAgICAgICAgICAgIGxldCByb3c7XG4gICAgICAgICAgICBsZXQgZWRnZVJvdyA9IHRydWU7XG4gICAgICAgICAgICB3aGlsZSAocm93ID0gZW5lbXlBcnJheS5wb3AoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlUm93ID0gW107XG4gICAgICAgICAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgICAgICAgICAgd2hpbGUgKG5hbWUgPSByb3cucG9wKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW5lbXkgPSB0aGlzLnNjZW5lLmdldChuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFlbmVteSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBlbmVteS5wb3NpdGlvbiA9IGVuZW15LnBvc2l0aW9uLmFkZChWZWN0b3IyXzEuVmVjdG9yMi5kb3duKCkubXVsKHN0ZXApKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2VSb3cpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZW15LmZpcnN0Um93RmlyZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJlUm93LnB1c2gobmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZVJvdy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlRW5lbXlBcnJheS51bnNoaWZ0KHJlUm93KTtcbiAgICAgICAgICAgICAgICAgICAgZWRnZVJvdyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVuZW15QXJyYXkgPSByZUVuZW15QXJyYXk7XG4gICAgICAgICAgICAvLyBTcGF3biBuZXdcbiAgICAgICAgICAgIGlmIChzdGVwc0JlaGluZCAlIHNwYXduRXZlcnlTdGVwcyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGVuZW15QXJyYXkudW5zaGlmdChbXSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgcm93ID0gZW5lbXlBcnJheVswXTtcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kQ291bnQgPSBNYXRoLmNlaWwoMjAgLSBNYXRoLnJhbmRvbSgpICogMjApO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlZnRHYXAgPSAodGhpcy5zY2VuZS5mcmFtZVNpemUudyAtIHJhbmRDb3VudCAqIGVTaXplLncgLSAocmFuZENvdW50IC0gMSkgKiBnYXBXKSAvIDI7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByYW5kQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbmVteSA9IG5ldyBFbmVteV8xLkVuZW15KG5ldyBWZWN0b3IyXzEuVmVjdG9yMihsZWZ0R2FwICsgKGkgKiAoZVNpemUudyArIGdhcFcpKSwgc3RhcnRZKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NlbmUuYWRkKGVuZW15KTtcbiAgICAgICAgICAgICAgICAgICAgZW5lbXkuaW5pdCh0aGlzLnNjZW5lKTtcbiAgICAgICAgICAgICAgICAgICAgcm93LnB1c2goZW5lbXkubmFtZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RlcHNCZWhpbmQrKztcbiAgICAgICAgfSwgdGltZSk7XG4gICAgfVxuICAgIGFkZFNjb3JlKGVuZW15KSB7XG4gICAgICAgIHRoaXMuc2NvcmUgKz0gZW5lbXkuc2NvcmU7XG4gICAgICAgIGlmICh0aGlzLnNjb3JlID4gMCAmJiAwID09PSB0aGlzLnNjb3JlICUgNTApIHtcbiAgICAgICAgICAgIC8vIHRoaXMuc2NlbmUuZ2V0PFBsYXllckJhcj4oJ3BsYXllckJhcicpPy5tb3ZlVXAoMTApXG4gICAgICAgICAgICAvLyB0aGlzLnNjZW5lLmdldDxQbGF5ZXJCYXI+KCdwbGF5ZXJCYXInKT8uaW5jcmVhc2VTcGVlZCgxLjUpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2NvcmUgPiAwICYmIDAgPT09IHRoaXMuc2NvcmUgJSAzMCkge1xuICAgICAgICAgICAgLy90aGlzLnNjZW5lLmdldDxCYWxsPignYmFsbCcpPy5zcGVlZFVwKHt4OiAwLjUsIHk6IDAuNX0pXG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuaXNHYW1lT3ZlciA9IHRydWU7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNHYW1lT3Zlcikge1xuICAgICAgICAgICAgdGhpcy5zY2VuZS5lbnRpdHlMaXN0LmZpbHRlcihlID0+IGUubmFtZSAhPT0gdGhpcy5uYW1lKS5mb3JFYWNoKGUgPT4gdGhpcy5zY2VuZS5yZW1vdmUoZS5uYW1lKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBpZiAoIXRoaXMuaXNHYW1lT3Zlcikge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICBjdHguZm9udCA9ICcxMCBzZXJpZic7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQoYHNjb3JlOiAke3RoaXMuc2NvcmV9YCwgMTUsIHRoaXMuc2NlbmUuZnJhbWVTaXplLmggLSA5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pc0dhbWVPdmVyKSB7XG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JlZCc7XG4gICAgICAgICAgICBjdHguZm9udCA9ICc2NXB4IHNlcmlmJztcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dChgR0FNRSBPVkVSYCwgdGhpcy5zY2VuZS5mcmFtZVNpemUudyAvIDIgLSAyMDAsIHRoaXMuc2NlbmUuZnJhbWVTaXplLmggLyAyICsgMTApO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5HYW1lQ29udHJvbGxlciA9IEdhbWVDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBsYXllclNwYWNlU2hpcCA9IHZvaWQgMDtcbmNvbnN0IE1peGVyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvTWl4ZXJcIik7XG5jb25zdCB0cmFuc2Zvcm1fMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvdHJhbnNmb3JtXCIpO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FFbnRpdHlcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBQcm9qZWN0aWxlXzEgPSByZXF1aXJlKFwiLi9Qcm9qZWN0aWxlXCIpO1xuY29uc3QgYm94Q29sbGllZGVyXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL2JveENvbGxpZWRlclwiKTtcbmxldCBQbGF5ZXJTcGFjZVNoaXAgPSBjbGFzcyBQbGF5ZXJTcGFjZVNoaXAgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFsncGxheWVyJ107XG4gICAgICAgIHRoaXMuU1BFRUQgPSAxMDtcbiAgICAgICAgdGhpcy5pc0ZpcmVTZXQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5maXJlRnJlcSA9IDE1MDsgLy8gbXNcbiAgICAgICAgdGhpcy5jYW5GaXJlID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pc0ZpcmVTZXQgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgaW5pdChzY2VuZSkge1xuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMigxNSwgMjUpO1xuICAgICAgICB0aGlzLmFuY2hvciA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzLnNpemUudyAvIDIsIHRoaXMuc2l6ZS5oIC8gMik7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoe1xuICAgICAgICAgICAgeDogc2NlbmUuZnJhbWVTaXplLncgLyAyLFxuICAgICAgICAgICAgeTogc2NlbmUuZnJhbWVTaXplLmggLSAxNSAtIHRoaXMuc2l6ZS5oIC8gMixcbiAgICAgICAgfSk7XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUpO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLmFkZChWZWN0b3IyXzEuVmVjdG9yMi5yaWdodCgpLm11bChkdCAqIGlucHV0Lmhvcml6b250YWwgKiB0aGlzLlNQRUVEKSk7XG4gICAgICAgIGNvbnN0IHsgeCB9ID0gdGhpcy5zY3J1ZmY7XG4gICAgICAgIGlmICh4IDw9IDApIHtcbiAgICAgICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpcy5hbmNob3IueCwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeCA+PSB0aGlzLnNjZW5lLmZyYW1lU2l6ZS53KSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHRoaXMuc2NlbmUuZnJhbWVTaXplLncgLSB0aGlzLnNpemUudyArIHRoaXMuYW5jaG9yLngsIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlucHV0LnNwYWNlICYmICF0aGlzLmlzRmlyZVNldCkge1xuICAgICAgICAgICAgdGhpcy5pc0ZpcmVTZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5maXJlKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHRoaXMuY2FuRmlyZSwgdGhpcy5maXJlRnJlcSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZmlyZSgpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdGlsZSA9IG5ldyBQcm9qZWN0aWxlXzEuUHJvamVjdGlsZShuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpcy5wb3NpdGlvbi54LCB0aGlzLnNjcnVmZi55IC0gNikpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChwcm9qZWN0aWxlKTtcbiAgICAgICAgcHJvamVjdGlsZS5pbml0KHRoaXMuc2NlbmUpO1xuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjdHguZmlsbFJlY3QoLi4udGhpcy5ib2R5KCkpO1xuICAgIH1cbn07XG5QbGF5ZXJTcGFjZVNoaXAgPSBfX2RlY29yYXRlKFtcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikoYm94Q29sbGllZGVyXzEuYm94Q29sbGlkZXIpLFxuICAgICgwLCBNaXhlcl8xLm1peGluKSh0cmFuc2Zvcm1fMS50cmFuc2Zvcm0pXG5dLCBQbGF5ZXJTcGFjZVNoaXApO1xuZXhwb3J0cy5QbGF5ZXJTcGFjZVNoaXAgPSBQbGF5ZXJTcGFjZVNoaXA7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlByb2plY3RpbGUgPSB2b2lkIDA7XG5jb25zdCBNaXhlcl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL01peGVyXCIpO1xuY29uc3QgdHJhbnNmb3JtXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL3RyYW5zZm9ybVwiKTtcbmNvbnN0IGJveENvbGxpZWRlcl8xID0gcmVxdWlyZShcIi4uL21peGlucy9ib3hDb2xsaWVkZXJcIik7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmxldCBQcm9qZWN0aWxlID0gY2xhc3MgUHJvamVjdGlsZSBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLlNQRUVEID0gVmVjdG9yMl8xLlZlY3RvcjIudXAoKS5tdWwoMTApO1xuICAgICAgICB0aGlzLmNyZWF0ZShwb3NpdGlvbik7XG4gICAgfVxuICAgIGNyZWF0ZShwb3NpdGlvbikge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gcG9zaXRpb247XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDYsIDYpO1xuICAgICAgICB0aGlzLmFuY2hvciA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigzLCAzKTtcbiAgICAgICAgdGhpcy5vbkNvbGxpc2lvbldpdGgoJ2VuZW15JywgKHRhcmdldExpc3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGdhbWVDb250cm9sbGVyID0gdGhpcy5zY2VuZS5nZXQoJ2dhbWVDb250cm9sbGVyJyk7XG4gICAgICAgICAgICB0YXJnZXRMaXN0LmZvckVhY2goZW5lbXkgPT4ge1xuICAgICAgICAgICAgICAgIGdhbWVDb250cm9sbGVyLmFkZFNjb3JlKGVuZW15KTtcbiAgICAgICAgICAgICAgICBlbmVteS5kZXN0cm95KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5vbkNvbGxpc2lvbldpdGgoJ2VuZW15UHJvamVjdGlsZScsICh0YXJnZXRMaXN0KSA9PiB7XG4gICAgICAgICAgICB0YXJnZXRMaXN0LmZvckVhY2goZW5lbXlQcm9qZWN0aWxlID0+IHtcbiAgICAgICAgICAgICAgICBlbmVteVByb2plY3RpbGUuZGVzdHJveSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKHRoaXMucG9zaXRpb24ueSA8IC0xMCkge1xuICAgICAgICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHRoaXMucG9zaXRpb24uYWRkKHRoaXMuU1BFRUQubXVsKGR0KSk7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSB0aGlzLnBvc2l0aW9uO1xuICAgICAgICBjb25zdCB7IHcsIGggfSA9IHRoaXMuc2l6ZTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmVsbGlwc2UoeCwgeSwgdyAvIDIsIGggLyAyLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9XG59O1xuUHJvamVjdGlsZSA9IF9fZGVjb3JhdGUoW1xuICAgICgwLCBNaXhlcl8xLm1peGluKShib3hDb2xsaWVkZXJfMS5ib3hDb2xsaWRlciksXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKHRyYW5zZm9ybV8xLnRyYW5zZm9ybSksXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtPYmplY3RdKVxuXSwgUHJvamVjdGlsZSk7XG5leHBvcnRzLlByb2plY3RpbGUgPSBQcm9qZWN0aWxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFFbnRpdHkgPSB2b2lkIDA7XG5jbGFzcyBBRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lID0gJ3VubmFtZWQnICsgY3J5cHRvLnJhbmRvbVVVSUQoKSkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLnRhZ0xpc3QgPSBbXTtcbiAgICB9XG4gICAgaW5pdChzY2VuZSkge1xuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgIH1cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLnNjZW5lLnJlbW92ZSh0aGlzLm5hbWUpO1xuICAgIH1cbn1cbmV4cG9ydHMuQUVudGl0eSA9IEFFbnRpdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQVNjZW5lID0gdm9pZCAwO1xuY29uc3QgQ29sbGlkZXJfMSA9IHJlcXVpcmUoXCIuL0NvbGxpZGVyXCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuL1NpemUyXCIpO1xuY2xhc3MgQVNjZW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fZW50aXR5TWFwID0ge307XG4gICAgICAgIHRoaXMuX3RhZ0RpY3QgPSB7fTsgLy8gdGFnIC0+IG5hbWVMaXN0XG4gICAgICAgIHRoaXMuX2NvbGxpc2lvbkJvZHlNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5mcmFtZVNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMigwLCAwKTtcbiAgICB9XG4gICAgZ2V0IGVudGl0eUxpc3QoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuX2VudGl0eU1hcCk7XG4gICAgfVxuICAgIGdldCBjb2xsaXNpb25Cb2R5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fY29sbGlzaW9uQm9keU1hcCk7XG4gICAgfVxuICAgIGluaXQoZW5naW5lLCBjYW52YXMpIHtcbiAgICAgICAgdGhpcy5mcmFtZVNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMihjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLl9lbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgIHRoaXMuZW50aXR5TGlzdC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBlbnRpdHkuaW5pdCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgLy8gQ29sbGlzaW9uc1xuICAgICAgICBjb25zdCB7IGNvdXBsZUxpc3QsIHRhZ01hcCB9ID0gbmV3IENvbGxpZGVyXzEuQ29sbGlkZXIodGhpcy5jb2xsaXNpb25Cb2R5TGlzdClcbiAgICAgICAgICAgIC5wcm9jZXNzKCk7XG4gICAgICAgIGNvdXBsZUxpc3QuZm9yRWFjaCgoW2EsIGJdKSA9PiB7XG4gICAgICAgICAgICBhLmNhbGxDb2xsaXNpb24oYik7XG4gICAgICAgICAgICBiLmNhbGxDb2xsaXNpb24oYSk7XG4gICAgICAgIH0pO1xuICAgICAgICBbLi4udGFnTWFwLmtleXMoKV0uZm9yRWFjaChiID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9uZVRhZ0JyYW5jaCA9IHRhZ01hcC5nZXQoYik7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhvbmVUYWdCcmFuY2gpLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICBiLmNhbGxUYWdDb2xsaXNpb24odGFnLCBvbmVUYWdCcmFuY2hbdGFnXSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFVwZGF0ZVxuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS51cGRhdGUoZHQsIGlucHV0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIC8vIERlZmF1bHQgY2xlYXIgc2NlbmUgYmVmb3JlIGFsbCB0aGUgZW50aXRpZXMgcmVuZGVyZWRcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS5yZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoLi4uYXJncykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGxldCBuYW1lO1xuICAgICAgICBsZXQgZW50aXR5O1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAxICYmICdzdHJpbmcnID09PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgICAgICAgbmFtZSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBlbnRpdHkgPSBhcmdzWzFdO1xuICAgICAgICAgICAgZW50aXR5Lm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW50aXR5ID0gYXJnc1swXTtcbiAgICAgICAgICAgIG5hbWUgPSBlbnRpdHkubmFtZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9lbnRpdHlNYXBbbmFtZV0gPSBlbnRpdHk7XG4gICAgICAgIC8vIFRhZ3NcbiAgICAgICAgZW50aXR5LnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgdmFyIF9iO1xuICAgICAgICAgICAgKF9hID0gKF9iID0gdGhpcy5fdGFnRGljdClbdGFnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW3RhZ10gPSBbXSk7XG4gICAgICAgICAgICB0aGlzLl90YWdEaWN0W3RhZ10ucHVzaChuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIENvbGxpc2lvbnNcbiAgICAgICAgaWYgKChfYSA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5jb21wb25lbnRMaXN0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaW5jbHVkZXMoJ2JveENvbGxpZGVyJykpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpc2lvbkJvZHlNYXBbbmFtZV0gPSBlbnRpdHk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbnRpdHlNYXBbbmFtZV0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXS50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3RhZ0RpY3RbdGFnXSA9IHRoaXMuX3RhZ0RpY3RbdGFnXS5maWx0ZXIoZW50aXR5TmFtZSA9PiBlbnRpdHlOYW1lICE9PSBuYW1lKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9lbnRpdHlNYXBbbmFtZV07XG4gICAgICAgIGRlbGV0ZSB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwW25hbWVdO1xuICAgIH1cbiAgICBnZXQobmFtZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZW50aXR5TWFwW25hbWVdO1xuICAgIH1cbiAgICBmaW5kQnlUYWcodGFnKSB7XG4gICAgICAgIHJldHVybiAodGhpcy5fdGFnRGljdFt0YWddIHx8IFtdKS5tYXAobmFtZSA9PiB0aGlzLmdldChuYW1lKSk7XG4gICAgfVxufVxuZXhwb3J0cy5BU2NlbmUgPSBBU2NlbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ29sbGlkZXIgPSB2b2lkIDA7XG5jbGFzcyBDb2xsaWRlciB7XG4gICAgY29uc3RydWN0b3IoX2JvZHlMaXN0KSB7XG4gICAgICAgIHRoaXMuX2JvZHlMaXN0ID0gX2JvZHlMaXN0O1xuICAgIH1cbiAgICBwcm9jZXNzKCkge1xuICAgICAgICBjb25zdCBvcGVuRmlyc3RPcmRlciA9IFsnb3BlbicsICdjbG9zZSddOyAvLyBpZiB0d28gZmlndXJlcyBzdGF5IG9uIG9uZSBsaW5lIHRoZXkgbXVzdCBjcm9zc1xuICAgICAgICBjb25zdCB4UmVmTGlzdCA9IHRoaXMuX2JvZHlMaXN0LnJlZHVjZSgoYWNjLCBiKSA9PiB7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLngsIHBvczogJ29wZW4nLCByZWY6IGIgfSk7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnggKyBiLnNpemUudywgcG9zOiAnY2xvc2UnLCByZWY6IGIgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEudiAtIGIudiB8fCAob3BlbkZpcnN0T3JkZXIuaW5kZXhPZihhLnBvcykgLSBvcGVuRmlyc3RPcmRlci5pbmRleE9mKGIucG9zKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB4Q2FuZGlkYXRlUGF0aE1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgbGV0IGN1cnJPcGVuTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB4UmVmTGlzdC5mb3JFYWNoKGNyID0+IHtcbiAgICAgICAgICAgIGlmIChjci5wb3MgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgICAgIC8vIHBhaXIgd2l0aCBhbGwgb3BlblxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBbLi4uY3Vyck9wZW5NYXAudmFsdWVzKCldLmZvckVhY2gob3BlbkNyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHVzaCBib3RoLWRpcmVjdGlvbiBwYXRoc1xuICAgICAgICAgICAgICAgICAgICB4Q2FuZGlkYXRlUGF0aE1hcC5zZXQoY3IucmVmLCAoeENhbmRpZGF0ZVBhdGhNYXAuZ2V0KGNyLnJlZikgfHwgbmV3IFNldCgpKS5hZGQob3BlbkNyLnJlZikpO1xuICAgICAgICAgICAgICAgICAgICB4Q2FuZGlkYXRlUGF0aE1hcC5zZXQob3BlbkNyLnJlZiwgKHhDYW5kaWRhdGVQYXRoTWFwLmdldChvcGVuQ3IucmVmKSB8fCBuZXcgU2V0KCkpLmFkZChjci5yZWYpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgb3BlbiBpdHNlbGZcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5zZXQoY3IucmVmLCBjcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbG9zZVxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLmRlbGV0ZShjci5yZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeVJlZkxpc3QgPSB0aGlzLl9ib2R5TGlzdC5yZWR1Y2UoKGFjYywgYikgPT4ge1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi55LCBwb3M6ICdvcGVuJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi55ICsgYi5zaXplLmgsIHBvczogJ2Nsb3NlJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLnYgLSBiLnYgfHwgKG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYS5wb3MpIC0gb3BlbkZpcnN0T3JkZXIuaW5kZXhPZihiLnBvcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgY3Vyck9wZW5NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IGNvdXBsZUxpc3QgPSBbXTtcbiAgICAgICAgY29uc3QgdGFnTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICB5UmVmTGlzdC5mb3JFYWNoKGNyID0+IHtcbiAgICAgICAgICAgIGlmIChjci5wb3MgPT09ICdvcGVuJykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrIGV4aXN0aW5nIGNvbGxpc2lvbnMgYnkgeCAob25lIGRpcmVjdGlvbiBpcyBlbm91Z2gpXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIFsuLi5jdXJyT3Blbk1hcC52YWx1ZXMoKV0uZm9yRWFjaChvcGVuQ3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB4Um9vdCA9IHhDYW5kaWRhdGVQYXRoTWFwLmdldChjci5yZWYpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoeFJvb3QgJiYgeFJvb3QuaGFzKG9wZW5Dci5yZWYpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VwbGVMaXN0LnB1c2goW2NyLnJlZiwgb3BlbkNyLnJlZl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFnRGljdCA9ICh0YWdNYXAuZ2V0KGNyLnJlZikgfHwge30pO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3BlbkNyLnJlZi50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKF9hID0gdGFnRGljdFt0YWddKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAodGFnRGljdFt0YWddID0gW10pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ0RpY3RbdGFnXS5wdXNoKG9wZW5Dci5yZWYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXModGFnRGljdCkubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ01hcC5zZXQoY3IucmVmLCB0YWdEaWN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCBvcGVuIGl0c2VsZlxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLnNldChjci5yZWYsIGNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNsb3NlXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuZGVsZXRlKGNyLnJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4geyBjb3VwbGVMaXN0LCB0YWdNYXAgfTtcbiAgICB9XG59XG5leHBvcnRzLkNvbGxpZGVyID0gQ29sbGlkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRW5naW5lID0gdm9pZCAwO1xuY2xhc3MgRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GUkFNRV9SQVRFID0gNjA7XG4gICAgICAgIHRoaXMuaXNEZWJ1Z09uID0gZmFsc2U7XG4gICAgfVxuICAgIGdldCBjYW52YXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XG4gICAgfVxuICAgIGdldCBjdHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdHg7XG4gICAgfVxuICAgIGdldCBpbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgIH1cbiAgICBzdGFydChjYW52YXMsIGN0eCwgaW5wdXQsIHNjZW5lKSB7XG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5fY3R4ID0gY3R4O1xuICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUgPSBzY2VuZTtcbiAgICAgICAgdGhpcy5faW5wdXQub25LZXlQcmVzcygnS2V5RycsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuaXNEZWJ1Z09uID0gIXRoaXMuaXNEZWJ1Z09uO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5faW5wdXQuc3RhcnQoKTtcbiAgICAgICAgc2NlbmUuaW5pdCh0aGlzLCBjYW52YXMpO1xuICAgICAgICB0aGlzLl9sYXN0RnJhbWVUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgIH1cbiAgICBjaGFuZ2VTY2VuZSgpIHtcbiAgICAgICAgLy8gVE9ET1xuICAgIH1cbiAgICBfZ2FtZUxvb3AodGltZSkge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWUgLSB0aGlzLl9sYXN0RnJhbWVUaW1lO1xuICAgICAgICB0aGlzLl9sYXN0RnJhbWVUaW1lID0gdGltZTtcbiAgICAgICAgY29uc3QgZnBzID0gTWF0aC5mbG9vcigxMDAwIC8gZGVsdGEpO1xuICAgICAgICBjb25zdCBkdCA9IE1hdGgubWF4KDAsIE51bWJlcihNYXRoLnJvdW5kKGRlbHRhIC8gKDEwMDAgLyB0aGlzLkZSQU1FX1JBVEUpKS50b0ZpeGVkKDIpKSk7XG4gICAgICAgIC8vIGlucHV0XG4gICAgICAgIHRoaXMuX2lucHV0LnVwZGF0ZShkdCk7XG4gICAgICAgIC8vIHVwZGF0ZVxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUudXBkYXRlKGR0LCB0aGlzLl9pbnB1dCk7XG4gICAgICAgIC8vIHJlbmRlclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucmVuZGVyKHRoaXMuX2NhbnZhcywgdGhpcy5fY3R4LCBkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIGRlYnVnXG4gICAgICAgIHRoaXMuX2RlYnVnKGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy8gbmV4dCBpdGVyYXRpb25cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgIH1cbiAgICBfZGVidWcoZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWJ1Z09uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFJlY3QoMCwgMCwgMTIwLCA4NSk7XG4gICAgICAgICAgICB0aGlzLl9jdHguZm9udCA9ICcxNXB4IHNlcmlmJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDiiIIgJHtkdH1gLCAxMCwgMTUsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgzpQ6ICR7ZGVsdGF9YCwgMTAsIDMwLCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYGZwczogJHtmcHN9YCwgMTAsIDQ1LCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYG9iai5jb3VudDogJHt0aGlzLl9jdXJyZW50U2NlbmUuZW50aXR5TGlzdC5sZW5ndGh9YCwgMTAsIDYwLCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYGluIEgsVjogJHt0aGlzLl9pbnB1dC5ob3Jpem9udGFsLnRvRml4ZWQoMil9LCR7dGhpcy5pbnB1dC52ZXJ0aWNhbC50b0ZpeGVkKDIpfWAsIDEwLCA3NSwgMTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuRW5naW5lID0gRW5naW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLklucHV0TWFuYWdlciA9IHZvaWQgMDtcbi8vIFRPRE8gYWRkIG1vdXNlXG5jbGFzcyBJbnB1dE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVwID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICB0aGlzLmtleSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5jb2RlID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmFsdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN0cmxLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXRhS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0ID0ge307XG4gICAgICAgIHRoaXMuX2tleURvd25MaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleSA9IGUua2V5O1xuICAgICAgICAgICAgdGhpcy5jb2RlID0gZS5jb2RlO1xuICAgICAgICAgICAgdGhpcy5hbHRLZXkgPSBlLmFsdEtleTtcbiAgICAgICAgICAgIHRoaXMuY3RybEtleSA9IGUuY3RybEtleTtcbiAgICAgICAgICAgIHRoaXMubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgICAgICAgICAgc3dpdGNoIChlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdTcGFjZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUEnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvcml6b250YWwgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWwgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlTJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWwgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAodGhpcy5fc3Vic2NyaXB0aW9uRGljdFtlLmNvZGVdIHx8IFtdKS5mb3JFYWNoKGNiID0+IGNiKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9rZXlVcExpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUEnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52ZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXhpc1NlbnNpdGl2aXR5ID0gMSAvIDEwO1xuICAgICAgICB0aGlzLl9heGlzVGFibGUgPSB7XG4gICAgICAgICAgICBoaWU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IC0xID8gLTEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmRlOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaXo7XG4gICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25MaXN0ZW5lcik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5VXBMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUoZHQpO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUoZHQpO1xuICAgIH1cbiAgICBvbktleVByZXNzKGNvZGUsIGNiKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICAoX2EgPSAoX2IgPSB0aGlzLl9zdWJzY3JpcHRpb25EaWN0KVtjb2RlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW2NvZGVdID0gW10pO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdLnB1c2goY2IpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZUtleVByZXNzKGNvZGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXSA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0uZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBjYik7XG4gICAgfVxufVxuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSBJbnB1dE1hbmFnZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubWl4aW4gPSBleHBvcnRzLk1JWElOX1JFUVVJUkVfU1lNQk9MID0gZXhwb3J0cy5NSVhJTl9OQU1FX1NZTUJPTCA9IHZvaWQgMDtcbmV4cG9ydHMuTUlYSU5fTkFNRV9TWU1CT0wgPSBTeW1ib2wuZm9yKCckbWl4aW5OYW1lJyk7XG5leHBvcnRzLk1JWElOX1JFUVVJUkVfU1lNQk9MID0gU3ltYm9sLmZvcignJG1peGluUmVxdWlyZScpO1xuZnVuY3Rpb24gbWl4aW4obWl4SW4sIHJ1bGVzID0gbnVsbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBkZWNvcmF0b3IoQmFzZSkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgO1xuICAgICAgICAobWl4SW5bZXhwb3J0cy5NSVhJTl9SRVFVSVJFX1NZTUJPTF0gfHwgW10pLmZvckVhY2goKHJlcXVpcmVkTWl4aW5OYW1lKSA9PiB7XG4gICAgICAgICAgICBpZiAoIShCYXNlLnByb3RvdHlwZS5jb21wb25lbnRMaXN0IHx8IFtdKS5pbmNsdWRlcyhyZXF1aXJlZE1peGluTmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1peGluICR7bWl4SW5bZXhwb3J0cy5NSVhJTl9OQU1FX1NZTUJPTF19IHJlcXVpcmVzICR7cmVxdWlyZWRNaXhpbk5hbWV9LCBidXQgaXQgaGFzbid0IGFwcGxpZWQgdG8gJHtCYXNlLm5hbWV9IHlldGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWl4SW4pLmZvckVhY2gobmFtZSA9PiB7XG4gICAgICAgICAgICBpZiAocnVsZXMgfHwgdHlwZW9mIEJhc2UucHJvdG90eXBlW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXNlLnByb3RvdHlwZSwgKChydWxlcyB8fCB7fSlbbmFtZV0gfHwgbmFtZSksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobWl4SW4sIG5hbWUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIChfYSA9IChfYiA9IEJhc2UucHJvdG90eXBlKS5jb21wb25lbnRMaXN0KSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2IuY29tcG9uZW50TGlzdCA9IFtdKTtcbiAgICAgICAgQmFzZS5wcm90b3R5cGUuY29tcG9uZW50TGlzdC5wdXNoKG1peEluW2V4cG9ydHMuTUlYSU5fTkFNRV9TWU1CT0xdKTtcbiAgICAgICAgcmV0dXJuIEJhc2U7XG4gICAgfTtcbn1cbmV4cG9ydHMubWl4aW4gPSBtaXhpbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TaXplMiA9IHZvaWQgMDtcbmNsYXNzIFNpemUyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMudyA9IDA7XG4gICAgICAgIHRoaXMuaCA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLmggPSAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMV0gPyBhcmdzWzFdIDogYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF0udztcbiAgICAgICAgICAgIHRoaXMuaCA9IGFyZ3NbMF0uaDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKz0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCArPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICs9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICs9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG11bChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMudyAqPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy5oICo9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLncgKj0gc3Viai53O1xuICAgICAgICB0aGlzLmggKj0gc3Viai5oO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG5leHBvcnRzLlNpemUyID0gU2l6ZTI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuVmVjdG9yMiA9IHZvaWQgMDtcbmNsYXNzIFZlY3RvcjIge1xuICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgdGhpcy54ID0gMDtcbiAgICAgICAgdGhpcy55ID0gMDtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgYXJnc1swXSkge1xuICAgICAgICAgICAgdGhpcy54ID0gYXJnc1swXTtcbiAgICAgICAgICAgIHRoaXMueSA9IGFyZ3NbMV07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnggPSBhcmdzWzBdLng7XG4gICAgICAgICAgICB0aGlzLnkgPSBhcmdzWzBdLnk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy54ICs9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLnkgKz0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueCArPSBzdWJqLng7XG4gICAgICAgIHRoaXMueSArPSBzdWJqLnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdWIoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLnggLT0gc3ViajtcbiAgICAgICAgICAgIHRoaXMueSAtPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54IC09IHN1YmoueDtcbiAgICAgICAgdGhpcy55IC09IHN1YmoueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG11bChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMueCAqPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy55ICo9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnggKj0gc3Viai54O1xuICAgICAgICB0aGlzLnkgKj0gc3Viai55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbW92ZVRvKHRhcmdldCwgc3RlcCkge1xuICAgICAgICBWZWN0b3IyLm1vdmVUbyh0aGlzLCB0YXJnZXQsIHN0ZXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGlzdGFuY2VUbyh0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIuZGlzdGFuY2UodGhpcywgdGFyZ2V0KTtcbiAgICB9XG4gICAgc3RhdGljIHVwKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgLTEpO1xuICAgIH1cbiAgICBzdGF0aWMgZG93bigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDEpO1xuICAgIH1cbiAgICBzdGF0aWMgbGVmdCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKC0xLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIHJpZ2h0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMSwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyB6ZXJvKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyBtb3ZlVG8oc3ViamVjdCwgdGFyZ2V0LCBzdGVwKSB7XG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IFZlY3RvcjIubm9ybWFsaXplKHRhcmdldC5zdWIoc3ViamVjdCkpO1xuICAgICAgICBzdWJqZWN0LmFkZChkaXJlY3Rpb24ubXVsKHN0ZXApKTtcbiAgICAgICAgcmV0dXJuIHN1YmplY3Q7XG4gICAgfVxuICAgIHN0YXRpYyBkaXN0YW5jZShhLCBiKSB7XG4gICAgICAgIHJldHVybiBWZWN0b3IyLmxlbihiLnN1YihhKSk7XG4gICAgfVxuICAgIHN0YXRpYyBsZW4oYSkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGEueCAqKiAyICsgYS55ICoqIDIpO1xuICAgIH1cbiAgICBzdGF0aWMgbm9ybWFsaXplKGEpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gVmVjdG9yMi5sZW4oYSk7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMihhLnggLyBsZW5ndGgsIGEueSAvIGxlbmd0aCk7XG4gICAgfVxufVxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5ib3hDb2xsaWRlciA9IHZvaWQgMDtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgTWl4ZXJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9NaXhlclwiKTtcbmV4cG9ydHMuYm94Q29sbGlkZXIgPSB7XG4gICAgW01peGVyXzEuTUlYSU5fTkFNRV9TWU1CT0xdOiAnYm94Q29sbGlkZXInLFxuICAgIFtNaXhlcl8xLk1JWElOX1JFUVVJUkVfU1lNQk9MXTogWyd0cmFuc2Zvcm0nXSxcbiAgICB2ZXJ0aWNlcygpIHtcbiAgICAgICAgY29uc3QgdG9wTGVmdCA9IHRoaXMuc2NydWZmO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5zaXplO1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdG9wTGVmdCxcbiAgICAgICAgICAgIG5ldyBWZWN0b3IyXzEuVmVjdG9yMih7IHg6IHRvcExlZnQueCArIHNpemUudywgeTogdG9wTGVmdC55IH0pLFxuICAgICAgICAgICAgbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHsgeDogdG9wTGVmdC54ICsgc2l6ZS53LCB5OiB0b3BMZWZ0LnkgKyBzaXplLmggfSksXG4gICAgICAgICAgICBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoeyB4OiB0b3BMZWZ0LngsIHk6IHRvcExlZnQueSArIHNpemUuaCB9KSxcbiAgICAgICAgXTtcbiAgICB9LFxuICAgIGhhc0NvbGxpc2lvbldpdGgodGFyZ2V0KSB7XG4gICAgICAgIC8vIEFub3RoZXIgYm94Q29sbGlkZXIgZW50aXR5XG4gICAgICAgIGNvbnN0IGN1cnJWZXJ0aWNlcyA9IHRoaXMudmVydGljZXMoKTtcbiAgICAgICAgY29uc3QgdGFyZ2V0VmVydGljZXMgPSB0YXJnZXQudmVydGljZXMoKTtcbiAgICAgICAgcmV0dXJuIGN1cnJWZXJ0aWNlc1swXS54IDwgdGFyZ2V0VmVydGljZXNbMV0ueFxuICAgICAgICAgICAgJiYgY3VyclZlcnRpY2VzWzFdLnggPiB0YXJnZXRWZXJ0aWNlc1swXS54XG4gICAgICAgICAgICAmJiBjdXJyVmVydGljZXNbMF0ueSA8IHRhcmdldFZlcnRpY2VzWzJdLnlcbiAgICAgICAgICAgICYmIGN1cnJWZXJ0aWNlc1syXS55ID4gdGFyZ2V0VmVydGljZXNbMF0ueTtcbiAgICB9LFxuICAgIG9uQ29sbGlzaW9uV2l0aCh0YXJnZXQsIGNiKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB2YXIgX2Q7XG4gICAgICAgIGlmICgnc3RyaW5nJyA9PT0gdHlwZW9mIHRhcmdldCkge1xuICAgICAgICAgICAgKF9hID0gdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAodGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddID0ge30pO1xuICAgICAgICAgICAgKF9iID0gKF9kID0gdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddKVt0YXJnZXRdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAoX2RbdGFyZ2V0XSA9IFtdKTtcbiAgICAgICAgICAgIHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXVt0YXJnZXRdLnB1c2goY2IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKF9jID0gdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAodGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddID0gbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIGNvbnN0IGxpc3RlbmVyTGlzdCA9IHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXS5nZXQodGFyZ2V0KSB8fCBbXTtcbiAgICAgICAgICAgIGxpc3RlbmVyTGlzdC5wdXNoKGNiKTtcbiAgICAgICAgICAgIHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXS5zZXQodGFyZ2V0LCBsaXN0ZW5lckxpc3QpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICB1bnN1YnNjcmliZUZyb21Db2xsaXNpb25XaXRoKHRhcmdldCwgY2IpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgaWYgKCdzdHJpbmcnID09PSB0eXBlb2YgdGFyZ2V0KSB7XG4gICAgICAgICAgICAoX2EgPSB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10gPSB7fSk7XG4gICAgICAgICAgICBpZiAoIWNiKSB7XG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXVt0YXJnZXRdO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhcmdldF0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J11bdGFyZ2V0XVxuICAgICAgICAgICAgICAgID0gdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhcmdldF1cbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lciAhPT0gY2IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgKF9iID0gdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAodGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddID0gbmV3IE1hcCgpKTtcbiAgICAgICAgICAgIGlmICghY2IpIHtcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgdGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddLmRlbGV0ZSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBsaXN0ZW5lckxpc3QgPSB0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10uZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVyTGlzdCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxpc3RlbmVyTGlzdCA9IGxpc3RlbmVyTGlzdC5maWx0ZXIobGlzdGVuZXIgPT4gbGlzdGVuZXIgIT09IGNiKTtcbiAgICAgICAgICAgIHRoaXNbJ2JveENvbGxpZGVyLmJvZHlTdWJzY3JpcHRpb25NYXAnXS5zZXQodGFyZ2V0LCBsaXN0ZW5lckxpc3QpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjYWxsQ29sbGlzaW9uKGJvZHkpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzWydib3hDb2xsaWRlci5ib2R5U3Vic2NyaXB0aW9uTWFwJ10gPSBuZXcgTWFwKCkpO1xuICAgICAgICAodGhpc1snYm94Q29sbGlkZXIuYm9keVN1YnNjcmlwdGlvbk1hcCddLmdldChib2R5KSB8fCBbXSkuZm9yRWFjaChjYiA9PiBjYihib2R5KSk7XG4gICAgfSxcbiAgICBjYWxsVGFnQ29sbGlzaW9uKHRhZywgYm9keUxpc3QpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICAoX2EgPSB0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0aGlzWydib3hDb2xsaWRlci50YWdTdWJzY3JpcHRpb25EaWN0J10gPSB7fSk7XG4gICAgICAgIGlmICghdGhpc1snYm94Q29sbGlkZXIudGFnU3Vic2NyaXB0aW9uRGljdCddW3RhZ10pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHRoaXNbJ2JveENvbGxpZGVyLnRhZ1N1YnNjcmlwdGlvbkRpY3QnXVt0YWddLmZvckVhY2goY2IgPT4gY2IoYm9keUxpc3QpKTtcbiAgICB9LFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy50cmFuc2Zvcm0gPSB2b2lkIDA7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBNaXhlcl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL01peGVyXCIpO1xuZXhwb3J0cy50cmFuc2Zvcm0gPSB7XG4gICAgW01peGVyXzEuTUlYSU5fTkFNRV9TWU1CT0xdOiAndHJhbnNmb3JtJyxcbiAgICBbJyR0cmFuc2Zvcm0ucG9zaXRpb24ueCddOiAwLFxuICAgIFsnJHRyYW5zZm9ybS5wb3NpdGlvbi55J106IDAsXG4gICAgWyckdHJhbnNmb3JtLnNpemUudyddOiAxLFxuICAgIFsnJHRyYW5zZm9ybS5zaXplLmgnXTogMSxcbiAgICBbJyR0cmFuc2Zvcm0uYW5jaG9yLngnXTogMCxcbiAgICBbJyR0cmFuc2Zvcm0uYW5jaG9yLnknXTogMCxcbiAgICBnZXQgcG9zaXRpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi54J10sIHRoaXNbJyR0cmFuc2Zvcm0ucG9zaXRpb24ueSddKTtcbiAgICB9LFxuICAgIHNldCBwb3NpdGlvbih2ZWN0b3IpIHtcbiAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi54J10gPSB2ZWN0b3IueDtcbiAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi55J10gPSB2ZWN0b3IueTtcbiAgICB9LFxuICAgIGdldCBzaXplKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNpemUyXzEuU2l6ZTIodGhpc1snJHRyYW5zZm9ybS5zaXplLncnXSwgdGhpc1snJHRyYW5zZm9ybS5zaXplLmgnXSk7XG4gICAgfSxcbiAgICBzZXQgc2l6ZShzaXplKSB7XG4gICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0uc2l6ZS53J10gPSBzaXplLnc7XG4gICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0uc2l6ZS5oJ10gPSBzaXplLmg7XG4gICAgfSxcbiAgICBnZXQgYW5jaG9yKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHRoaXNbJyR0cmFuc2Zvcm0uYW5jaG9yLngnXSwgdGhpc1snJHRyYW5zZm9ybS5hbmNob3IueSddKTtcbiAgICB9LFxuICAgIHNldCBhbmNob3IodmVjdG9yKSB7XG4gICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0uYW5jaG9yLngnXSA9IHZlY3Rvci54O1xuICAgICAgICB0aGlzWyckdHJhbnNmb3JtLmFuY2hvci55J10gPSB2ZWN0b3IueTtcbiAgICB9LFxuICAgIGdldCBzY3J1ZmYoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIodGhpc1snJHRyYW5zZm9ybS5wb3NpdGlvbi54J10gLSB0aGlzWyckdHJhbnNmb3JtLmFuY2hvci54J10sIHRoaXNbJyR0cmFuc2Zvcm0ucG9zaXRpb24ueSddIC0gdGhpc1snJHRyYW5zZm9ybS5hbmNob3IueSddKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybiBbeCwgeSwgdywgaF0gd2hlcmUgeCx5IGlzIHRoZSBzY3J1ZmYgKHRvcCBsZWZ0IGNvcm5lciBvZiB0aGUgZW50aXR5KVxuICAgICAqL1xuICAgIGJvZHkoKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0aGlzWyckdHJhbnNmb3JtLnBvc2l0aW9uLngnXSAtIHRoaXNbJyR0cmFuc2Zvcm0uYW5jaG9yLngnXSxcbiAgICAgICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0ucG9zaXRpb24ueSddIC0gdGhpc1snJHRyYW5zZm9ybS5hbmNob3IueSddLFxuICAgICAgICAgICAgdGhpc1snJHRyYW5zZm9ybS5zaXplLncnXSxcbiAgICAgICAgICAgIHRoaXNbJyR0cmFuc2Zvcm0uc2l6ZS5oJ10sXG4gICAgICAgIF07XG4gICAgfSxcbiAgICBtb3ZlVG8odGFyZ2V0LCBzdGVwKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uLm1vdmVUbyh0YXJnZXQucG9zaXRpb24sIHN0ZXApO1xuICAgIH0sXG4gICAgZGlzdGFuY2VUbyh0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucG9zaXRpb24uZGlzdGFuY2VUbyh0YXJnZXQucG9zaXRpb24pO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRGVmYXVsdFNjZW5lID0gdm9pZCAwO1xuY29uc3QgQVNjZW5lXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQVNjZW5lXCIpO1xuY29uc3QgR2FtZUNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9HYW1lQ29udHJvbGxlclwiKTtcbmNvbnN0IFBsYXllclNwYWNlU2hpcF8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllclNwYWNlU2hpcFwiKTtcbmNsYXNzIERlZmF1bHRTY2VuZSBleHRlbmRzIEFTY2VuZV8xLkFTY2VuZSB7XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmFkZCgnZ2FtZUNvbnRyb2xsZXInLCBuZXcgR2FtZUNvbnRyb2xsZXJfMS5HYW1lQ29udHJvbGxlcigpKTtcbiAgICAgICAgdGhpcy5hZGQoJ3BsYXllcicsIG5ldyBQbGF5ZXJTcGFjZVNoaXBfMS5QbGF5ZXJTcGFjZVNoaXAoKSk7XG4gICAgICAgIHN1cGVyLmluaXQoZW5naW5lLCBjYW52YXMpO1xuICAgIH1cbn1cbmV4cG9ydHMuRGVmYXVsdFNjZW5lID0gRGVmYXVsdFNjZW5lO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgRGVmYXVsdFNjZW5lXzEgPSByZXF1aXJlKFwiLi9zY2VuZXMvRGVmYXVsdFNjZW5lXCIpO1xuY29uc3QgRW5naW5lXzEgPSByZXF1aXJlKFwiLi9pbmZyYXN0cnVjdHVyZS9FbmdpbmVcIik7XG5jb25zdCBJbnB1dE1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL2luZnJhc3RydWN0dXJlL0lucHV0TWFuYWdlclwiKTtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGNhbnZhcy53aWR0aCA9IDY0MDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gNDgwO1xuICAgIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21haW4tY2FudmFzJyk7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKS5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGNvbnN0IGlucHV0TWFuYWdlciA9IG5ldyBJbnB1dE1hbmFnZXJfMS5JbnB1dE1hbmFnZXIoKTtcbiAgICBjb25zdCBkZWZhdWx0U2NlbmUgPSBuZXcgRGVmYXVsdFNjZW5lXzEuRGVmYXVsdFNjZW5lKCk7XG4gICAgY29uc3QgZW5naW5lID0gbmV3IEVuZ2luZV8xLkVuZ2luZSgpO1xuICAgIGVuZ2luZS5zdGFydChjYW52YXMsIGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpLCBpbnB1dE1hbmFnZXIsIGRlZmF1bHRTY2VuZSk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==