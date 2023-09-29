/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
        return Promise.resolve(Promise.all(this.entityList.map(entity => entity.load(this)))
            .then(() => Promise.all(this.entityList.map(entity => entity.init(this))))).then();
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
            this._input.onKeyDown('KeyG', () => {
                this.isDebugOn = !this.isDebugOn;
            });
            this._input.start();
            yield Promise.resolve(scene.init(this, canvas));
            this._lastFrameTime = Date.now();
            requestAnimationFrame(time => this._gameLoop(time));
        });
    }
    changeScene(scene) {
        this._currentScene = scene;
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
        this._subscriptionDictDown = {};
        this._subscriptionDictUp = {};
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
            (this._subscriptionDictDown[e.code] || []).forEach(cb => cb());
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
            ;
            (this._subscriptionDictUp[e.code] || []).forEach(cb => cb());
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
    onKeyDown(code, cb) {
        var _a;
        var _b;
        (_a = (_b = this._subscriptionDictDown)[code]) !== null && _a !== void 0 ? _a : (_b[code] = []);
        this._subscriptionDictDown[code].push(cb);
    }
    unsubscribeKeyDown(code, cb) {
        if (!this._subscriptionDictDown[code])
            return;
        this._subscriptionDictDown[code] = this._subscriptionDictDown[code].filter(listener => listener !== cb);
    }
    onKeyUp(code, cb) {
        var _a;
        var _b;
        (_a = (_b = this._subscriptionDictUp)[code]) !== null && _a !== void 0 ? _a : (_b[code] = []);
        this._subscriptionDictUp[code].push(cb);
    }
    unsubscribeKeyUp(code, cb) {
        if (!this._subscriptionDictUp[code])
            return;
        this._subscriptionDictUp[code] = this._subscriptionDictUp[code].filter(listener => listener !== cb);
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
    clone() {
        return new Size2(this);
    }
}
exports.Size2 = Size2;


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

/***/ "./src/scenes/LoadingScreen.ts":
/*!*************************************!*\
  !*** ./src/scenes/LoadingScreen.ts ***!
  \*************************************/
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
exports.LoadingScreen = void 0;
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
class LoadingScreen extends AScene_1.AScene {
    init(engine, canvas) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.add('loading', new class extends AEntity_1.AEntity {
                constructor() {
                    super(...arguments);
                    this.text = 'Loading...';
                }
                render(canvas, ctx, dt, delta, fps) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, this.scene.frameSize.w, this.scene.frameSize.h);
                    ctx.strokeStyle = 'yellow';
                    ctx.font = '40px bold';
                    const mt = ctx.measureText(this.text);
                    ctx.strokeText(this.text, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2 - 20);
                }
            });
            _super.init.call(this, engine, canvas);
        });
    }
}
exports.LoadingScreen = LoadingScreen;


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
const Engine_1 = __webpack_require__(/*! ./infrastructure/Engine */ "./src/infrastructure/Engine.ts");
const InputManager_1 = __webpack_require__(/*! ./infrastructure/InputManager */ "./src/infrastructure/InputManager.ts");
const LoadingScreen_1 = __webpack_require__(/*! ./scenes/LoadingScreen */ "./src/scenes/LoadingScreen.ts");
window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    canvas.setAttribute('class', 'main-canvas');
    document.getElementById('root').appendChild(canvas);
    const inputManager = new InputManager_1.InputManager();
    const loadingScreen = new LoadingScreen_1.LoadingScreen();
    const engine = new Engine_1.Engine();
    Promise.resolve(engine.start(canvas, canvas.getContext('2d'), inputManager, loadingScreen)).catch(e => (console.error(e)));
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7Ozs7Ozs7Ozs7O0FDM0xQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7Ozs7Ozs7Ozs7O0FDeENBO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG9CQUFvQixHQUFHLCtDQUErQyxHQUFHLGtDQUFrQyxHQUFHLDZCQUE2QixHQUFHLGdDQUFnQyxHQUFHLDZCQUE2QjtBQUM5TSxrQkFBa0IsbUJBQU8sQ0FBQyxrREFBVztBQUNyQztBQUNBLDZCQUE2QjtBQUM3QixnQ0FBZ0M7QUFDaEMsNkJBQTZCO0FBQzdCLGtDQUFrQztBQUNsQywrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDLDBDQUEwQyxxRUFBcUUsVUFBVTtBQUNsSztBQUNBO0FBQ0E7QUFDQTtBQUNBLDZDQUE2QywwQ0FBMEMsV0FBVyxzQkFBc0IsNkJBQTZCLFdBQVc7QUFDaEs7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtRUFBbUU7QUFDbkU7QUFDQSxTQUFTO0FBQ1QsNkdBQTZHO0FBQzdHO0FBQ0E7QUFDQSwwSkFBMEo7QUFDMUo7QUFDQSxvTEFBb0w7QUFDcEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COzs7Ozs7Ozs7OztBQ3BEUDtBQUNiO0FBQ0EsNEJBQTRCLCtEQUErRCxpQkFBaUI7QUFDNUc7QUFDQSxvQ0FBb0MsTUFBTSwrQkFBK0IsWUFBWTtBQUNyRixtQ0FBbUMsTUFBTSxtQ0FBbUMsWUFBWTtBQUN4RixnQ0FBZ0M7QUFDaEM7QUFDQSxLQUFLO0FBQ0w7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QscUJBQXFCO0FBQ3JCLGtCQUFrQixtQkFBTyxDQUFDLGtFQUEyQjtBQUNyRCxpQkFBaUIsbUJBQU8sQ0FBQyxnRUFBMEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxxQkFBcUI7Ozs7Ozs7VUN0Q3JCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCLG1CQUFPLENBQUMsK0RBQXlCO0FBQ2xELHVCQUF1QixtQkFBTyxDQUFDLDJFQUErQjtBQUM5RCx3QkFBd0IsbUJBQU8sQ0FBQyw2REFBd0I7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FTY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQ29sbGlkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0VuZ2luZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvSW1hZ2VMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0lucHV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvU2l6ZTIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL2FkZENvbXBvbmVudC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL0xvYWRpbmdTY3JlZW4udHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFFbnRpdHkgPSB2b2lkIDA7XG5jb25zdCBhZGRDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2FkZENvbXBvbmVudFwiKTtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSAndW5uYW1lZCcgKyBjcnlwdG8ucmFuZG9tVVVJRCgpKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnJlc291cmNlTGlzdCA9IFtdO1xuICAgICAgICAvLyBydW4gbWl4ZWQgY29tcG9uZW50cyBjb25zdHJ1Y3RvcnNcbiAgICAgICAgO1xuICAgICAgICAodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuZm9yRWFjaCgoY29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q29uc3RydWN0b3IgPSAoX2IgPSAoX2EgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnRDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSAoX2QgPSAoX2MgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVF0pID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZFtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRDb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsb2FkKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoUHJvbWlzZS5hbGwodGhpcy5yZXNvdXJjZUxpc3QubWFwKHIgPT4gci5sb2FkKHNjZW5lKSkpKS50aGVuKCk7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5uYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi9Db2xsaWRlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi9TaXplMlwiKTtcbmNvbnN0IEltYWdlTG9hZGVyXzEgPSByZXF1aXJlKFwiLi9JbWFnZUxvYWRlclwiKTtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgICAgICB0aGlzLl90YWdEaWN0ID0ge307IC8vIHRhZyAtPiBuYW1lTGlzdFxuICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwID0ge307XG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIgPSBuZXcgSW1hZ2VMb2FkZXJfMS5JbWFnZUxvYWRlcigpOyAvLyB0b2RvIGFzc2V0IG9yIHJlc291cmNlIGxvYWRlclxuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgZ2V0IGNvbGxpc2lvbkJvZHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9jb2xsaXNpb25Cb2R5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShQcm9taXNlLmFsbCh0aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkubG9hZCh0aGlzKSkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiBQcm9taXNlLmFsbCh0aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkuaW5pdCh0aGlzKSkpKSkudGhlbigpO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIC8vIENvbGxpc2lvbnNcbiAgICAgICAgY29uc3QgeyBjb3VwbGVMaXN0LCB0YWdNYXAgfSA9IG5ldyBDb2xsaWRlcl8xLkNvbGxpZGVyKHRoaXMuY29sbGlzaW9uQm9keUxpc3QpXG4gICAgICAgICAgICAucHJvY2VzcygpO1xuICAgICAgICBjb3VwbGVMaXN0LmZvckVhY2goKFthLCBiXSkgPT4ge1xuICAgICAgICAgICAgYS5jYWxsQ29sbGlzaW9uKGIpO1xuICAgICAgICAgICAgYi5jYWxsQ29sbGlzaW9uKGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgWy4uLnRhZ01hcC5rZXlzKCldLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvbmVUYWdCcmFuY2ggPSB0YWdNYXAuZ2V0KGIpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMob25lVGFnQnJhbmNoKS5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgYi5jYWxsVGFnQ29sbGlzaW9uKHRhZywgb25lVGFnQnJhbmNoW3RhZ10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkudXBkYXRlKGR0LCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICAvLyBEZWZhdWx0IGNsZWFyIHNjZW5lIGJlZm9yZSBhbGwgdGhlIGVudGl0aWVzIHJlbmRlcmVkXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkucmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKC4uLmFyZ3MpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgbGV0IGVudGl0eTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIG5hbWUgPSBhcmdzWzBdO1xuICAgICAgICAgICAgZW50aXR5ID0gYXJnc1sxXTtcbiAgICAgICAgICAgIGVudGl0eS5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVudGl0eSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBuYW1lID0gZW50aXR5Lm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZW50aXR5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICAvLyBUYWdzXG4gICAgICAgIGVudGl0eS50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3RhZ0RpY3QpW3RhZ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYlt0YWddID0gW10pO1xuICAgICAgICAgICAgdGhpcy5fdGFnRGljdFt0YWddLnB1c2gobmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDb2xsaXNpb25zXG4gICAgICAgIGlmICgoX2EgPSBlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRpdHkuY29tcG9uZW50TGlzdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKCdib3hDb2xsaWRlcicpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW50aXR5TWFwW25hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9lbnRpdHlNYXBbbmFtZV0udGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICB0aGlzLl90YWdEaWN0W3RhZ10gPSB0aGlzLl90YWdEaWN0W3RhZ10uZmlsdGVyKGVudGl0eU5hbWUgPT4gZW50aXR5TmFtZSAhPT0gbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZWxldGUgdGhpcy5fZW50aXR5TWFwW25hbWVdO1xuICAgICAgICBkZWxldGUgdGhpcy5fY29sbGlzaW9uQm9keU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZmluZEJ5VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3RhZ0RpY3RbdGFnXSB8fCBbXSkubWFwKG5hbWUgPT4gdGhpcy5nZXQobmFtZSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuQVNjZW5lID0gQVNjZW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNvbGxpZGVyID0gdm9pZCAwO1xuY2xhc3MgQ29sbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKF9ib2R5TGlzdCkge1xuICAgICAgICB0aGlzLl9ib2R5TGlzdCA9IF9ib2R5TGlzdDtcbiAgICB9XG4gICAgcHJvY2VzcygpIHtcbiAgICAgICAgY29uc3Qgb3BlbkZpcnN0T3JkZXIgPSBbJ29wZW4nLCAnY2xvc2UnXTsgLy8gaWYgdHdvIGZpZ3VyZXMgc3RheSBvbiBvbmUgbGluZSB0aGV5IG11c3QgY3Jvc3NcbiAgICAgICAgY29uc3QgeFJlZkxpc3QgPSB0aGlzLl9ib2R5TGlzdC5yZWR1Y2UoKGFjYywgYikgPT4ge1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54LCBwb3M6ICdvcGVuJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54ICsgYi5zaXplLncsIHBvczogJ2Nsb3NlJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLnYgLSBiLnYgfHwgKG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYS5wb3MpIC0gb3BlbkZpcnN0T3JkZXIuaW5kZXhPZihiLnBvcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeENhbmRpZGF0ZVBhdGhNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBjdXJyT3Blbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeFJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBwYWlyIHdpdGggYWxsIG9wZW5cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgWy4uLmN1cnJPcGVuTWFwLnZhbHVlcygpXS5mb3JFYWNoKG9wZW5DciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2ggYm90aC1kaXJlY3Rpb24gcGF0aHNcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KGNyLnJlZiwgKHhDYW5kaWRhdGVQYXRoTWFwLmdldChjci5yZWYpIHx8IG5ldyBTZXQoKSkuYWRkKG9wZW5Dci5yZWYpKTtcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KG9wZW5Dci5yZWYsICh4Q2FuZGlkYXRlUGF0aE1hcC5nZXQob3BlbkNyLnJlZikgfHwgbmV3IFNldCgpKS5hZGQoY3IucmVmKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9wZW4gaXRzZWxmXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuc2V0KGNyLnJlZiwgY3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5kZWxldGUoY3IucmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHlSZWZMaXN0ID0gdGhpcy5fYm9keUxpc3QucmVkdWNlKChhY2MsIGIpID0+IHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSwgcG9zOiAnb3BlbicsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSArIGIuc2l6ZS5oLCBwb3M6ICdjbG9zZScsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS52IC0gYi52IHx8IChvcGVuRmlyc3RPcmRlci5pbmRleE9mKGEucG9zKSAtIG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYi5wb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGN1cnJPcGVuTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBjb3VwbGVMaXN0ID0gW107XG4gICAgICAgIGNvbnN0IHRhZ01hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeVJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBleGlzdGluZyBjb2xsaXNpb25zIGJ5IHggKG9uZSBkaXJlY3Rpb24gaXMgZW5vdWdoKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBbLi4uY3Vyck9wZW5NYXAudmFsdWVzKCldLmZvckVhY2gob3BlbkNyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFJvb3QgPSB4Q2FuZGlkYXRlUGF0aE1hcC5nZXQoY3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhSb290ICYmIHhSb290LmhhcyhvcGVuQ3IucmVmKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291cGxlTGlzdC5wdXNoKFtjci5yZWYsIG9wZW5Dci5yZWZdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhZ0RpY3QgPSAodGFnTWFwLmdldChjci5yZWYpIHx8IHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5Dci5yZWYudGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfYSA9IHRhZ0RpY3RbdGFnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRhZ0RpY3RbdGFnXSA9IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdEaWN0W3RhZ10ucHVzaChvcGVuQ3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRhZ0RpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdNYXAuc2V0KGNyLnJlZiwgdGFnRGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgb3BlbiBpdHNlbGZcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5zZXQoY3IucmVmLCBjcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbG9zZVxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLmRlbGV0ZShjci5yZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgY291cGxlTGlzdCwgdGFnTWFwIH07XG4gICAgfVxufVxuZXhwb3J0cy5Db2xsaWRlciA9IENvbGxpZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRW5naW5lID0gdm9pZCAwO1xuY2xhc3MgRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GUkFNRV9SQVRFID0gNjA7XG4gICAgICAgIHRoaXMuaXNEZWJ1Z09uID0gZmFsc2U7XG4gICAgfVxuICAgIGdldCBjYW52YXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XG4gICAgfVxuICAgIGdldCBjdHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdHg7XG4gICAgfVxuICAgIGdldCBpbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgIH1cbiAgICBzdGFydChjYW52YXMsIGN0eCwgaW5wdXQsIHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XG4gICAgICAgICAgICB0aGlzLl9jdHggPSBjdHg7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gc2NlbmU7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC5vbktleURvd24oJ0tleUcnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYnVnT24gPSAhdGhpcy5pc0RlYnVnT247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnN0YXJ0KCk7XG4gICAgICAgICAgICB5aWVsZCBQcm9taXNlLnJlc29sdmUoc2NlbmUuaW5pdCh0aGlzLCBjYW52YXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hhbmdlU2NlbmUoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gc2NlbmU7XG4gICAgfVxuICAgIF9nYW1lTG9vcCh0aW1lKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGltZSAtIHRoaXMuX2xhc3RGcmFtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSB0aW1lO1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLmZsb29yKDEwMDAgLyBkZWx0YSk7XG4gICAgICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgTnVtYmVyKE1hdGgucm91bmQoZGVsdGEgLyAoMTAwMCAvIHRoaXMuRlJBTUVfUkFURSkpLnRvRml4ZWQoMikpKTtcbiAgICAgICAgLy8gaW5wdXRcbiAgICAgICAgdGhpcy5faW5wdXQudXBkYXRlKGR0KTtcbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS51cGRhdGUoZHQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5yZW5kZXIodGhpcy5fY2FudmFzLCB0aGlzLl9jdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy8gZGVidWdcbiAgICAgICAgdGhpcy5fZGVidWcoZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICAvLyBuZXh0IGl0ZXJhdGlvblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIF9kZWJ1ZyhkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBpZiAodGhpcy5pc0RlYnVnT24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCAxMjAsIDg1KTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5mb250ID0gJzE1cHggc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYOKIgiAke2R0fWAsIDEwLCAxNSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDOlDogJHtkZWx0YX1gLCAxMCwgMzAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgZnBzOiAke2Zwc31gLCAxMCwgNDUsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgb2JqLmNvdW50OiAke3RoaXMuX2N1cnJlbnRTY2VuZS5lbnRpdHlMaXN0Lmxlbmd0aH1gLCAxMCwgNjAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgaW4gSCxWOiAke3RoaXMuX2lucHV0Lmhvcml6b250YWwudG9GaXhlZCgyKX0sJHt0aGlzLmlucHV0LnZlcnRpY2FsLnRvRml4ZWQoMil9YCwgMTAsIDc1LCAxMDApO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5FbmdpbmUgPSBFbmdpbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbWFnZUxvYWRlciA9IHZvaWQgMDtcbmNsYXNzIEltYWdlTG9hZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBsb2FkKG5hbWUsIHNyYykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyLCBqKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGo7XG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLnNldChuYW1lLCBpbWcpO1xuICAgICAgICAgICAgICAgICAgICByKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVsZXRlKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fbWFwLmRlbGV0ZShuYW1lKTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcC5nZXQobmFtZSk7XG4gICAgfVxufVxuZXhwb3J0cy5JbWFnZUxvYWRlciA9IEltYWdlTG9hZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLklucHV0TWFuYWdlciA9IHZvaWQgMDtcbi8vIFRPRE8gYWRkIG1vdXNlXG5jbGFzcyBJbnB1dE1hbmFnZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLnVwID0gZmFsc2U7XG4gICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICB0aGlzLmtleSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5jb2RlID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmFsdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmN0cmxLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tZXRhS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc2hpZnRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0RG93biA9IHt9O1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXAgPSB7fTtcbiAgICAgICAgdGhpcy5fa2V5RG93bkxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhvcml6b250YWwgPiAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oZGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbCA8IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd24gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudmllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICh0aGlzLl9zdWJzY3JpcHRpb25EaWN0RG93bltlLmNvZGVdIHx8IFtdKS5mb3JFYWNoKGNiID0+IGNiKCkpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9rZXlVcExpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0xlZnQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUEnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMubGVmdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVMnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnVwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52ZHo7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA7XG4gICAgICAgICAgICAodGhpcy5fc3Vic2NyaXB0aW9uRGljdFVwW2UuY29kZV0gfHwgW10pLmZvckVhY2goY2IgPT4gY2IoKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYXhpc1NlbnNpdGl2aXR5ID0gMSAvIDEwO1xuICAgICAgICB0aGlzLl9heGlzVGFibGUgPSB7XG4gICAgICAgICAgICBoaWU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoaXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLmhvcml6b250YWwgLSBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2IDw9IC0xID8gLTEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDEgPyAxIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2aXo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsICsgZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA+PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmRlOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS5oaXo7XG4gICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZpejtcbiAgICB9XG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IHRydWU7XG4gICAgfVxuICAgIHN0b3AoKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3RhcnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuX2tleURvd25MaXN0ZW5lcik7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5fa2V5VXBMaXN0ZW5lcik7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICB9XG4gICAgdXBkYXRlKGR0KSB7XG4gICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUoZHQpO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUoZHQpO1xuICAgIH1cbiAgICBvbktleURvd24oY29kZSwgY2IpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3REb3duKVtjb2RlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW2NvZGVdID0gW10pO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0RG93bltjb2RlXS5wdXNoKGNiKTtcbiAgICB9XG4gICAgdW5zdWJzY3JpYmVLZXlEb3duKGNvZGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3Vic2NyaXB0aW9uRGljdERvd25bY29kZV0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3REb3duW2NvZGVdID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdERvd25bY29kZV0uZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBjYik7XG4gICAgfVxuICAgIG9uS2V5VXAoY29kZSwgY2IpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RVcClbY29kZV0pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYltjb2RlXSA9IFtdKTtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdFVwW2NvZGVdLnB1c2goY2IpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZUtleVVwKGNvZGUsIGNiKSB7XG4gICAgICAgIGlmICghdGhpcy5fc3Vic2NyaXB0aW9uRGljdFVwW2NvZGVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXBbY29kZV0gPSB0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXBbY29kZV0uZmlsdGVyKGxpc3RlbmVyID0+IGxpc3RlbmVyICE9PSBjYik7XG4gICAgfVxufVxuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSBJbnB1dE1hbmFnZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2l6ZTIgPSB2b2lkIDA7XG5jbGFzcyBTaXplMiB7XG4gICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICB0aGlzLncgPSAwO1xuICAgICAgICB0aGlzLmggPSAwO1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzBdKSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdO1xuICAgICAgICAgICAgdGhpcy5oID0gJ251bWJlcicgPT09IHR5cGVvZiBhcmdzWzFdID8gYXJnc1sxXSA6IGFyZ3NbMF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLncgPSBhcmdzWzBdLnc7XG4gICAgICAgICAgICB0aGlzLmggPSBhcmdzWzBdLmg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgdGhpcy53ICs9IHN1Ymo7XG4gICAgICAgICAgICB0aGlzLmggKz0gc3ViajtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudyArPSBzdWJqLnc7XG4gICAgICAgIHRoaXMuaCArPSBzdWJqLmg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBtdWwoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKj0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCAqPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICo9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICo9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFNpemUyKHRoaXMpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2l6ZTIgPSBTaXplMjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5hZGRDb21wb25lbnQgPSBleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVCA9IGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0RJQ1QgPSBleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUiA9IGV4cG9ydHMuQ09NUE9ORU5UX1JFUVVJUkVfU1lNQk9MID0gZXhwb3J0cy5DT01QT05FTlRfTkFNRV9TWU1CT0wgPSB2b2lkIDA7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi9BRW50aXR5XCIpO1xuLy8gVE9ETyBJIGJldHRlciB1c2UgUmVmbGVjdG9yIGluc3RlYWQgb2YgbWV0YSBzeW1ib2xzXG5leHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTCA9IFN5bWJvbC5mb3IoJyRjb21wb25lbnROYW1lJyk7XG5leHBvcnRzLkNPTVBPTkVOVF9SRVFVSVJFX1NZTUJPTCA9IFN5bWJvbC5mb3IoJyRjb21wb25lbnRSZXF1aXJlJyk7XG5leHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUiA9IFN5bWJvbC5mb3IoJyRjb21wb25lbnRDb25zdHJ1Y3RvcicpO1xuZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVCA9IFN5bWJvbC5mb3IoJyRjb21wb25lbnRDb25zdHJ1Y3RvckRpY3QnKTtcbmV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0xBU1RfT1BUSU9OU19ESUNUID0gU3ltYm9sLmZvcignJGNvbXBvbmVudENvbnN0cnVjdG9yRGljdExhc3RPcHRpb25zRGljdCcpO1xuZnVuY3Rpb24gYWRkQ29tcG9uZW50KGNvbXBvbmVudCwgb3B0aW9ucykge1xuICAgIHJldHVybiBmdW5jdGlvbiBkZWNvcmF0b3IoQmFzZSkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgIHZhciBfZSwgX2YsIF9nLCBfaCwgX2o7XG4gICAgICAgIC8vIEFFbnRpdHkgaXMgdGhlIG9ubHkgdGhpbmcgYSBjb21wb25lbnQgY2FuIGJlIGFwcGxpZWQgdG9cbiAgICAgICAgaWYgKEJhc2UucHJvdG90eXBlIGluc3RhbmNlb2YgQUVudGl0eV8xLkFFbnRpdHkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVuciAke2NvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF19IGNhbm5vdCBiZSBhcHBsaWVkIHRvIG5vbi1BRW50aXR5LWRlcml2ZWQgY29uc3RydWN0b3IuIFJlamVjdGVkIGZvciAke0Jhc2UubmFtZX1gKTtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIChjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfUkVRVUlSRV9TWU1CT0xdIHx8IFtdKS5mb3JFYWNoKChyZXF1aXJlZENvbXBvbmVudE5hbWUpID0+IHtcbiAgICAgICAgICAgIGlmICghKEJhc2UucHJvdG90eXBlLmNvbXBvbmVudExpc3QgfHwgW10pLmluY2x1ZGVzKHJlcXVpcmVkQ29tcG9uZW50TmFtZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke2NvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF19IHJlcXVpcmVzICR7cmVxdWlyZWRDb21wb25lbnROYW1lfSwgYnV0IGl0IGhhc24ndCBhcHBsaWVkIHRvICR7QmFzZS5uYW1lfSB5ZXRgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vICdydWxlcycgaXMgYSBzcGVjaWFsIGdlbmVyYWwgb3B0aW9uIHRvIHJlc29sdmUgbmFtaW5nIGNvbmZsaXRzXG4gICAgICAgIGNvbnN0IHJ1bGVzID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLnJ1bGVzO1xuICAgICAgICAvLyBhcHBsaWFibGUgZm9yIGZ1bmN0aW9ucyBvbmx5XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGNvbXBvbmVudCkuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGlmICgnZnVuY3Rpb24nICE9PSB0eXBlb2YgY29tcG9uZW50W25hbWVdKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWdub3JlIG1peGluIGNvbnN0cnVjdG9yIGlmIG1ldFxuICAgICAgICAgICAgaWYgKGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SID09PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdXNlciBydWxlcyB0byByZXNvbHZlIGNvbmZsaWN0c1xuICAgICAgICAgICAgaWYgKHJ1bGVzIHx8IHR5cGVvZiBCYXNlLnByb3RvdHlwZVtuYW1lXSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoQmFzZS5wcm90b3R5cGUsICgocnVsZXMgfHwge30pW25hbWVdIHx8IG5hbWUpLCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbXBvbmVudCwgbmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgKF9hID0gKF9lID0gQmFzZS5wcm90b3R5cGUpLmNvbXBvbmVudExpc3QpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfZS5jb21wb25lbnRMaXN0ID0gW10pOyAvLyBUT0RPIHJlbmFtZSBjb21wb25lbnRMaXN0IHRvIGEgc3ltYm9sP1xuICAgICAgICBCYXNlLnByb3RvdHlwZS5jb21wb25lbnRMaXN0LnB1c2goY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXSk7XG4gICAgICAgIGlmICgnZnVuY3Rpb24nID09PSB0eXBlb2YgY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SXSkge1xuICAgICAgICAgICAgKF9iID0gKF9mID0gQmFzZS5wcm90b3R5cGUpW2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0RJQ1RdKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiAoX2ZbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVF0gPSB7fSk7XG4gICAgICAgICAgICAoX2MgPSAoX2cgPSBCYXNlLnByb3RvdHlwZVtleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSlbX2ggPSBjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfTkFNRV9TWU1CT0xdXSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogKF9nW19oXSA9IGNvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl0pO1xuICAgICAgICAgICAgKF9kID0gKF9qID0gQmFzZS5wcm90b3R5cGUpW2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0xBU1RfT1BUSU9OU19ESUNUXSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogKF9qW2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0xBU1RfT1BUSU9OU19ESUNUXSA9IHt9KTtcbiAgICAgICAgICAgIC8vIGFuIGFFbnRpdHkgY29uc3RydWN0b3IgY2xlYW5zIGl0IHVwIGFmdGVyIGEgY29tcG9uZW50IGNvbnNydWN0b3IgY2FsbFxuICAgICAgICAgICAgQmFzZS5wcm90b3R5cGVbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1RdW2NvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF1dID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQmFzZTtcbiAgICB9O1xufVxuZXhwb3J0cy5hZGRDb21wb25lbnQgPSBhZGRDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Mb2FkaW5nU2NyZWVuID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FFbnRpdHlcIik7XG5jb25zdCBBU2NlbmVfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BU2NlbmVcIik7XG5jbGFzcyBMb2FkaW5nU2NyZWVuIGV4dGVuZHMgQVNjZW5lXzEuQVNjZW5lIHtcbiAgICBpbml0KGVuZ2luZSwgY2FudmFzKSB7XG4gICAgICAgIGNvbnN0IF9zdXBlciA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICAgICAgaW5pdDogeyBnZXQ6ICgpID0+IHN1cGVyLmluaXQgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKCdsb2FkaW5nJywgbmV3IGNsYXNzIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSAnTG9hZGluZy4uLic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLnNjZW5lLmZyYW1lU2l6ZS53LCB0aGlzLnNjZW5lLmZyYW1lU2l6ZS5oKTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LnN0cm9rZVN0eWxlID0gJ3llbGxvdyc7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5mb250ID0gJzQwcHggYm9sZCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG10ID0gY3R4Lm1lYXN1cmVUZXh0KHRoaXMudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5zdHJva2VUZXh0KHRoaXMudGV4dCwgdGhpcy5zY2VuZS5mcmFtZVNpemUudyAvIDIgLSBtdC53aWR0aCAvIDIsIHRoaXMuc2NlbmUuZnJhbWVTaXplLmggLyAyIC0gMjApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3N1cGVyLmluaXQuY2FsbCh0aGlzLCBlbmdpbmUsIGNhbnZhcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTG9hZGluZ1NjcmVlbiA9IExvYWRpbmdTY3JlZW47XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2luZnJhc3RydWN0dXJlL0VuZ2luZVwiKTtcbmNvbnN0IElucHV0TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvSW5wdXRNYW5hZ2VyXCIpO1xuY29uc3QgTG9hZGluZ1NjcmVlbl8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0xvYWRpbmdTY3JlZW5cIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgbG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nU2NyZWVuXzEuTG9hZGluZ1NjcmVlbigpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBQcm9taXNlLnJlc29sdmUoZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgbG9hZGluZ1NjcmVlbikpLmNhdGNoKGUgPT4gKGNvbnNvbGUuZXJyb3IoZSkpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9