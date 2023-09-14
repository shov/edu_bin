/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/entities/Snake.ts":
/*!*******************************!*\
  !*** ./src/entities/Snake.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snake = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const rectangle_1 = __webpack_require__(/*! ../mixins/rectangle */ "./src/mixins/rectangle.ts");
let Snake = class Snake extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.location = new Vector2_1.Vector2(100, 100);
    }
    init(scene) {
        super.init(scene);
        this.color = 'lime';
        this.size = new Size2_1.Size2(40, 40);
    }
    render(canvas, ctx, dt, delta, fps) {
        this.draw(ctx, this.location);
    }
};
Snake = __decorate([
    (0, Mixer_1.mixin)(rectangle_1.rectangle)
], Snake);
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

/***/ "./src/mixins/rectangle.ts":
/*!*********************************!*\
  !*** ./src/mixins/rectangle.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rectangle = void 0;
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Mixer_1 = __webpack_require__(/*! ../infrastructure/Mixer */ "./src/infrastructure/Mixer.ts");
exports.rectangle = {
    [Mixer_1.MIXIN_NAME_SYMBOL]: 'rectangle',
    color: 'white',
    size: new Size2_1.Size2(10, 10),
    draw(ctx, location) {
        ctx.fillStyle = this.color;
        ctx.fillRect(location.x, location.y, this.size.w, this.size.h);
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
const Snake_1 = __webpack_require__(/*! ../entities/Snake */ "./src/entities/Snake.ts");
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        // this.add('gameController', new GameController())
        // this.add('player', new PlayerSpaceShip())
        this.add('snake', new Snake_1.Snake());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCLG1CQUFPLENBQUMsMkRBQXVCO0FBQ3RELGlCQUFpQixtQkFBTyxDQUFDLCtEQUF5QjtBQUNsRCx1QkFBdUIsbUJBQU8sQ0FBQywyRUFBK0I7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL1NuYWtlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9BRW50aXR5LnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9BU2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0NvbGxpZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9FbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0lucHV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvTWl4ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL1NpemUyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyLnRzIiwid2VicGFjazovLy8uL3NyYy9taXhpbnMvcmVjdGFuZ2xlLnRzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvRGVmYXVsdFNjZW5lLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TbmFrZSA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgTWl4ZXJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9NaXhlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IHJlY3RhbmdsZV8xID0gcmVxdWlyZShcIi4uL21peGlucy9yZWN0YW5nbGVcIik7XG5sZXQgU25ha2UgPSBjbGFzcyBTbmFrZSBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5sb2NhdGlvbiA9IG5ldyBWZWN0b3IyXzEuVmVjdG9yMigxMDAsIDEwMCk7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgc3VwZXIuaW5pdChzY2VuZSk7XG4gICAgICAgIHRoaXMuY29sb3IgPSAnbGltZSc7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDQwLCA0MCk7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgdGhpcy5kcmF3KGN0eCwgdGhpcy5sb2NhdGlvbik7XG4gICAgfVxufTtcblNuYWtlID0gX19kZWNvcmF0ZShbXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKHJlY3RhbmdsZV8xLnJlY3RhbmdsZSlcbl0sIFNuYWtlKTtcbmV4cG9ydHMuU25ha2UgPSBTbmFrZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BRW50aXR5ID0gdm9pZCAwO1xuY2xhc3MgQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IobmFtZSA9ICd1bm5hbWVkJyArIGNyeXB0by5yYW5kb21VVUlEKCkpIHtcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICAgICAgdGhpcy50YWdMaXN0ID0gW107XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5uYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi9Db2xsaWRlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi9TaXplMlwiKTtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgICAgICB0aGlzLl90YWdEaWN0ID0ge307IC8vIHRhZyAtPiBuYW1lTGlzdFxuICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwID0ge307XG4gICAgICAgIHRoaXMuZnJhbWVTaXplID0gbmV3IFNpemUyXzEuU2l6ZTIoMCwgMCk7XG4gICAgfVxuICAgIGdldCBlbnRpdHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9lbnRpdHlNYXApO1xuICAgIH1cbiAgICBnZXQgY29sbGlzaW9uQm9keUxpc3QoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QudmFsdWVzKHRoaXMuX2NvbGxpc2lvbkJvZHlNYXApO1xuICAgIH1cbiAgICBpbml0KGVuZ2luZSwgY2FudmFzKSB7XG4gICAgICAgIHRoaXMuZnJhbWVTaXplID0gbmV3IFNpemUyXzEuU2l6ZTIoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fZW5naW5lID0gZW5naW5lO1xuICAgICAgICB0aGlzLmVudGl0eUxpc3QuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgICAgZW50aXR5LmluaXQodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIC8vIENvbGxpc2lvbnNcbiAgICAgICAgY29uc3QgeyBjb3VwbGVMaXN0LCB0YWdNYXAgfSA9IG5ldyBDb2xsaWRlcl8xLkNvbGxpZGVyKHRoaXMuY29sbGlzaW9uQm9keUxpc3QpXG4gICAgICAgICAgICAucHJvY2VzcygpO1xuICAgICAgICBjb3VwbGVMaXN0LmZvckVhY2goKFthLCBiXSkgPT4ge1xuICAgICAgICAgICAgYS5jYWxsQ29sbGlzaW9uKGIpO1xuICAgICAgICAgICAgYi5jYWxsQ29sbGlzaW9uKGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgWy4uLnRhZ01hcC5rZXlzKCldLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvbmVUYWdCcmFuY2ggPSB0YWdNYXAuZ2V0KGIpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMob25lVGFnQnJhbmNoKS5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgYi5jYWxsVGFnQ29sbGlzaW9uKHRhZywgb25lVGFnQnJhbmNoW3RhZ10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkudXBkYXRlKGR0LCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICAvLyBEZWZhdWx0IGNsZWFyIHNjZW5lIGJlZm9yZSBhbGwgdGhlIGVudGl0aWVzIHJlbmRlcmVkXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkucmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKC4uLmFyZ3MpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgbGV0IGVudGl0eTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIG5hbWUgPSBhcmdzWzBdO1xuICAgICAgICAgICAgZW50aXR5ID0gYXJnc1sxXTtcbiAgICAgICAgICAgIGVudGl0eS5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVudGl0eSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBuYW1lID0gZW50aXR5Lm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZW50aXR5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICAvLyBUYWdzXG4gICAgICAgIGVudGl0eS50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3RhZ0RpY3QpW3RhZ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYlt0YWddID0gW10pO1xuICAgICAgICAgICAgdGhpcy5fdGFnRGljdFt0YWddLnB1c2gobmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDb2xsaXNpb25zXG4gICAgICAgIGlmICgoX2EgPSBlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRpdHkuY29tcG9uZW50TGlzdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKCdib3hDb2xsaWRlcicpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW50aXR5TWFwW25hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9lbnRpdHlNYXBbbmFtZV0udGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICB0aGlzLl90YWdEaWN0W3RhZ10gPSB0aGlzLl90YWdEaWN0W3RhZ10uZmlsdGVyKGVudGl0eU5hbWUgPT4gZW50aXR5TmFtZSAhPT0gbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZWxldGUgdGhpcy5fZW50aXR5TWFwW25hbWVdO1xuICAgICAgICBkZWxldGUgdGhpcy5fY29sbGlzaW9uQm9keU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZmluZEJ5VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3RhZ0RpY3RbdGFnXSB8fCBbXSkubWFwKG5hbWUgPT4gdGhpcy5nZXQobmFtZSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuQVNjZW5lID0gQVNjZW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNvbGxpZGVyID0gdm9pZCAwO1xuY2xhc3MgQ29sbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKF9ib2R5TGlzdCkge1xuICAgICAgICB0aGlzLl9ib2R5TGlzdCA9IF9ib2R5TGlzdDtcbiAgICB9XG4gICAgcHJvY2VzcygpIHtcbiAgICAgICAgY29uc3Qgb3BlbkZpcnN0T3JkZXIgPSBbJ29wZW4nLCAnY2xvc2UnXTsgLy8gaWYgdHdvIGZpZ3VyZXMgc3RheSBvbiBvbmUgbGluZSB0aGV5IG11c3QgY3Jvc3NcbiAgICAgICAgY29uc3QgeFJlZkxpc3QgPSB0aGlzLl9ib2R5TGlzdC5yZWR1Y2UoKGFjYywgYikgPT4ge1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54LCBwb3M6ICdvcGVuJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54ICsgYi5zaXplLncsIHBvczogJ2Nsb3NlJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLnYgLSBiLnYgfHwgKG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYS5wb3MpIC0gb3BlbkZpcnN0T3JkZXIuaW5kZXhPZihiLnBvcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeENhbmRpZGF0ZVBhdGhNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBjdXJyT3Blbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeFJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBwYWlyIHdpdGggYWxsIG9wZW5cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgWy4uLmN1cnJPcGVuTWFwLnZhbHVlcygpXS5mb3JFYWNoKG9wZW5DciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2ggYm90aC1kaXJlY3Rpb24gcGF0aHNcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KGNyLnJlZiwgKHhDYW5kaWRhdGVQYXRoTWFwLmdldChjci5yZWYpIHx8IG5ldyBTZXQoKSkuYWRkKG9wZW5Dci5yZWYpKTtcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KG9wZW5Dci5yZWYsICh4Q2FuZGlkYXRlUGF0aE1hcC5nZXQob3BlbkNyLnJlZikgfHwgbmV3IFNldCgpKS5hZGQoY3IucmVmKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9wZW4gaXRzZWxmXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuc2V0KGNyLnJlZiwgY3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5kZWxldGUoY3IucmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHlSZWZMaXN0ID0gdGhpcy5fYm9keUxpc3QucmVkdWNlKChhY2MsIGIpID0+IHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSwgcG9zOiAnb3BlbicsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSArIGIuc2l6ZS5oLCBwb3M6ICdjbG9zZScsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS52IC0gYi52IHx8IChvcGVuRmlyc3RPcmRlci5pbmRleE9mKGEucG9zKSAtIG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYi5wb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGN1cnJPcGVuTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBjb3VwbGVMaXN0ID0gW107XG4gICAgICAgIGNvbnN0IHRhZ01hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeVJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBleGlzdGluZyBjb2xsaXNpb25zIGJ5IHggKG9uZSBkaXJlY3Rpb24gaXMgZW5vdWdoKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBbLi4uY3Vyck9wZW5NYXAudmFsdWVzKCldLmZvckVhY2gob3BlbkNyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFJvb3QgPSB4Q2FuZGlkYXRlUGF0aE1hcC5nZXQoY3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhSb290ICYmIHhSb290LmhhcyhvcGVuQ3IucmVmKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291cGxlTGlzdC5wdXNoKFtjci5yZWYsIG9wZW5Dci5yZWZdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhZ0RpY3QgPSAodGFnTWFwLmdldChjci5yZWYpIHx8IHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5Dci5yZWYudGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfYSA9IHRhZ0RpY3RbdGFnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRhZ0RpY3RbdGFnXSA9IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdEaWN0W3RhZ10ucHVzaChvcGVuQ3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRhZ0RpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdNYXAuc2V0KGNyLnJlZiwgdGFnRGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgb3BlbiBpdHNlbGZcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5zZXQoY3IucmVmLCBjcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbG9zZVxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLmRlbGV0ZShjci5yZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgY291cGxlTGlzdCwgdGFnTWFwIH07XG4gICAgfVxufVxuZXhwb3J0cy5Db2xsaWRlciA9IENvbGxpZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVuZ2luZSA9IHZvaWQgMDtcbmNsYXNzIEVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRlJBTUVfUkFURSA9IDYwO1xuICAgICAgICB0aGlzLmlzRGVidWdPbiA9IGZhbHNlO1xuICAgIH1cbiAgICBnZXQgY2FudmFzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xuICAgIH1cbiAgICBnZXQgY3R4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3R4O1xuICAgIH1cbiAgICBnZXQgaW5wdXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnB1dDtcbiAgICB9XG4gICAgc3RhcnQoY2FudmFzLCBjdHgsIGlucHV0LCBzY2VuZSkge1xuICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XG4gICAgICAgIHRoaXMuX2N0eCA9IGN0eDtcbiAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gc2NlbmU7XG4gICAgICAgIHRoaXMuX2lucHV0Lm9uS2V5UHJlc3MoJ0tleUcnLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzRGVidWdPbiA9ICF0aGlzLmlzRGVidWdPbjtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX2lucHV0LnN0YXJ0KCk7XG4gICAgICAgIHNjZW5lLmluaXQodGhpcywgY2FudmFzKTtcbiAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lID0+IHRoaXMuX2dhbWVMb29wKHRpbWUpKTtcbiAgICB9XG4gICAgY2hhbmdlU2NlbmUoKSB7XG4gICAgICAgIC8vIFRPRE9cbiAgICB9XG4gICAgX2dhbWVMb29wKHRpbWUpIHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aW1lIC0gdGhpcy5fbGFzdEZyYW1lVGltZTtcbiAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZSA9IHRpbWU7XG4gICAgICAgIGNvbnN0IGZwcyA9IE1hdGguZmxvb3IoMTAwMCAvIGRlbHRhKTtcbiAgICAgICAgY29uc3QgZHQgPSBNYXRoLm1heCgwLCBOdW1iZXIoTWF0aC5yb3VuZChkZWx0YSAvICgxMDAwIC8gdGhpcy5GUkFNRV9SQVRFKSkudG9GaXhlZCgyKSkpO1xuICAgICAgICAvLyBpbnB1dFxuICAgICAgICB0aGlzLl9pbnB1dC51cGRhdGUoZHQpO1xuICAgICAgICAvLyB1cGRhdGVcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnVwZGF0ZShkdCwgdGhpcy5faW5wdXQpO1xuICAgICAgICAvLyByZW5kZXJcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lLnJlbmRlcih0aGlzLl9jYW52YXMsIHRoaXMuX2N0eCwgZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICAvLyBkZWJ1Z1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIG5leHQgaXRlcmF0aW9uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lID0+IHRoaXMuX2dhbWVMb29wKHRpbWUpKTtcbiAgICB9XG4gICAgX2RlYnVnKGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICh0aGlzLmlzRGVidWdPbikge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlU3R5bGUgPSAnd2hpdGUnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxSZWN0KDAsIDAsIDEyMCwgODUpO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSAnMTVweCBzZXJpZic7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChg4oiCICR7ZHR9YCwgMTAsIDE1LCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYM6UOiAke2RlbHRhfWAsIDEwLCAzMCwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBmcHM6ICR7ZnBzfWAsIDEwLCA0NSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBvYmouY291bnQ6ICR7dGhpcy5fY3VycmVudFNjZW5lLmVudGl0eUxpc3QubGVuZ3RofWAsIDEwLCA2MCwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGBpbiBILFY6ICR7dGhpcy5faW5wdXQuaG9yaXpvbnRhbC50b0ZpeGVkKDIpfSwke3RoaXMuaW5wdXQudmVydGljYWwudG9GaXhlZCgyKX1gLCAxMCwgNzUsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkVuZ2luZSA9IEVuZ2luZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSB2b2lkIDA7XG4vLyBUT0RPIGFkZCBtb3VzZVxuY2xhc3MgSW5wdXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgdGhpcy5rZXkgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuY29kZSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdHJsS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWV0YUtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdCA9IHt9O1xuICAgICAgICB0aGlzLl9rZXlEb3duTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlBJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhkZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5RCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52ZGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52aWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgKHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbZS5jb2RlXSB8fCBbXSkuZm9yRWFjaChjYiA9PiBjYigpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fa2V5VXBMaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleSA9IGUua2V5O1xuICAgICAgICAgICAgdGhpcy5jb2RlID0gZS5jb2RlO1xuICAgICAgICAgICAgdGhpcy5hbHRLZXkgPSBlLmFsdEtleTtcbiAgICAgICAgICAgIHRoaXMuY3RybEtleSA9IGUuY3RybEtleTtcbiAgICAgICAgICAgIHRoaXMubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgICAgICAgICAgc3dpdGNoIChlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdTcGFjZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlBJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5yaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaXo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5RCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGR6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5kb3duKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52aXo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlTJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy51cCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmR6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmF4aXNTZW5zaXRpdml0eSA9IDEgLyAxMDtcbiAgICAgICAgdGhpcy5fYXhpc1RhYmxlID0ge1xuICAgICAgICAgICAgaGllOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAxID8gMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGl6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGRlOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAtMSA/IC0xIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZHo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aWU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAxID8gMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdml6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZkZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IC0xID8gLTEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZkejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGl6O1xuICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52aXo7XG4gICAgfVxuICAgIHN0YXJ0KCkge1xuICAgICAgICBpZiAodGhpcy5fc3RhcnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25MaXN0ZW5lcik7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5VXBMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHVwZGF0ZShkdCkge1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlKGR0KTtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlKGR0KTtcbiAgICB9XG4gICAgb25LZXlQcmVzcyhjb2RlLCBjYikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgKF9hID0gKF9iID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdClbY29kZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYltjb2RlXSA9IFtdKTtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXS5wdXNoKGNiKTtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmVLZXlQcmVzcyhjb2RlLCBjYikge1xuICAgICAgICBpZiAoIXRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0gPSB0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdLmZpbHRlcihsaXN0ZW5lciA9PiBsaXN0ZW5lciAhPT0gY2IpO1xuICAgIH1cbn1cbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gSW5wdXRNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1peGluID0gZXhwb3J0cy5NSVhJTl9SRVFVSVJFX1NZTUJPTCA9IGV4cG9ydHMuTUlYSU5fTkFNRV9TWU1CT0wgPSB2b2lkIDA7XG5leHBvcnRzLk1JWElOX05BTUVfU1lNQk9MID0gU3ltYm9sLmZvcignJG1peGluTmFtZScpO1xuZXhwb3J0cy5NSVhJTl9SRVFVSVJFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJyRtaXhpblJlcXVpcmUnKTtcbmZ1bmN0aW9uIG1peGluKG1peEluLCBydWxlcyA9IG51bGwpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gZGVjb3JhdG9yKEJhc2UpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIDtcbiAgICAgICAgKG1peEluW2V4cG9ydHMuTUlYSU5fUkVRVUlSRV9TWU1CT0xdIHx8IFtdKS5mb3JFYWNoKChyZXF1aXJlZE1peGluTmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCEoQmFzZS5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuaW5jbHVkZXMocmVxdWlyZWRNaXhpbk5hbWUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBNaXhpbiAke21peEluW2V4cG9ydHMuTUlYSU5fTkFNRV9TWU1CT0xdfSByZXF1aXJlcyAke3JlcXVpcmVkTWl4aW5OYW1lfSwgYnV0IGl0IGhhc24ndCBhcHBsaWVkIHRvICR7QmFzZS5uYW1lfSB5ZXRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1peEluKS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKHJ1bGVzIHx8IHR5cGVvZiBCYXNlLnByb3RvdHlwZVtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzZS5wcm90b3R5cGUsICgocnVsZXMgfHwge30pW25hbWVdIHx8IG5hbWUpLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG1peEluLCBuYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAoX2EgPSAoX2IgPSBCYXNlLnByb3RvdHlwZSkuY29tcG9uZW50TGlzdCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iLmNvbXBvbmVudExpc3QgPSBbXSk7XG4gICAgICAgIEJhc2UucHJvdG90eXBlLmNvbXBvbmVudExpc3QucHVzaChtaXhJbltleHBvcnRzLk1JWElOX05BTUVfU1lNQk9MXSk7XG4gICAgICAgIHJldHVybiBCYXNlO1xuICAgIH07XG59XG5leHBvcnRzLm1peGluID0gbWl4aW47XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2l6ZTIgPSB2b2lkIDA7XG5jbGFzcyBTaXplMiB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLncgPSAwO1xuICAgICAgICB0aGlzLmggPSAwO1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdO1xuICAgICAgICAgICAgdGhpcy5oID0gJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzFdID8gYXJnc1sxXSA6IGFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdLnc7XG4gICAgICAgICAgICB0aGlzLmggPSBhcmdzWzBdLmg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy53ICs9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLmggKz0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudyArPSBzdWJqLnc7XG4gICAgICAgIHRoaXMuaCArPSBzdWJqLmg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBtdWwoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKj0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCAqPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICo9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICo9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZXhwb3J0cy5TaXplMiA9IFNpemUyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG5jbGFzcyBWZWN0b3IyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMueCA9IDA7XG4gICAgICAgIHRoaXMueSA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLnkgPSBhcmdzWzFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0gYXJnc1swXS54O1xuICAgICAgICAgICAgdGhpcy55ID0gYXJnc1swXS55O1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMueCArPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy55ICs9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnggKz0gc3Viai54O1xuICAgICAgICB0aGlzLnkgKz0gc3Viai55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgc3ViKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy54IC09IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLnkgLT0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMueCAtPSBzdWJqLng7XG4gICAgICAgIHRoaXMueSAtPSBzdWJqLnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBtdWwoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gc3ViajtcbiAgICAgICAgICAgIHRoaXMueSAqPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy54ICo9IHN1YmoueDtcbiAgICAgICAgdGhpcy55ICo9IHN1YmoueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG1vdmVUbyh0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgVmVjdG9yMi5tb3ZlVG8odGhpcywgdGFyZ2V0LCBzdGVwKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGRpc3RhbmNlVG8odGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIHRhcmdldCk7XG4gICAgfVxuICAgIHN0YXRpYyB1cCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIC0xKTtcbiAgICB9XG4gICAgc3RhdGljIGRvd24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAxKTtcbiAgICB9XG4gICAgc3RhdGljIGxlZnQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigtMSwgMCk7XG4gICAgfVxuICAgIHN0YXRpYyByaWdodCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDEsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgemVybygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKDAsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgbW92ZVRvKHN1YmplY3QsIHRhcmdldCwgc3RlcCkge1xuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBWZWN0b3IyLm5vcm1hbGl6ZSh0YXJnZXQuc3ViKHN1YmplY3QpKTtcbiAgICAgICAgc3ViamVjdC5hZGQoZGlyZWN0aW9uLm11bChzdGVwKSk7XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgIH1cbiAgICBzdGF0aWMgZGlzdGFuY2UoYSwgYikge1xuICAgICAgICByZXR1cm4gVmVjdG9yMi5sZW4oYi5zdWIoYSkpO1xuICAgIH1cbiAgICBzdGF0aWMgbGVuKGEpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChhLnggKiogMiArIGEueSAqKiAyKTtcbiAgICB9XG4gICAgc3RhdGljIG5vcm1hbGl6ZShhKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IFZlY3RvcjIubGVuKGEpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoYS54IC8gbGVuZ3RoLCBhLnkgLyBsZW5ndGgpO1xuICAgIH1cbn1cbmV4cG9ydHMuVmVjdG9yMiA9IFZlY3RvcjI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMucmVjdGFuZ2xlID0gdm9pZCAwO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IE1peGVyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvTWl4ZXJcIik7XG5leHBvcnRzLnJlY3RhbmdsZSA9IHtcbiAgICBbTWl4ZXJfMS5NSVhJTl9OQU1FX1NZTUJPTF06ICdyZWN0YW5nbGUnLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHNpemU6IG5ldyBTaXplMl8xLlNpemUyKDEwLCAxMCksXG4gICAgZHJhdyhjdHgsIGxvY2F0aW9uKSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgICAgICBjdHguZmlsbFJlY3QobG9jYXRpb24ueCwgbG9jYXRpb24ueSwgdGhpcy5zaXplLncsIHRoaXMuc2l6ZS5oKTtcbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IFNuYWtlXzEgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvU25ha2VcIik7XG5jb25zdCBBU2NlbmVfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BU2NlbmVcIik7XG5jbGFzcyBEZWZhdWx0U2NlbmUgZXh0ZW5kcyBBU2NlbmVfMS5BU2NlbmUge1xuICAgIGluaXQoZW5naW5lLCBjYW52YXMpIHtcbiAgICAgICAgLy8gdGhpcy5hZGQoJ2dhbWVDb250cm9sbGVyJywgbmV3IEdhbWVDb250cm9sbGVyKCkpXG4gICAgICAgIC8vIHRoaXMuYWRkKCdwbGF5ZXInLCBuZXcgUGxheWVyU3BhY2VTaGlwKCkpXG4gICAgICAgIHRoaXMuYWRkKCdzbmFrZScsIG5ldyBTbmFrZV8xLlNuYWtlKCkpO1xuICAgICAgICBzdXBlci5pbml0KGVuZ2luZSwgY2FudmFzKTtcbiAgICB9XG59XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IERlZmF1bHRTY2VuZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IERlZmF1bHRTY2VuZV8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0RlZmF1bHRTY2VuZVwiKTtcbmNvbnN0IEVuZ2luZV8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvRW5naW5lXCIpO1xuY29uc3QgSW5wdXRNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9pbmZyYXN0cnVjdHVyZS9JbnB1dE1hbmFnZXJcIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgZGVmYXVsdFNjZW5lID0gbmV3IERlZmF1bHRTY2VuZV8xLkRlZmF1bHRTY2VuZSgpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBlbmdpbmUuc3RhcnQoY2FudmFzLCBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSwgaW5wdXRNYW5hZ2VyLCBkZWZhdWx0U2NlbmUpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=