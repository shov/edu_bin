/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AEntity.ts":
/*!************************!*\
  !*** ./src/AEntity.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AEntity = void 0;
class AEntity {
    init(scene, canvas) {
        this._scene = scene;
    }
    update(dt, input) {
    }
    render(canvas, ctx, dt, delta, fps) {
    }
}
exports.AEntity = AEntity;


/***/ }),

/***/ "./src/AScene.ts":
/*!***********************!*\
  !*** ./src/AScene.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AScene = void 0;
class AScene {
    constructor() {
        this._entityMap = {};
    }
    get entityList() {
        return Object.values(this._entityMap);
    }
    init(engine, canvas) {
        this._engine = engine;
        this.entityList.forEach(entity => {
            entity.init(this, canvas);
        });
        const c = 1000;
        const rawWallList = {
            top: [{ x: -c, y: -c }, { x: canvas.width + c, y: -c }, { x: canvas.width + c, y: 0 }, { x: -c, y: 0 }],
            right: [{ x: canvas.width, y: -c }, { x: canvas.width + c, y: -c }, { x: canvas.width + c, y: canvas.height + c }, {
                    x: canvas.width,
                    y: canvas.height + c
                }],
            bottom: [{ x: -c, y: canvas.height }, { x: canvas.width + c, y: canvas.height }, {
                    x: canvas.width + c,
                    y: canvas.height + c
                }, { x: -c, y: canvas.height + c }],
            left: [{ x: -c, y: -c }, { x: 0, y: -c }, { x: 0, y: canvas.height + c }, { x: -c, y: canvas.height + c }],
        };
        this._wallList = Object
            .keys(rawWallList)
            .reduce((acc, key) => {
            acc[key] = {
                vertices() {
                    return rawWallList[key];
                },
                hasCollisionWith(t) {
                    return false;
                }
            };
            return acc;
        }, {});
    }
    update(dt, input) {
        var _a, _b, _c, _d;
        for (const entity of this.entityList) {
            entity.update(dt, input);
            if (!entity.isLockedOnScreen) {
                return;
            }
            if ('function' === typeof entity.hasCollisionWith) {
                if (entity.hasCollisionWith(this._wallList.top)) {
                    entity.y = 0 + ((_a = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _a === void 0 ? void 0 : _a.y) || 0;
                }
                if (entity.hasCollisionWith(this._wallList.bottom)) {
                    entity.y
                        = this._engine.canvas.height
                            - entity.h
                            + ((_b = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _b === void 0 ? void 0 : _b.y) || 0;
                }
                if (entity.hasCollisionWith(this._wallList.left)) {
                    entity.x = 0 + ((_c = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _c === void 0 ? void 0 : _c.x) || 0;
                }
                if (entity.hasCollisionWith(this._wallList.right)) {
                    entity.x
                        = this._engine.canvas.width
                            - entity.w
                            + ((_d = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _d === void 0 ? void 0 : _d.x) || 0;
                }
            }
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        // Default clear scene before all the entities rendered
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const entity of this.entityList) {
            entity.render(canvas, ctx, dt, delta, fps);
        }
    }
    add(name, entity) {
        this._entityMap[name] = entity;
    }
    remove(name) {
        delete this._entityMap[name];
    }
    get(name) {
        return this._entityMap[name];
    }
}
exports.AScene = AScene;


/***/ }),

/***/ "./src/Engine.ts":
/*!***********************!*\
  !*** ./src/Engine.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Engine = void 0;
class Engine {
    constructor() {
        this.FRAME_RATE = 60;
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
        // update
        this._currentScene.update(dt, this._input);
        // render
        this._currentScene.render(this._canvas, this._ctx, dt, delta, fps);
        //debug
        this._debug(dt, delta, fps);
        // next iteration
        requestAnimationFrame(time => this._gameLoop(time));
    }
    _debug(dt, delta, fps) {
        if (this._input.altKey) {
            this._ctx.fillStyle = 'black';
            this._ctx.strokeStyle = 'white';
            this._ctx.fillRect(0, 0, 120, 50);
            this._ctx.font = '15px serif';
            this._ctx.strokeText(`∂ ${dt}`, 10, 15, 100);
            this._ctx.strokeText(`Δ: ${delta}`, 10, 30, 100);
            this._ctx.strokeText(`fps: ${fps}`, 10, 45, 100);
        }
    }
}
exports.Engine = Engine;


/***/ }),

/***/ "./src/InputManager.ts":
/*!*****************************!*\
  !*** ./src/InputManager.ts ***!
  \*****************************/
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
                    this.horizontal = -1;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.right = true;
                    this.horizontal = 1;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.up = true;
                    this.vertical = 1;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.down = true;
                    this.vertical = -1;
                    break;
            }
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
                        this.horizontal = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.right = false;
                    if (!this.left) {
                        this.horizontal = 0;
                    }
                    break;
                case 'ArrowUp':
                case 'KeyW':
                    this.up = false;
                    if (!this.down) {
                        this.vertical = 0;
                    }
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.down = false;
                    if (!this.up) {
                        this.vertical = 0;
                    }
                    break;
            }
        };
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
}
exports.InputManager = InputManager;


/***/ }),

/***/ "./src/Mixer.ts":
/*!**********************!*\
  !*** ./src/Mixer.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mixin = void 0;
function mixin(mixIn, rules = null) {
    return function decorator(Base) {
        Object.getOwnPropertyNames(mixIn).forEach(name => {
            if (rules || typeof Base.prototype[name] === 'undefined') {
                Object.defineProperty(Base.prototype, ((rules || {})[name] || name), Object.getOwnPropertyDescriptor(mixIn, name));
            }
        });
        return Base;
    };
}
exports.mixin = mixin;


/***/ }),

/***/ "./src/entities/Ball.ts":
/*!******************************!*\
  !*** ./src/entities/Ball.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ball = void 0;
const AEntity_1 = __webpack_require__(/*! ../AEntity */ "./src/AEntity.ts");
class Ball extends AEntity_1.AEntity {
}
exports.Ball = Ball;


/***/ }),

/***/ "./src/entities/PlayerBar.ts":
/*!***********************************!*\
  !*** ./src/entities/PlayerBar.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerBar = void 0;
const AEntity_1 = __webpack_require__(/*! ../AEntity */ "./src/AEntity.ts");
const Mixer_1 = __webpack_require__(/*! ../Mixer */ "./src/Mixer.ts");
const position_1 = __webpack_require__(/*! ../mixins/position */ "./src/mixins/position.ts");
const rect_1 = __webpack_require__(/*! ../mixins/rect */ "./src/mixins/rect.ts");
const lockedOnScreen_1 = __webpack_require__(/*! ../mixins/lockedOnScreen */ "./src/mixins/lockedOnScreen.ts");
const boxCollieder_1 = __webpack_require__(/*! ../mixins/boxCollieder */ "./src/mixins/boxCollieder.ts");
let PlayerBar = class PlayerBar extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.SPEED = 5;
    }
    init(scene, canvas) {
        super.init(scene, canvas);
        this.x = canvas.width / 2;
        this.y = canvas.height - 10;
        this.w = 50;
        this.h = 15;
        this.anchor = { x: this.w / 2, y: this.h };
    }
    update(dt, input) {
        this.x += dt * this.SPEED * input.horizontal;
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'black';
        ctx.fillRect(...this.body(this.position));
    }
};
PlayerBar = __decorate([
    (0, Mixer_1.mixin)(position_1.position),
    (0, Mixer_1.mixin)(rect_1.rect),
    (0, Mixer_1.mixin)(lockedOnScreen_1.lockedOnScreen),
    (0, Mixer_1.mixin)(boxCollieder_1.boxCollider)
], PlayerBar);
exports.PlayerBar = PlayerBar;


/***/ }),

/***/ "./src/mixins/boxCollieder.ts":
/*!************************************!*\
  !*** ./src/mixins/boxCollieder.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.boxCollider = void 0;
exports.boxCollider = {
    vertices() {
        const topLeft = this.scruff(this.position);
        return [
            topLeft,
            { x: topLeft.x + this.w, y: topLeft.y },
            { x: topLeft.x + this.w, y: topLeft.y + this.h },
            { x: topLeft.x, y: topLeft.y + this.h },
        ];
    },
    hasCollisionWith(target) {
        const currVertices = this.vertices();
        const targetVertices = target.vertices();
        return currVertices[0].x < targetVertices[1].x
            && currVertices[1].x > targetVertices[0].x
            && currVertices[0].y < targetVertices[2].y
            && currVertices[2].y > targetVertices[0].y;
    },
};


/***/ }),

/***/ "./src/mixins/lockedOnScreen.ts":
/*!**************************************!*\
  !*** ./src/mixins/lockedOnScreen.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.lockedOnScreen = void 0;
exports.lockedOnScreen = {
    isLockedOnScreen: true,
};


/***/ }),

/***/ "./src/mixins/position.ts":
/*!********************************!*\
  !*** ./src/mixins/position.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.position = void 0;
exports.position = {
    _x: 0,
    _y: 0,
    get x() {
        return this._x;
    },
    set x(value) {
        this._x = value;
    },
    get y() {
        return this._y;
    },
    set y(value) {
        this._y = value;
    },
    get position() {
        return { x: this._x, y: this._y };
    },
    set position(value) {
        this._x = value.x;
        this._y = value.y;
    },
};


/***/ }),

/***/ "./src/mixins/rect.ts":
/*!****************************!*\
  !*** ./src/mixins/rect.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rect = void 0;
exports.rect = {
    _w: 0,
    _h: 0,
    _anchor: { x: 0, y: 0 },
    scruff(position) {
        return {
            x: position.x - this._anchor.x,
            y: position.y - this._anchor.y,
        };
    },
    body(position) {
        return [
            position.x - this._anchor.x,
            position.y - this._anchor.y,
            this._w,
            this._h,
        ];
    },
    get w() {
        return this._w;
    },
    set w(value) {
        this._w = value;
    },
    get h() {
        return this._h;
    },
    set h(value) {
        this._h = value;
    },
    get anchor() {
        return this._anchor;
    },
    set anchor(value) {
        this._anchor = value;
    },
};


/***/ }),

/***/ "./src/scenes/DefaultScene.ts":
/*!************************************!*\
  !*** ./src/scenes/DefaultScene.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DefaultScene = void 0;
const AScene_1 = __webpack_require__(/*! ../AScene */ "./src/AScene.ts");
const PlayerBar_1 = __webpack_require__(/*! ../entities/PlayerBar */ "./src/entities/PlayerBar.ts");
const Ball_1 = __webpack_require__(/*! ../entities/Ball */ "./src/entities/Ball.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        this.add('playerBar', new PlayerBar_1.PlayerBar());
        this.add('ball', new Ball_1.Ball());
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
const Engine_1 = __webpack_require__(/*! ./Engine */ "./src/Engine.ts");
const InputManager_1 = __webpack_require__(/*! ./InputManager */ "./src/InputManager.ts");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUNaRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLGNBQWMsSUFBSSw0QkFBNEIsSUFBSSwyQkFBMkIsSUFBSSxhQUFhO0FBQ2xILHNCQUFzQix3QkFBd0IsSUFBSSw0QkFBNEIsSUFBSSwyQ0FBMkM7QUFDN0g7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQix1QkFBdUIseUJBQXlCLElBQUksdUNBQXVDO0FBQzNGO0FBQ0E7QUFDQSxpQkFBaUIsSUFBSSw2QkFBNkI7QUFDbEQscUJBQXFCLGNBQWMsSUFBSSxhQUFhLElBQUksNEJBQTRCLElBQUksNkJBQTZCO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUN4RkQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLEdBQUc7QUFDekMsdUNBQXVDLE1BQU07QUFDN0MseUNBQXlDLElBQUk7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUN2REQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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dEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHVCQUF1QixtQkFBTyxDQUFDLDJEQUF1QjtBQUN0RCxpQkFBaUIsbUJBQU8sQ0FBQyxpQ0FBVTtBQUNuQyx1QkFBdUIsbUJBQU8sQ0FBQyw2Q0FBZ0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL0FFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0FTY2VuZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvRW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9JbnB1dE1hbmFnZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01peGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9CYWxsLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9QbGF5ZXJCYXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy9ib3hDb2xsaWVkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy9sb2NrZWRPblNjcmVlbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW5zL3Bvc2l0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9taXhpbnMvcmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL0RlZmF1bHRTY2VuZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQUVudGl0eSA9IHZvaWQgMDtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGluaXQoc2NlbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLl9lbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgIHRoaXMuZW50aXR5TGlzdC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBlbnRpdHkuaW5pdCh0aGlzLCBjYW52YXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYyA9IDEwMDA7XG4gICAgICAgIGNvbnN0IHJhd1dhbGxMaXN0ID0ge1xuICAgICAgICAgICAgdG9wOiBbeyB4OiAtYywgeTogLWMgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiAtYyB9LCB7IHg6IGNhbnZhcy53aWR0aCArIGMsIHk6IDAgfSwgeyB4OiAtYywgeTogMCB9XSxcbiAgICAgICAgICAgIHJpZ2h0OiBbeyB4OiBjYW52YXMud2lkdGgsIHk6IC1jIH0sIHsgeDogY2FudmFzLndpZHRoICsgYywgeTogLWMgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiBjYW52YXMuaGVpZ2h0ICsgYyB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgeTogY2FudmFzLmhlaWdodCArIGNcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGJvdHRvbTogW3sgeDogLWMsIHk6IGNhbnZhcy5oZWlnaHQgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiBjYW52YXMuaGVpZ2h0IH0sIHtcbiAgICAgICAgICAgICAgICAgICAgeDogY2FudmFzLndpZHRoICsgYyxcbiAgICAgICAgICAgICAgICAgICAgeTogY2FudmFzLmhlaWdodCArIGNcbiAgICAgICAgICAgICAgICB9LCB7IHg6IC1jLCB5OiBjYW52YXMuaGVpZ2h0ICsgYyB9XSxcbiAgICAgICAgICAgIGxlZnQ6IFt7IHg6IC1jLCB5OiAtYyB9LCB7IHg6IDAsIHk6IC1jIH0sIHsgeDogMCwgeTogY2FudmFzLmhlaWdodCArIGMgfSwgeyB4OiAtYywgeTogY2FudmFzLmhlaWdodCArIGMgfV0sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX3dhbGxMaXN0ID0gT2JqZWN0XG4gICAgICAgICAgICAua2V5cyhyYXdXYWxsTGlzdClcbiAgICAgICAgICAgIC5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IHtcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcygpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJhd1dhbGxMaXN0W2tleV07XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoYXNDb2xsaXNpb25XaXRoKHQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB7fSk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS51cGRhdGUoZHQsIGlucHV0KTtcbiAgICAgICAgICAgIGlmICghZW50aXR5LmlzTG9ja2VkT25TY3JlZW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJ2Z1bmN0aW9uJyA9PT0gdHlwZW9mIGVudGl0eS5oYXNDb2xsaXNpb25XaXRoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNDb2xsaXNpb25XaXRoKHRoaXMuX3dhbGxMaXN0LnRvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnkgPSAwICsgKChfYSA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5hbmNob3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS55KSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbGxpc2lvbldpdGgodGhpcy5fd2FsbExpc3QuYm90dG9tKSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkueVxuICAgICAgICAgICAgICAgICAgICAgICAgPSB0aGlzLl9lbmdpbmUuY2FudmFzLmhlaWdodFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gZW50aXR5LmhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArICgoX2IgPSBlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRpdHkuYW5jaG9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IueSkgfHwgMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNDb2xsaXNpb25XaXRoKHRoaXMuX3dhbGxMaXN0LmxlZnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS54ID0gMCArICgoX2MgPSBlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRpdHkuYW5jaG9yKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MueCkgfHwgMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudGl0eS5oYXNDb2xsaXNpb25XaXRoKHRoaXMuX3dhbGxMaXN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkueFxuICAgICAgICAgICAgICAgICAgICAgICAgPSB0aGlzLl9lbmdpbmUuY2FudmFzLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBlbnRpdHkud1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKChfZCA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5hbmNob3IpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC54KSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIC8vIERlZmF1bHQgY2xlYXIgc2NlbmUgYmVmb3JlIGFsbCB0aGUgZW50aXRpZXMgcmVuZGVyZWRcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS5yZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQobmFtZSwgZW50aXR5KSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICB9XG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG59XG5leHBvcnRzLkFTY2VuZSA9IEFTY2VuZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmdpbmUgPSB2b2lkIDA7XG5jbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZSQU1FX1JBVEUgPSA2MDtcbiAgICB9XG4gICAgZ2V0IGNhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcbiAgICB9XG4gICAgZ2V0IGN0eCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgZ2V0IGlucHV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIHN0YXJ0KGNhbnZhcywgY3R4LCBpbnB1dCwgc2NlbmUpIHtcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLl9jdHggPSBjdHg7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICB0aGlzLl9pbnB1dC5zdGFydCgpO1xuICAgICAgICBzY2VuZS5pbml0KHRoaXMsIGNhbnZhcyk7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIGNoYW5nZVNjZW5lKCkge1xuICAgICAgICAvLyBUT0RPXG4gICAgfVxuICAgIF9nYW1lTG9vcCh0aW1lKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGltZSAtIHRoaXMuX2xhc3RGcmFtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSB0aW1lO1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLmZsb29yKDEwMDAgLyBkZWx0YSk7XG4gICAgICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgTnVtYmVyKE1hdGgucm91bmQoZGVsdGEgLyAoMTAwMCAvIHRoaXMuRlJBTUVfUkFURSkpLnRvRml4ZWQoMikpKTtcbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS51cGRhdGUoZHQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5yZW5kZXIodGhpcy5fY2FudmFzLCB0aGlzLl9jdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy9kZWJ1Z1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIG5leHQgaXRlcmF0aW9uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lID0+IHRoaXMuX2dhbWVMb29wKHRpbWUpKTtcbiAgICB9XG4gICAgX2RlYnVnKGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbnB1dC5hbHRLZXkpIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCAxMjAsIDUwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5mb250ID0gJzE1cHggc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYOKIgiAke2R0fWAsIDEwLCAxNSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDOlDogJHtkZWx0YX1gLCAxMCwgMzAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgZnBzOiAke2Zwc31gLCAxMCwgNDUsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkVuZ2luZSA9IEVuZ2luZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSB2b2lkIDA7XG4vLyBUT0RPIGFkZCBtb3VzZVxuY2xhc3MgSW5wdXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgdGhpcy5rZXkgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuY29kZSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdHJsS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWV0YUtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fa2V5RG93bkxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2tleVVwTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5RCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gSW5wdXRNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1peGluID0gdm9pZCAwO1xuZnVuY3Rpb24gbWl4aW4obWl4SW4sIHJ1bGVzID0gbnVsbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBkZWNvcmF0b3IoQmFzZSkge1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtaXhJbikuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGlmIChydWxlcyB8fCB0eXBlb2YgQmFzZS5wcm90b3R5cGVbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2UucHJvdG90eXBlLCAoKHJ1bGVzIHx8IHt9KVtuYW1lXSB8fCBuYW1lKSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtaXhJbiwgbmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEJhc2U7XG4gICAgfTtcbn1cbmV4cG9ydHMubWl4aW4gPSBtaXhpbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5CYWxsID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL0FFbnRpdHlcIik7XG5jbGFzcyBCYWxsIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xufVxuZXhwb3J0cy5CYWxsID0gQmFsbDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QbGF5ZXJCYXIgPSB2b2lkIDA7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vQUVudGl0eVwiKTtcbmNvbnN0IE1peGVyXzEgPSByZXF1aXJlKFwiLi4vTWl4ZXJcIik7XG5jb25zdCBwb3NpdGlvbl8xID0gcmVxdWlyZShcIi4uL21peGlucy9wb3NpdGlvblwiKTtcbmNvbnN0IHJlY3RfMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvcmVjdFwiKTtcbmNvbnN0IGxvY2tlZE9uU2NyZWVuXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL2xvY2tlZE9uU2NyZWVuXCIpO1xuY29uc3QgYm94Q29sbGllZGVyXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL2JveENvbGxpZWRlclwiKTtcbmxldCBQbGF5ZXJCYXIgPSBjbGFzcyBQbGF5ZXJCYXIgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMuU1BFRUQgPSA1O1xuICAgIH1cbiAgICBpbml0KHNjZW5lLCBjYW52YXMpIHtcbiAgICAgICAgc3VwZXIuaW5pdChzY2VuZSwgY2FudmFzKTtcbiAgICAgICAgdGhpcy54ID0gY2FudmFzLndpZHRoIC8gMjtcbiAgICAgICAgdGhpcy55ID0gY2FudmFzLmhlaWdodCAtIDEwO1xuICAgICAgICB0aGlzLncgPSA1MDtcbiAgICAgICAgdGhpcy5oID0gMTU7XG4gICAgICAgIHRoaXMuYW5jaG9yID0geyB4OiB0aGlzLncgLyAyLCB5OiB0aGlzLmggfTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICB0aGlzLnggKz0gZHQgKiB0aGlzLlNQRUVEICogaW5wdXQuaG9yaXpvbnRhbDtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ2JsYWNrJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KC4uLnRoaXMuYm9keSh0aGlzLnBvc2l0aW9uKSk7XG4gICAgfVxufTtcblBsYXllckJhciA9IF9fZGVjb3JhdGUoW1xuICAgICgwLCBNaXhlcl8xLm1peGluKShwb3NpdGlvbl8xLnBvc2l0aW9uKSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikocmVjdF8xLnJlY3QpLFxuICAgICgwLCBNaXhlcl8xLm1peGluKShsb2NrZWRPblNjcmVlbl8xLmxvY2tlZE9uU2NyZWVuKSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikoYm94Q29sbGllZGVyXzEuYm94Q29sbGlkZXIpXG5dLCBQbGF5ZXJCYXIpO1xuZXhwb3J0cy5QbGF5ZXJCYXIgPSBQbGF5ZXJCYXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYm94Q29sbGlkZXIgPSB2b2lkIDA7XG5leHBvcnRzLmJveENvbGxpZGVyID0ge1xuICAgIHZlcnRpY2VzKCkge1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gdGhpcy5zY3J1ZmYodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0b3BMZWZ0LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LnggKyB0aGlzLncsIHk6IHRvcExlZnQueSB9LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LnggKyB0aGlzLncsIHk6IHRvcExlZnQueSArIHRoaXMuaCB9LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LngsIHk6IHRvcExlZnQueSArIHRoaXMuaCB9LFxuICAgICAgICBdO1xuICAgIH0sXG4gICAgaGFzQ29sbGlzaW9uV2l0aCh0YXJnZXQpIHtcbiAgICAgICAgY29uc3QgY3VyclZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcygpO1xuICAgICAgICBjb25zdCB0YXJnZXRWZXJ0aWNlcyA9IHRhcmdldC52ZXJ0aWNlcygpO1xuICAgICAgICByZXR1cm4gY3VyclZlcnRpY2VzWzBdLnggPCB0YXJnZXRWZXJ0aWNlc1sxXS54XG4gICAgICAgICAgICAmJiBjdXJyVmVydGljZXNbMV0ueCA+IHRhcmdldFZlcnRpY2VzWzBdLnhcbiAgICAgICAgICAgICYmIGN1cnJWZXJ0aWNlc1swXS55IDwgdGFyZ2V0VmVydGljZXNbMl0ueVxuICAgICAgICAgICAgJiYgY3VyclZlcnRpY2VzWzJdLnkgPiB0YXJnZXRWZXJ0aWNlc1swXS55O1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmxvY2tlZE9uU2NyZWVuID0gdm9pZCAwO1xuZXhwb3J0cy5sb2NrZWRPblNjcmVlbiA9IHtcbiAgICBpc0xvY2tlZE9uU2NyZWVuOiB0cnVlLFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wb3NpdGlvbiA9IHZvaWQgMDtcbmV4cG9ydHMucG9zaXRpb24gPSB7XG4gICAgX3g6IDAsXG4gICAgX3k6IDAsXG4gICAgZ2V0IHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH0sXG4gICAgc2V0IHgodmFsdWUpIHtcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH0sXG4gICAgc2V0IHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0IHBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4geyB4OiB0aGlzLl94LCB5OiB0aGlzLl95IH07XG4gICAgfSxcbiAgICBzZXQgcG9zaXRpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlLng7XG4gICAgICAgIHRoaXMuX3kgPSB2YWx1ZS55O1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlY3QgPSB2b2lkIDA7XG5leHBvcnRzLnJlY3QgPSB7XG4gICAgX3c6IDAsXG4gICAgX2g6IDAsXG4gICAgX2FuY2hvcjogeyB4OiAwLCB5OiAwIH0sXG4gICAgc2NydWZmKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBwb3NpdGlvbi54IC0gdGhpcy5fYW5jaG9yLngsXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55IC0gdGhpcy5fYW5jaG9yLnksXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBib2R5KHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwb3NpdGlvbi54IC0gdGhpcy5fYW5jaG9yLngsXG4gICAgICAgICAgICBwb3NpdGlvbi55IC0gdGhpcy5fYW5jaG9yLnksXG4gICAgICAgICAgICB0aGlzLl93LFxuICAgICAgICAgICAgdGhpcy5faCxcbiAgICAgICAgXTtcbiAgICB9LFxuICAgIGdldCB3KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdztcbiAgICB9LFxuICAgIHNldCB3KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3cgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldCBoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faDtcbiAgICB9LFxuICAgIHNldCBoKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2ggPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldCBhbmNob3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbmNob3I7XG4gICAgfSxcbiAgICBzZXQgYW5jaG9yKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2FuY2hvciA9IHZhbHVlO1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IEFTY2VuZV8xID0gcmVxdWlyZShcIi4uL0FTY2VuZVwiKTtcbmNvbnN0IFBsYXllckJhcl8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllckJhclwiKTtcbmNvbnN0IEJhbGxfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9CYWxsXCIpO1xuY2xhc3MgRGVmYXVsdFNjZW5lIGV4dGVuZHMgQVNjZW5lXzEuQVNjZW5lIHtcbiAgICBpbml0KGVuZ2luZSwgY2FudmFzKSB7XG4gICAgICAgIHRoaXMuYWRkKCdwbGF5ZXJCYXInLCBuZXcgUGxheWVyQmFyXzEuUGxheWVyQmFyKCkpO1xuICAgICAgICB0aGlzLmFkZCgnYmFsbCcsIG5ldyBCYWxsXzEuQmFsbCgpKTtcbiAgICAgICAgc3VwZXIuaW5pdChlbmdpbmUsIGNhbnZhcyk7XG4gICAgfVxufVxuZXhwb3J0cy5EZWZhdWx0U2NlbmUgPSBEZWZhdWx0U2NlbmU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBEZWZhdWx0U2NlbmVfMSA9IHJlcXVpcmUoXCIuL3NjZW5lcy9EZWZhdWx0U2NlbmVcIik7XG5jb25zdCBFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL0VuZ2luZVwiKTtcbmNvbnN0IElucHV0TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vSW5wdXRNYW5hZ2VyXCIpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLndpZHRoID0gNjQwO1xuICAgIGNhbnZhcy5oZWlnaHQgPSA0ODA7XG4gICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWFpbi1jYW52YXMnKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgY29uc3QgaW5wdXRNYW5hZ2VyID0gbmV3IElucHV0TWFuYWdlcl8xLklucHV0TWFuYWdlcigpO1xuICAgIGNvbnN0IGRlZmF1bHRTY2VuZSA9IG5ldyBEZWZhdWx0U2NlbmVfMS5EZWZhdWx0U2NlbmUoKTtcbiAgICBjb25zdCBlbmdpbmUgPSBuZXcgRW5naW5lXzEuRW5naW5lKCk7XG4gICAgZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgZGVmYXVsdFNjZW5lKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9