/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/sprite.ts":
/*!**********************************!*\
  !*** ./src/components/sprite.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sprite = void 0;
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const ImageResource_1 = __webpack_require__(/*! ../infrastructure/ImageResource */ "./src/infrastructure/ImageResource.ts");
class SpriteComposition {
    constructor(target, filePath) {
        this.target = target;
        this.filePath = filePath;
        this.anchor = Vector2_1.Vector2.zero();
        this.size = new Size2_1.Size2(0, 0);
        if ('string' !== typeof filePath || filePath.length < 0) {
            throw new Error(`No sprite file path!`);
        }
        this.target['resourceList'].push(new ImageResource_1.ImageResource(filePath, filePath));
    }
    getLocalCenter() {
        return new Vector2_1.Vector2(this.size.w / 2, this.size.h / 2);
    }
    setSizeFromImage() {
        this.makeSureImage();
        this.size = new Size2_1.Size2(this.image.width, this.image.height);
    }
    setAnchorToCenter() {
        this.anchor = this.getLocalCenter();
    }
    render(ctx, dt, position, angle) {
        this.makeSureImage();
        if ('number' === typeof angle) {
            ctx.translate(position.x + this.anchor.x, position.y + this.anchor.y);
            ctx.rotate(angle);
            ctx.drawImage(this.image, -this.anchor.x, -this.anchor.y);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return;
        }
        ctx.drawImage(this.image, position.x + this.anchor.x, position.y + this.anchor.y);
    }
    makeSureImage() {
        var _a;
        if (!this.image) {
            this.image = (_a = this.target['resourceList'].find(r => r.name === this.filePath)) === null || _a === void 0 ? void 0 : _a.value;
            if (!this.image) {
                throw new Error(`Cannot render sprite for ${this.target.constructor.name}, image ${this.filePath} is not loaded!`);
            }
        }
    }
}
const COMPONEMT_NAME = 'sprite';
exports.sprite = {
    [addComponent_1.COMPONENT_NAME_SYMBOL]: COMPONEMT_NAME,
    [addComponent_1.COMPONENT_CONSTRUCTOR]: function (options) {
        this.sprite = new SpriteComposition(this, options === null || options === void 0 ? void 0 : options.filePath);
    }
};


/***/ }),

/***/ "./src/entities/Player.ts":
/*!********************************!*\
  !*** ./src/entities/Player.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const sprite_1 = __webpack_require__(/*! ../components/sprite */ "./src/components/sprite.ts");
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
let Player = class Player extends AEntity_1.AEntity {
    init(scene) {
        super.init(scene);
        this.position = new Vector2_1.Vector2(scene.frameSize.w, scene.frameSize.h).mul(0.5);
        this.sprite.setSizeFromImage();
        this.sprite.setAnchorToCenter();
    }
    render(canvas, ctx, dt, delta, fps) {
        this.sprite.render(ctx, dt, this.position.clone());
    }
};
Player = __decorate([
    (0, addComponent_1.addComponent)(sprite_1.sprite, { filePath: 'assets/chel.png' })
], Player);
exports.Player = Player;


/***/ }),

/***/ "./src/infrastructure/AEntity.ts":
/*!***************************************!*\
  !*** ./src/infrastructure/AEntity.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AEntity = void 0;
const addComponent_1 = __webpack_require__(/*! ./addComponent */ "./src/infrastructure/addComponent.ts");
class AEntity {
    constructor(name = 'unnamed' + crypto.randomUUID()) {
        this.name = name;
        this.tagList = [];
        this.resourceList = [];
        // run mixed components constructors
        ;
        (this.constructor.prototype.componentList || []).forEach((componentName) => {
            var _a, _b, _c, _d;
            const componentConstructor = (_b = (_a = this.constructor.prototype) === null || _a === void 0 ? void 0 : _a[addComponent_1.COMPONENT_CONSTRUCTOR_DICT]) === null || _b === void 0 ? void 0 : _b[componentName];
            if ('function' === typeof componentConstructor) {
                const options = (_d = (_c = this.constructor.prototype) === null || _c === void 0 ? void 0 : _c[addComponent_1.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT]) === null || _d === void 0 ? void 0 : _d[componentName];
                componentConstructor.call(this, options || {});
                if (void 0 !== options) {
                    delete this.constructor.prototype[addComponent_1.COMPONENT_CONSTRUCTOR_DICT][componentName];
                }
            }
        });
    }
    load(scene) {
        return Promise.resolve(Promise.all(this.resourceList.map(r => r.load(scene)))).then();
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

/***/ "./src/infrastructure/AResource.ts":
/*!*****************************************!*\
  !*** ./src/infrastructure/AResource.ts ***!
  \*****************************************/
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
exports.AResource = void 0;
class AResource {
    get name() {
        return this._name;
    }
    get value() {
        return this._value;
    }
    constructor(name) {
        this._name = name;
    }
    load(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('Must be implemented!');
        });
    }
}
exports.AResource = AResource;


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
        return Promise.resolve(Promise.all([
            ...this.entityList.map(entity => entity.load(this)),
            ...this.entityList.map(entity => entity.init(this))
        ])).then();
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

/***/ "./src/infrastructure/ImageResource.ts":
/*!*********************************************!*\
  !*** ./src/infrastructure/ImageResource.ts ***!
  \*********************************************/
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
exports.ImageResource = void 0;
const AResource_1 = __webpack_require__(/*! ./AResource */ "./src/infrastructure/AResource.ts");
class ImageResource extends AResource_1.AResource {
    constructor(name, filePath) {
        super(name);
        this.filePath = filePath;
    }
    load(scene) {
        return __awaiter(this, void 0, void 0, function* () {
            const loaded = scene.imageLoader.get(this.name);
            if (!loaded) {
                yield scene.imageLoader.load(this.name, this.filePath);
            }
            this._value = scene.imageLoader.get(this.name);
        });
    }
}
exports.ImageResource = ImageResource;


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

/***/ "./src/infrastructure/addComponent.ts":
/*!********************************************!*\
  !*** ./src/infrastructure/addComponent.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addComponent = exports.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT = exports.COMPONENT_CONSTRUCTOR_DICT = exports.COMPONENT_CONSTRUCTOR = exports.COMPONENT_REQUIRE_SYMBOL = exports.COMPONENT_NAME_SYMBOL = void 0;
const AEntity_1 = __webpack_require__(/*! ./AEntity */ "./src/infrastructure/AEntity.ts");
// TODO I better use Reflector instead of meta symbols
exports.COMPONENT_NAME_SYMBOL = Symbol.for('$componentName');
exports.COMPONENT_REQUIRE_SYMBOL = Symbol.for('$componentRequire');
exports.COMPONENT_CONSTRUCTOR = Symbol.for('$componentConstructor');
exports.COMPONENT_CONSTRUCTOR_DICT = Symbol.for('$componentConstructorDict');
exports.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT = Symbol.for('$componentConstructorDictLastOptionsDict');
function addComponent(component, options) {
    return function decorator(Base) {
        var _a, _b, _c, _d;
        var _e, _f, _g, _h, _j;
        // AEntity is the only thing a component can be applied to
        if (Base.prototype instanceof AEntity_1.AEntity === false) {
            throw new Error(`Componenr ${component[exports.COMPONENT_NAME_SYMBOL]} cannot be applied to non-AEntity-derived constructor. Rejected for ${Base.name}`);
        }
        ;
        (component[exports.COMPONENT_REQUIRE_SYMBOL] || []).forEach((requiredComponentName) => {
            if (!(Base.prototype.componentList || []).includes(requiredComponentName)) {
                throw new Error(`Component ${component[exports.COMPONENT_NAME_SYMBOL]} requires ${requiredComponentName}, but it hasn't applied to ${Base.name} yet`);
            }
        });
        // 'rules' is a special general option to resolve naming conflits
        const rules = options === null || options === void 0 ? void 0 : options.rules;
        // appliable for functions only
        Object.getOwnPropertyNames(component).forEach(name => {
            if ('function' !== typeof component[name]) {
                return;
            }
            // ignore mixin constructor if met
            if (exports.COMPONENT_CONSTRUCTOR === name) {
                return;
            }
            // user rules to resolve conflicts
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Object.defineProperty(Base.prototype, ((rules || {})[name] || name), Object.getOwnPropertyDescriptor(component, name));
            }
        });
        (_a = (_e = Base.prototype).componentList) !== null && _a !== void 0 ? _a : (_e.componentList = []); // TODO rename componentList to a symbol?
        Base.prototype.componentList.push(component[exports.COMPONENT_NAME_SYMBOL]);
        if ('function' === typeof component[exports.COMPONENT_CONSTRUCTOR]) {
            (_b = (_f = Base.prototype)[exports.COMPONENT_CONSTRUCTOR_DICT]) !== null && _b !== void 0 ? _b : (_f[exports.COMPONENT_CONSTRUCTOR_DICT] = {});
            (_c = (_g = Base.prototype[exports.COMPONENT_CONSTRUCTOR_DICT])[_h = component[exports.COMPONENT_NAME_SYMBOL]]) !== null && _c !== void 0 ? _c : (_g[_h] = component[exports.COMPONENT_CONSTRUCTOR]);
            (_d = (_j = Base.prototype)[exports.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT]) !== null && _d !== void 0 ? _d : (_j[exports.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT] = {});
            // an aEntity constructor cleans it up after a component consructor call
            Base.prototype[exports.COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT][component[exports.COMPONENT_NAME_SYMBOL]] = options || {};
        }
        return Base;
    };
}
exports.addComponent = addComponent;


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
const Player_1 = __webpack_require__(/*! ../entities/Player */ "./src/entities/Player.ts");
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.add('player', new Player_1.Player());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7Ozs7Ozs7Ozs7O0FDN0tQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDckNBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDNUVGO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG9CQUFvQixHQUFHLCtDQUErQyxHQUFHLGtDQUFrQyxHQUFHLDZCQUE2QixHQUFHLGdDQUFnQyxHQUFHLDZCQUE2QjtBQUM5TSxrQkFBa0IsbUJBQU8sQ0FBQyxrREFBVztBQUNyQztBQUNBLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCLGtDQUFrQztBQUNsQywrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLDBDQUEwQyxxRUFBcUUsVUFBVTtBQUNsSztBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QywwQ0FBMEMsV0FBVyxzQkFBc0IsNkJBQTZCLFdBQVc7QUFDaEs7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7QUFDQSxTQUFTO0FBQ1QsNkdBQTZHO0FBQzdHO0FBQ0E7QUFDQSwwSkFBMEo7QUFDMUo7QUFDQSxvTEFBb0w7QUFDcEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COzs7Ozs7Ozs7OztBQ3BEUDtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCLGlCQUFpQixtQkFBTyxDQUFDLG9EQUFvQjtBQUM3QyxpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBMEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7OztVQ3pCcEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCx1QkFBdUIsbUJBQU8sQ0FBQywyREFBdUI7QUFDdEQsaUJBQWlCLG1CQUFPLENBQUMsK0RBQXlCO0FBQ2xELHVCQUF1QixtQkFBTyxDQUFDLDJFQUErQjtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zcHJpdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL1BsYXllci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQVJlc291cmNlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9BU2NlbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0NvbGxpZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9FbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0ltYWdlTG9hZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9JbWFnZVJlc291cmNlLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9JbnB1dE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL1NpemUyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9hZGRDb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9EZWZhdWx0U2NlbmUudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnNwcml0ZSA9IHZvaWQgMDtcbmNvbnN0IGFkZENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL2FkZENvbXBvbmVudFwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IEltYWdlUmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9JbWFnZVJlc291cmNlXCIpO1xuY2xhc3MgU3ByaXRlQ29tcG9zaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgZmlsZVBhdGgpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcbiAgICAgICAgdGhpcy5hbmNob3IgPSBWZWN0b3IyXzEuVmVjdG9yMi56ZXJvKCk7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgICAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBmaWxlUGF0aCB8fCBmaWxlUGF0aC5sZW5ndGggPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHNwcml0ZSBmaWxlIHBhdGghYCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy50YXJnZXRbJ3Jlc291cmNlTGlzdCddLnB1c2gobmV3IEltYWdlUmVzb3VyY2VfMS5JbWFnZVJlc291cmNlKGZpbGVQYXRoLCBmaWxlUGF0aCkpO1xuICAgIH1cbiAgICBnZXRMb2NhbENlbnRlcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyXzEuVmVjdG9yMih0aGlzLnNpemUudyAvIDIsIHRoaXMuc2l6ZS5oIC8gMik7XG4gICAgfVxuICAgIHNldFNpemVGcm9tSW1hZ2UoKSB7XG4gICAgICAgIHRoaXMubWFrZVN1cmVJbWFnZSgpO1xuICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMih0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XG4gICAgfVxuICAgIHNldEFuY2hvclRvQ2VudGVyKCkge1xuICAgICAgICB0aGlzLmFuY2hvciA9IHRoaXMuZ2V0TG9jYWxDZW50ZXIoKTtcbiAgICB9XG4gICAgcmVuZGVyKGN0eCwgZHQsIHBvc2l0aW9uLCBhbmdsZSkge1xuICAgICAgICB0aGlzLm1ha2VTdXJlSW1hZ2UoKTtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2YgYW5nbGUpIHtcbiAgICAgICAgICAgIGN0eC50cmFuc2xhdGUocG9zaXRpb24ueCArIHRoaXMuYW5jaG9yLngsIHBvc2l0aW9uLnkgKyB0aGlzLmFuY2hvci55KTtcbiAgICAgICAgICAgIGN0eC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAtdGhpcy5hbmNob3IueCwgLXRoaXMuYW5jaG9yLnkpO1xuICAgICAgICAgICAgY3R4LnNldFRyYW5zZm9ybSgxLCAwLCAwLCAxLCAwLCAwKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaW1hZ2UsIHBvc2l0aW9uLnggKyB0aGlzLmFuY2hvci54LCBwb3NpdGlvbi55ICsgdGhpcy5hbmNob3IueSk7XG4gICAgfVxuICAgIG1ha2VTdXJlSW1hZ2UoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XG4gICAgICAgICAgICB0aGlzLmltYWdlID0gKF9hID0gdGhpcy50YXJnZXRbJ3Jlc291cmNlTGlzdCddLmZpbmQociA9PiByLm5hbWUgPT09IHRoaXMuZmlsZVBhdGgpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EudmFsdWU7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZW5kZXIgc3ByaXRlIGZvciAke3RoaXMudGFyZ2V0LmNvbnN0cnVjdG9yLm5hbWV9LCBpbWFnZSAke3RoaXMuZmlsZVBhdGh9IGlzIG5vdCBsb2FkZWQhYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5jb25zdCBDT01QT05FTVRfTkFNRSA9ICdzcHJpdGUnO1xuZXhwb3J0cy5zcHJpdGUgPSB7XG4gICAgW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF06IENPTVBPTkVNVF9OQU1FLFxuICAgIFthZGRDb21wb25lbnRfMS5DT01QT05FTlRfQ09OU1RSVUNUT1JdOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG5ldyBTcHJpdGVDb21wb3NpdGlvbih0aGlzLCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmlsZVBhdGgpO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyID0gdm9pZCAwO1xuY29uc3Qgc3ByaXRlXzEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zcHJpdGVcIik7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgYWRkQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvYWRkQ29tcG9uZW50XCIpO1xubGV0IFBsYXllciA9IGNsYXNzIFBsYXllciBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBpbml0KHNjZW5lKSB7XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHNjZW5lLmZyYW1lU2l6ZS53LCBzY2VuZS5mcmFtZVNpemUuaCkubXVsKDAuNSk7XG4gICAgICAgIHRoaXMuc3ByaXRlLnNldFNpemVGcm9tSW1hZ2UoKTtcbiAgICAgICAgdGhpcy5zcHJpdGUuc2V0QW5jaG9yVG9DZW50ZXIoKTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICB0aGlzLnNwcml0ZS5yZW5kZXIoY3R4LCBkdCwgdGhpcy5wb3NpdGlvbi5jbG9uZSgpKTtcbiAgICB9XG59O1xuUGxheWVyID0gX19kZWNvcmF0ZShbXG4gICAgKDAsIGFkZENvbXBvbmVudF8xLmFkZENvbXBvbmVudCkoc3ByaXRlXzEuc3ByaXRlLCB7IGZpbGVQYXRoOiAnYXNzZXRzL2NoZWwucG5nJyB9KVxuXSwgUGxheWVyKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFFbnRpdHkgPSB2b2lkIDA7XG5jb25zdCBhZGRDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2FkZENvbXBvbmVudFwiKTtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSAndW5uYW1lZCcgKyBjcnlwdG8ucmFuZG9tVVVJRCgpKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnJlc291cmNlTGlzdCA9IFtdO1xuICAgICAgICAvLyBydW4gbWl4ZWQgY29tcG9uZW50cyBjb25zdHJ1Y3RvcnNcbiAgICAgICAgO1xuICAgICAgICAodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuZm9yRWFjaCgoY29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q29uc3RydWN0b3IgPSAoX2IgPSAoX2EgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnRDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSAoX2QgPSAoX2MgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVF0pID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZFtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRDb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsb2FkKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoUHJvbWlzZS5hbGwodGhpcy5yZXNvdXJjZUxpc3QubWFwKHIgPT4gci5sb2FkKHNjZW5lKSkpKS50aGVuKCk7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5uYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQVJlc291cmNlID0gdm9pZCAwO1xuY2xhc3MgQVJlc291cmNlIHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBsb2FkKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgYmUgaW1wbGVtZW50ZWQhJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQVJlc291cmNlID0gQVJlc291cmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi9Db2xsaWRlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi9TaXplMlwiKTtcbmNvbnN0IEltYWdlTG9hZGVyXzEgPSByZXF1aXJlKFwiLi9JbWFnZUxvYWRlclwiKTtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgICAgICB0aGlzLl90YWdEaWN0ID0ge307IC8vIHRhZyAtPiBuYW1lTGlzdFxuICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwID0ge307XG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIgPSBuZXcgSW1hZ2VMb2FkZXJfMS5JbWFnZUxvYWRlcigpOyAvLyB0b2RvIGFzc2V0IG9yIHJlc291cmNlIGxvYWRlclxuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgZ2V0IGNvbGxpc2lvbkJvZHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9jb2xsaXNpb25Cb2R5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShQcm9taXNlLmFsbChbXG4gICAgICAgICAgICAuLi50aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkubG9hZCh0aGlzKSksXG4gICAgICAgICAgICAuLi50aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkuaW5pdCh0aGlzKSlcbiAgICAgICAgXSkpLnRoZW4oKTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICAvLyBDb2xsaXNpb25zXG4gICAgICAgIGNvbnN0IHsgY291cGxlTGlzdCwgdGFnTWFwIH0gPSBuZXcgQ29sbGlkZXJfMS5Db2xsaWRlcih0aGlzLmNvbGxpc2lvbkJvZHlMaXN0KVxuICAgICAgICAgICAgLnByb2Nlc3MoKTtcbiAgICAgICAgY291cGxlTGlzdC5mb3JFYWNoKChbYSwgYl0pID0+IHtcbiAgICAgICAgICAgIGEuY2FsbENvbGxpc2lvbihiKTtcbiAgICAgICAgICAgIGIuY2FsbENvbGxpc2lvbihhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFsuLi50YWdNYXAua2V5cygpXS5mb3JFYWNoKGIgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb25lVGFnQnJhbmNoID0gdGFnTWFwLmdldChiKTtcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKG9uZVRhZ0JyYW5jaCkuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgIGIuY2FsbFRhZ0NvbGxpc2lvbih0YWcsIG9uZVRhZ0JyYW5jaFt0YWddKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gVXBkYXRlXG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZW50aXR5TGlzdCkge1xuICAgICAgICAgICAgZW50aXR5LnVwZGF0ZShkdCwgaW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgLy8gRGVmYXVsdCBjbGVhciBzY2VuZSBiZWZvcmUgYWxsIHRoZSBlbnRpdGllcyByZW5kZXJlZFxuICAgICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZW50aXR5TGlzdCkge1xuICAgICAgICAgICAgZW50aXR5LnJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZCguLi5hcmdzKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgbGV0IG5hbWU7XG4gICAgICAgIGxldCBlbnRpdHk7XG4gICAgICAgIGlmIChhcmdzLmxlbmd0aCA+IDEgJiYgJ3N0cmluZycgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICBuYW1lID0gYXJnc1swXTtcbiAgICAgICAgICAgIGVudGl0eSA9IGFyZ3NbMV07XG4gICAgICAgICAgICBlbnRpdHkubmFtZSA9IG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBlbnRpdHkgPSBhcmdzWzBdO1xuICAgICAgICAgICAgbmFtZSA9IGVudGl0eS5uYW1lO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICAgICAgLy8gVGFnc1xuICAgICAgICBlbnRpdHkudGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICB2YXIgX2I7XG4gICAgICAgICAgICAoX2EgPSAoX2IgPSB0aGlzLl90YWdEaWN0KVt0YWddKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2JbdGFnXSA9IFtdKTtcbiAgICAgICAgICAgIHRoaXMuX3RhZ0RpY3RbdGFnXS5wdXNoKG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ29sbGlzaW9uc1xuICAgICAgICBpZiAoKF9hID0gZW50aXR5ID09PSBudWxsIHx8IGVudGl0eSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50aXR5LmNvbXBvbmVudExpc3QpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5pbmNsdWRlcygnYm94Q29sbGlkZXInKSkge1xuICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uQm9keU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZW1vdmUobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2VudGl0eU1hcFtuYW1lXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fZW50aXR5TWFwW25hbWVdLnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGFnRGljdFt0YWddID0gdGhpcy5fdGFnRGljdFt0YWddLmZpbHRlcihlbnRpdHlOYW1lID0+IGVudGl0eU5hbWUgIT09IG5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2NvbGxpc2lvbkJvZHlNYXBbbmFtZV07XG4gICAgfVxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbnRpdHlNYXBbbmFtZV07XG4gICAgfVxuICAgIGZpbmRCeVRhZyh0YWcpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLl90YWdEaWN0W3RhZ10gfHwgW10pLm1hcChuYW1lID0+IHRoaXMuZ2V0KG5hbWUpKTtcbiAgICB9XG59XG5leHBvcnRzLkFTY2VuZSA9IEFTY2VuZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Db2xsaWRlciA9IHZvaWQgMDtcbmNsYXNzIENvbGxpZGVyIHtcbiAgICBjb25zdHJ1Y3RvcihfYm9keUxpc3QpIHtcbiAgICAgICAgdGhpcy5fYm9keUxpc3QgPSBfYm9keUxpc3Q7XG4gICAgfVxuICAgIHByb2Nlc3MoKSB7XG4gICAgICAgIGNvbnN0IG9wZW5GaXJzdE9yZGVyID0gWydvcGVuJywgJ2Nsb3NlJ107IC8vIGlmIHR3byBmaWd1cmVzIHN0YXkgb24gb25lIGxpbmUgdGhleSBtdXN0IGNyb3NzXG4gICAgICAgIGNvbnN0IHhSZWZMaXN0ID0gdGhpcy5fYm9keUxpc3QucmVkdWNlKChhY2MsIGIpID0+IHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueCwgcG9zOiAnb3BlbicsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueCArIGIuc2l6ZS53LCBwb3M6ICdjbG9zZScsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS52IC0gYi52IHx8IChvcGVuRmlyc3RPcmRlci5pbmRleE9mKGEucG9zKSAtIG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYi5wb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHhDYW5kaWRhdGVQYXRoTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBsZXQgY3Vyck9wZW5NYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHhSZWZMaXN0LmZvckVhY2goY3IgPT4ge1xuICAgICAgICAgICAgaWYgKGNyLnBvcyA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICAgICAgLy8gcGFpciB3aXRoIGFsbCBvcGVuXG4gICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgIFsuLi5jdXJyT3Blbk1hcC52YWx1ZXMoKV0uZm9yRWFjaChvcGVuQ3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIGJvdGgtZGlyZWN0aW9uIHBhdGhzXG4gICAgICAgICAgICAgICAgICAgIHhDYW5kaWRhdGVQYXRoTWFwLnNldChjci5yZWYsICh4Q2FuZGlkYXRlUGF0aE1hcC5nZXQoY3IucmVmKSB8fCBuZXcgU2V0KCkpLmFkZChvcGVuQ3IucmVmKSk7XG4gICAgICAgICAgICAgICAgICAgIHhDYW5kaWRhdGVQYXRoTWFwLnNldChvcGVuQ3IucmVmLCAoeENhbmRpZGF0ZVBhdGhNYXAuZ2V0KG9wZW5Dci5yZWYpIHx8IG5ldyBTZXQoKSkuYWRkKGNyLnJlZikpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIHNldCBvcGVuIGl0c2VsZlxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLnNldChjci5yZWYsIGNyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNsb3NlXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuZGVsZXRlKGNyLnJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zdCB5UmVmTGlzdCA9IHRoaXMuX2JvZHlMaXN0LnJlZHVjZSgoYWNjLCBiKSA9PiB7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnksIHBvczogJ29wZW4nLCByZWY6IGIgfSk7XG4gICAgICAgICAgICBhY2MucHVzaCh7IHY6IGIuc2NydWZmLnkgKyBiLnNpemUuaCwgcG9zOiAnY2xvc2UnLCByZWY6IGIgfSk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCBbXSkuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGEudiAtIGIudiB8fCAob3BlbkZpcnN0T3JkZXIuaW5kZXhPZihhLnBvcykgLSBvcGVuRmlyc3RPcmRlci5pbmRleE9mKGIucG9zKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjdXJyT3Blbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgY29uc3QgY291cGxlTGlzdCA9IFtdO1xuICAgICAgICBjb25zdCB0YWdNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIHlSZWZMaXN0LmZvckVhY2goY3IgPT4ge1xuICAgICAgICAgICAgaWYgKGNyLnBvcyA9PT0gJ29wZW4nKSB7XG4gICAgICAgICAgICAgICAgLy8gY2hlY2sgZXhpc3RpbmcgY29sbGlzaW9ucyBieSB4IChvbmUgZGlyZWN0aW9uIGlzIGVub3VnaClcbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgWy4uLmN1cnJPcGVuTWFwLnZhbHVlcygpXS5mb3JFYWNoKG9wZW5DciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhSb290ID0geENhbmRpZGF0ZVBhdGhNYXAuZ2V0KGNyLnJlZik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh4Um9vdCAmJiB4Um9vdC5oYXMob3BlbkNyLnJlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdXBsZUxpc3QucHVzaChbY3IucmVmLCBvcGVuQ3IucmVmXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB0YWdEaWN0ID0gKHRhZ01hcC5nZXQoY3IucmVmKSB8fCB7fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcGVuQ3IucmVmLnRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoX2EgPSB0YWdEaWN0W3RhZ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICh0YWdEaWN0W3RhZ10gPSBbXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnRGljdFt0YWddLnB1c2gob3BlbkNyLnJlZik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyh0YWdEaWN0KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnTWFwLnNldChjci5yZWYsIHRhZ0RpY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9wZW4gaXRzZWxmXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuc2V0KGNyLnJlZiwgY3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5kZWxldGUoY3IucmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7IGNvdXBsZUxpc3QsIHRhZ01hcCB9O1xuICAgIH1cbn1cbmV4cG9ydHMuQ29sbGlkZXIgPSBDb2xsaWRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVuZ2luZSA9IHZvaWQgMDtcbmNsYXNzIEVuZ2luZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRlJBTUVfUkFURSA9IDYwO1xuICAgICAgICB0aGlzLmlzRGVidWdPbiA9IGZhbHNlO1xuICAgIH1cbiAgICBnZXQgY2FudmFzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FudmFzO1xuICAgIH1cbiAgICBnZXQgY3R4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY3R4O1xuICAgIH1cbiAgICBnZXQgaW5wdXQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnB1dDtcbiAgICB9XG4gICAgc3RhcnQoY2FudmFzLCBjdHgsIGlucHV0LCBzY2VuZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgICAgICAgICAgdGhpcy5fY3R4ID0gY3R4O1xuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBpbnB1dDtcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICAgICAgdGhpcy5faW5wdXQub25LZXlQcmVzcygnS2V5RycsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmlzRGVidWdPbiA9ICF0aGlzLmlzRGVidWdPbjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5faW5wdXQuc3RhcnQoKTtcbiAgICAgICAgICAgIHlpZWxkIFByb21pc2UucmVzb2x2ZShzY2VuZS5pbml0KHRoaXMsIGNhbnZhcykpO1xuICAgICAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZSA9IERhdGUubm93KCk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjaGFuZ2VTY2VuZSgpIHtcbiAgICAgICAgLy8gVE9ET1xuICAgIH1cbiAgICBfZ2FtZUxvb3AodGltZSkge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRpbWUgLSB0aGlzLl9sYXN0RnJhbWVUaW1lO1xuICAgICAgICB0aGlzLl9sYXN0RnJhbWVUaW1lID0gdGltZTtcbiAgICAgICAgY29uc3QgZnBzID0gTWF0aC5mbG9vcigxMDAwIC8gZGVsdGEpO1xuICAgICAgICBjb25zdCBkdCA9IE1hdGgubWF4KDAsIE51bWJlcihNYXRoLnJvdW5kKGRlbHRhIC8gKDEwMDAgLyB0aGlzLkZSQU1FX1JBVEUpKS50b0ZpeGVkKDIpKSk7XG4gICAgICAgIC8vIGlucHV0XG4gICAgICAgIHRoaXMuX2lucHV0LnVwZGF0ZShkdCk7XG4gICAgICAgIC8vIHVwZGF0ZVxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUudXBkYXRlKGR0LCB0aGlzLl9pbnB1dCk7XG4gICAgICAgIC8vIHJlbmRlclxuICAgICAgICB0aGlzLl9jdXJyZW50U2NlbmUucmVuZGVyKHRoaXMuX2NhbnZhcywgdGhpcy5fY3R4LCBkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIGRlYnVnXG4gICAgICAgIHRoaXMuX2RlYnVnKGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy8gbmV4dCBpdGVyYXRpb25cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgIH1cbiAgICBfZGVidWcoZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNEZWJ1Z09uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFJlY3QoMCwgMCwgMTIwLCA4NSk7XG4gICAgICAgICAgICB0aGlzLl9jdHguZm9udCA9ICcxNXB4IHNlcmlmJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDiiIIgJHtkdH1gLCAxMCwgMTUsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgzpQ6ICR7ZGVsdGF9YCwgMTAsIDMwLCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYGZwczogJHtmcHN9YCwgMTAsIDQ1LCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYG9iai5jb3VudDogJHt0aGlzLl9jdXJyZW50U2NlbmUuZW50aXR5TGlzdC5sZW5ndGh9YCwgMTAsIDYwLCAxMDApO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYGluIEgsVjogJHt0aGlzLl9pbnB1dC5ob3Jpem9udGFsLnRvRml4ZWQoMil9LCR7dGhpcy5pbnB1dC52ZXJ0aWNhbC50b0ZpeGVkKDIpfWAsIDEwLCA3NSwgMTAwKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuRW5naW5lID0gRW5naW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW1hZ2VMb2FkZXIgPSB2b2lkIDA7XG5jbGFzcyBJbWFnZUxvYWRlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX21hcCA9IG5ldyBNYXAoKTtcbiAgICB9XG4gICAgbG9hZChuYW1lLCBzcmMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgociwgaikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XG4gICAgICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSBqO1xuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcC5zZXQobmFtZSwgaW1nKTtcbiAgICAgICAgICAgICAgICAgICAgcigpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGRlbGV0ZShuYW1lKSB7XG4gICAgICAgIHRoaXMuX21hcC5kZWxldGUobmFtZSk7XG4gICAgfVxuICAgIGdldChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tYXAuZ2V0KG5hbWUpO1xuICAgIH1cbn1cbmV4cG9ydHMuSW1hZ2VMb2FkZXIgPSBJbWFnZUxvYWRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkltYWdlUmVzb3VyY2UgPSB2b2lkIDA7XG5jb25zdCBBUmVzb3VyY2VfMSA9IHJlcXVpcmUoXCIuL0FSZXNvdXJjZVwiKTtcbmNsYXNzIEltYWdlUmVzb3VyY2UgZXh0ZW5kcyBBUmVzb3VyY2VfMS5BUmVzb3VyY2Uge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGZpbGVQYXRoKSB7XG4gICAgICAgIHN1cGVyKG5hbWUpO1xuICAgICAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgfVxuICAgIGxvYWQoc2NlbmUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvYWRlZCA9IHNjZW5lLmltYWdlTG9hZGVyLmdldCh0aGlzLm5hbWUpO1xuICAgICAgICAgICAgaWYgKCFsb2FkZWQpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCBzY2VuZS5pbWFnZUxvYWRlci5sb2FkKHRoaXMubmFtZSwgdGhpcy5maWxlUGF0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl92YWx1ZSA9IHNjZW5lLmltYWdlTG9hZGVyLmdldCh0aGlzLm5hbWUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkltYWdlUmVzb3VyY2UgPSBJbWFnZVJlc291cmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLklucHV0TWFuYWdlciA9IHZvaWQgMDtcbi8vIFRPRE8gYWRkIG1vdXNlXG5jbGFzcyBJbnB1dE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVwID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICB0aGlzLmtleSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5jb2RlID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmFsdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN0cmxLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXRhS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0ID0ge307XG4gICAgICAgIHRoaXMuX2tleURvd25MaXN0ZW5lciA9IChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmtleSA9IGUua2V5O1xuICAgICAgICAgICAgdGhpcy5jb2RlID0gZS5jb2RlO1xuICAgICAgICAgICAgdGhpcy5hbHRLZXkgPSBlLmFsdEtleTtcbiAgICAgICAgICAgIHRoaXMuY3RybEtleSA9IGUuY3RybEtleTtcbiAgICAgICAgICAgIHRoaXMubWV0YUtleSA9IGUubWV0YUtleTtcbiAgICAgICAgICAgIHRoaXMuc2hpZnRLZXkgPSBlLnNoaWZ0S2V5O1xuICAgICAgICAgICAgc3dpdGNoIChlLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdTcGFjZSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BhY2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUEnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvcml6b250YWwgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWwgPCAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlTJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3duID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudmVydGljYWwgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAodGhpcy5fc3Vic2NyaXB0aW9uRGljdFtlLmNvZGVdIHx8IFtdKS5mb3JFYWNoKGNiID0+IGNiKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9rZXlVcExpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUEnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52ZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXhpc1NlbnNpdGl2aXR5ID0gMSAvIDEwO1xuICAgICAgICB0aGlzLl9heGlzVGFibGUgPSB7XG4gICAgICAgICAgICBoaWU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IC0xID8gLTEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmRlOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaXo7XG4gICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25MaXN0ZW5lcik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5VXBMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUoZHQpO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUoZHQpO1xuICAgIH1cbiAgICBvbktleVByZXNzKGNvZGUsIGNiKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICAoX2EgPSAoX2IgPSB0aGlzLl9zdWJzY3JpcHRpb25EaWN0KVtjb2RlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW2NvZGVdID0gW10pO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0W2NvZGVdLnB1c2goY2IpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZUtleVByZXNzKGNvZGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdFtjb2RlXSA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RbY29kZV0uZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBjYik7XG4gICAgfVxufVxuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSBJbnB1dE1hbmFnZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2l6ZTIgPSB2b2lkIDA7XG5jbGFzcyBTaXplMiB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLncgPSAwO1xuICAgICAgICB0aGlzLmggPSAwO1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdO1xuICAgICAgICAgICAgdGhpcy5oID0gJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzFdID8gYXJnc1sxXSA6IGFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdLnc7XG4gICAgICAgICAgICB0aGlzLmggPSBhcmdzWzBdLmg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy53ICs9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLmggKz0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudyArPSBzdWJqLnc7XG4gICAgICAgIHRoaXMuaCArPSBzdWJqLmg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBtdWwoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKj0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCAqPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICo9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICo9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuZXhwb3J0cy5TaXplMiA9IFNpemUyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG5jbGFzcyBWZWN0b3IyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMueCA9IDA7XG4gICAgICAgIHRoaXMueSA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLnkgPSBhcmdzWzFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0gYXJnc1swXS54O1xuICAgICAgICAgICAgdGhpcy55ID0gYXJnc1swXS55O1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyBzdWJqLCB0aGlzLnkgKyBzdWJqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgc3Viai54LCB0aGlzLnkgKyBzdWJqLnkpO1xuICAgIH1cbiAgICBzdWIoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gc3ViaiwgdGhpcy55IC0gc3Viaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHN1YmoueCwgdGhpcy55IC0gc3Viai55KTtcbiAgICB9XG4gICAgbXVsKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIHN1YmosIHRoaXMueSAqIHN1YmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKiBzdWJqLngsIHRoaXMueSAqIHN1YmoueSk7XG4gICAgfVxuICAgIG1vdmVUbyh0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIubW92ZVRvKHRoaXMsIHRhcmdldCwgc3RlcCk7XG4gICAgfVxuICAgIGRpc3RhbmNlVG8odGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIHRhcmdldCk7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcyk7XG4gICAgfVxuICAgIGVxdWFsKG90aGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55O1xuICAgIH1cbiAgICBzdGF0aWMgdXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XG4gICAgfVxuICAgIHN0YXRpYyBkb3duKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XG4gICAgfVxuICAgIHN0YXRpYyBsZWZ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgcmlnaHQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIHplcm8oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIG1vdmVUbyhzdWJqZWN0LCB0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gVmVjdG9yMi5ub3JtYWxpemUodGFyZ2V0LnN1YihzdWJqZWN0KSk7XG4gICAgICAgIHJldHVybiBzdWJqZWN0LmFkZChkaXJlY3Rpb24ubXVsKHN0ZXApKTtcbiAgICB9XG4gICAgc3RhdGljIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIubGVuKGIuc3ViKGEpKTtcbiAgICB9XG4gICAgc3RhdGljIGxlbihhKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoYS54ICoqIDIgKyBhLnkgKiogMik7XG4gICAgfVxuICAgIHN0YXRpYyBub3JtYWxpemUoYSkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBWZWN0b3IyLmxlbihhKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKGEueCAvIGxlbmd0aCwgYS55IC8gbGVuZ3RoKTtcbiAgICB9XG59XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENvbXBvbmVudCA9IGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0xBU1RfT1BUSU9OU19ESUNUID0gZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVCA9IGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SID0gZXhwb3J0cy5DT01QT05FTlRfUkVRVUlSRV9TWU1CT0wgPSBleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTCA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuL0FFbnRpdHlcIik7XG4vLyBUT0RPIEkgYmV0dGVyIHVzZSBSZWZsZWN0b3IgaW5zdGVhZCBvZiBtZXRhIHN5bWJvbHNcbmV4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MID0gU3ltYm9sLmZvcignJGNvbXBvbmVudE5hbWUnKTtcbmV4cG9ydHMuQ09NUE9ORU5UX1JFUVVJUkVfU1lNQk9MID0gU3ltYm9sLmZvcignJGNvbXBvbmVudFJlcXVpcmUnKTtcbmV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SID0gU3ltYm9sLmZvcignJGNvbXBvbmVudENvbnN0cnVjdG9yJyk7XG5leHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUID0gU3ltYm9sLmZvcignJGNvbXBvbmVudENvbnN0cnVjdG9yRGljdCcpO1xuZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1QgPSBTeW1ib2wuZm9yKCckY29tcG9uZW50Q29uc3RydWN0b3JEaWN0TGFzdE9wdGlvbnNEaWN0Jyk7XG5mdW5jdGlvbiBhZGRDb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlY29yYXRvcihCYXNlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgdmFyIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICAgICAgLy8gQUVudGl0eSBpcyB0aGUgb25seSB0aGluZyBhIGNvbXBvbmVudCBjYW4gYmUgYXBwbGllZCB0b1xuICAgICAgICBpZiAoQmFzZS5wcm90b3R5cGUgaW5zdGFuY2VvZiBBRW50aXR5XzEuQUVudGl0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW5yICR7Y29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXX0gY2Fubm90IGJlIGFwcGxpZWQgdG8gbm9uLUFFbnRpdHktZGVyaXZlZCBjb25zdHJ1Y3Rvci4gUmVqZWN0ZWQgZm9yICR7QmFzZS5uYW1lfWApO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgKGNvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9SRVFVSVJFX1NZTUJPTF0gfHwgW10pLmZvckVhY2goKHJlcXVpcmVkQ29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCEoQmFzZS5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuaW5jbHVkZXMocmVxdWlyZWRDb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7Y29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXX0gcmVxdWlyZXMgJHtyZXF1aXJlZENvbXBvbmVudE5hbWV9LCBidXQgaXQgaGFzbid0IGFwcGxpZWQgdG8gJHtCYXNlLm5hbWV9IHlldGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gJ3J1bGVzJyBpcyBhIHNwZWNpYWwgZ2VuZXJhbCBvcHRpb24gdG8gcmVzb2x2ZSBuYW1pbmcgY29uZmxpdHNcbiAgICAgICAgY29uc3QgcnVsZXMgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMucnVsZXM7XG4gICAgICAgIC8vIGFwcGxpYWJsZSBmb3IgZnVuY3Rpb25zIG9ubHlcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY29tcG9uZW50KS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjb21wb25lbnRbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZ25vcmUgbWl4aW4gY29uc3RydWN0b3IgaWYgbWV0XG4gICAgICAgICAgICBpZiAoZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1IgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1c2VyIHJ1bGVzIHRvIHJlc29sdmUgY29uZmxpY3RzXG4gICAgICAgICAgICBpZiAocnVsZXMgfHwgdHlwZW9mIEJhc2UucHJvdG90eXBlW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXNlLnByb3RvdHlwZSwgKChydWxlcyB8fCB7fSlbbmFtZV0gfHwgbmFtZSksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9uZW50LCBuYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAoX2EgPSAoX2UgPSBCYXNlLnByb3RvdHlwZSkuY29tcG9uZW50TGlzdCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9lLmNvbXBvbmVudExpc3QgPSBbXSk7IC8vIFRPRE8gcmVuYW1lIGNvbXBvbmVudExpc3QgdG8gYSBzeW1ib2w/XG4gICAgICAgIEJhc2UucHJvdG90eXBlLmNvbXBvbmVudExpc3QucHVzaChjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfTkFNRV9TWU1CT0xdKTtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JdKSB7XG4gICAgICAgICAgICAoX2IgPSAoX2YgPSBCYXNlLnByb3RvdHlwZSlbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfZltleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSA9IHt9KTtcbiAgICAgICAgICAgIChfYyA9IChfZyA9IEJhc2UucHJvdG90eXBlW2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0RJQ1RdKVtfaCA9IGNvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF1dKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoX2dbX2hdID0gY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SXSk7XG4gICAgICAgICAgICAoX2QgPSAoX2ogPSBCYXNlLnByb3RvdHlwZSlbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1RdKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiAoX2pbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1RdID0ge30pO1xuICAgICAgICAgICAgLy8gYW4gYUVudGl0eSBjb25zdHJ1Y3RvciBjbGVhbnMgaXQgdXAgYWZ0ZXIgYSBjb21wb25lbnQgY29uc3J1Y3RvciBjYWxsXG4gICAgICAgICAgICBCYXNlLnByb3RvdHlwZVtleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVF1bY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXV0gPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBCYXNlO1xuICAgIH07XG59XG5leHBvcnRzLmFkZENvbXBvbmVudCA9IGFkZENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IFBsYXllcl8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllclwiKTtcbmNvbnN0IEFTY2VuZV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FTY2VuZVwiKTtcbmNsYXNzIERlZmF1bHRTY2VuZSBleHRlbmRzIEFTY2VuZV8xLkFTY2VuZSB7XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICBjb25zdCBfc3VwZXIgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgICAgIGluaXQ6IHsgZ2V0OiAoKSA9PiBzdXBlci5pbml0IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmFkZCgncGxheWVyJywgbmV3IFBsYXllcl8xLlBsYXllcigpKTtcbiAgICAgICAgICAgIF9zdXBlci5pbml0LmNhbGwodGhpcywgZW5naW5lLCBjYW52YXMpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IERlZmF1bHRTY2VuZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IERlZmF1bHRTY2VuZV8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0RlZmF1bHRTY2VuZVwiKTtcbmNvbnN0IEVuZ2luZV8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvRW5naW5lXCIpO1xuY29uc3QgSW5wdXRNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9pbmZyYXN0cnVjdHVyZS9JbnB1dE1hbmFnZXJcIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgZGVmYXVsdFNjZW5lID0gbmV3IERlZmF1bHRTY2VuZV8xLkRlZmF1bHRTY2VuZSgpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBQcm9taXNlLnJlc29sdmUoZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgZGVmYXVsdFNjZW5lKSkuY2F0Y2goZSA9PiAoY29uc29sZS5lcnJvcihlKSkpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=