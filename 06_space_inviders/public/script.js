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
        this.wallList = Object
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
                continue;
            }
            if ('function' === typeof entity.hasCollisionWith) {
                if (entity.hasCollisionWith(this.wallList.top)) {
                    entity.y = 0 + ((_a = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _a === void 0 ? void 0 : _a.y) || 0;
                }
                if (entity.hasCollisionWith(this.wallList.bottom)) {
                    entity.y
                        = this._engine.canvas.height
                            - entity.h
                            + ((_b = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _b === void 0 ? void 0 : _b.y) || 0;
                }
                if (entity.hasCollisionWith(this.wallList.left)) {
                    entity.x = 0 + ((_c = entity === null || entity === void 0 ? void 0 : entity.anchor) === null || _c === void 0 ? void 0 : _c.x) || 0;
                }
                if (entity.hasCollisionWith(this.wallList.right)) {
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Ball = void 0;
const AEntity_1 = __webpack_require__(/*! ../AEntity */ "./src/AEntity.ts");
const Mixer_1 = __webpack_require__(/*! ../Mixer */ "./src/Mixer.ts");
const position_1 = __webpack_require__(/*! ../mixins/position */ "./src/mixins/position.ts");
const rect_1 = __webpack_require__(/*! ../mixins/rect */ "./src/mixins/rect.ts");
const boxCollieder_1 = __webpack_require__(/*! ../mixins/boxCollieder */ "./src/mixins/boxCollieder.ts");
let Ball = class Ball extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.speed = {
            x: 4,
            y: 4,
        };
    }
    init(scene, canvas) {
        this.position = {
            x: Math.random() * canvas.width,
            y: 20,
        };
        this.h = 10;
        this.w = 10;
        this.anchor = {
            x: 5,
            y: 5,
        };
        super.init(scene, canvas);
        this.gameController = this._scene.get('gameController');
    }
    update(dt, input) {
        const playerBar = this._scene.get('playerBar');
        if (this.hasCollisionWith(this._scene.wallList.top)) {
            this.speed.y *= -1;
        }
        if (this.hasCollisionWith(playerBar)) {
            this.y -= 7;
            this.speed.y *= -1;
            this.gameController.increaseScore();
        }
        if (this.hasCollisionWith(this._scene.wallList.left) || this.hasCollisionWith(this._scene.wallList.right)) {
            this.speed.x *= -1;
        }
        if (this.hasCollisionWith(this._scene.wallList.bottom)) {
            this.gameController.gameOver();
        }
        this.position = {
            x: this.x += this.speed.x,
            y: this.y += this.speed.y,
        };
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.ellipse(...this.body(this.position), 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    speedUp(value) {
        const vxm = this.speed.x / Math.abs(this.speed.x);
        const vym = this.speed.y / Math.abs(this.speed.y);
        this.speed.x += value.x * vxm;
        this.speed.y += value.y * vxm;
    }
};
Ball = __decorate([
    (0, Mixer_1.mixin)(position_1.position),
    (0, Mixer_1.mixin)(rect_1.rect),
    (0, Mixer_1.mixin)(boxCollieder_1.boxCollider)
], Ball);
exports.Ball = Ball;


/***/ }),

/***/ "./src/entities/GameController.ts":
/*!****************************************!*\
  !*** ./src/entities/GameController.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GameController = void 0;
const AEntity_1 = __webpack_require__(/*! ../AEntity */ "./src/AEntity.ts");
class GameController extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.score = 0;
        this.isGameOver = false;
    }
    increaseScore() {
        var _a, _b, _c;
        this.score += 10;
        if (this.score > 0 && 0 === this.score % 50) {
            (_a = this._scene.get('playerBar')) === null || _a === void 0 ? void 0 : _a.moveUp(10);
            (_b = this._scene.get('playerBar')) === null || _b === void 0 ? void 0 : _b.increaseSpeed(1.5);
        }
        if (this.score > 0 && 0 === this.score % 30) {
            (_c = this._scene.get('ball')) === null || _c === void 0 ? void 0 : _c.speedUp({ x: 0.5, y: 0.5 });
        }
    }
    gameOver() {
        this._scene.remove('playerBar');
        this._scene.remove('ball');
        this.isGameOver = true;
    }
    update(dt, input) {
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'black';
        ctx.font = '30px serif';
        ctx.fillText(`Score: ${this.score}`, canvas.width - 150, 25, 150);
        if (this.isGameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '65px serif';
            ctx.fillText(`GAME OVER`, canvas.width / 2 - 200, canvas.height / 2 + 10);
        }
    }
}
exports.GameController = GameController;


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
        this.speed = 5;
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
        this.x += dt * this.speed * input.horizontal;
    }
    render(canvas, ctx, dt, delta, fps) {
        ctx.fillStyle = 'black';
        ctx.fillRect(...this.body(this.position));
    }
    moveUp(value) {
        setTimeout(() => {
            this.y -= value;
        }, 200);
    }
    increaseSpeed(value) {
        this.speed += value;
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
const GameController_1 = __webpack_require__(/*! ../entities/GameController */ "./src/entities/GameController.ts");
class DefaultScene extends AScene_1.AScene {
    init(engine, canvas) {
        this.add('gameController', new GameController_1.GameController());
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUNaRjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0Esb0JBQW9CLGNBQWMsSUFBSSw0QkFBNEIsSUFBSSwyQkFBMkIsSUFBSSxhQUFhO0FBQ2xILHNCQUFzQix3QkFBd0IsSUFBSSw0QkFBNEIsSUFBSSwyQ0FBMkM7QUFDN0g7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQix1QkFBdUIseUJBQXlCLElBQUksdUNBQXVDO0FBQzNGO0FBQ0E7QUFDQSxpQkFBaUIsSUFBSSw2QkFBNkI7QUFDbEQscUJBQXFCLGNBQWMsSUFBSSxhQUFhLElBQUksNEJBQTRCLElBQUksNkJBQTZCO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTLElBQUk7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUN4RkQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLEdBQUc7QUFDekMsdUNBQXVDLE1BQU07QUFDN0MseUNBQXlDLElBQUk7QUFDN0M7QUFDQTtBQUNBO0FBQ0EsY0FBYzs7Ozs7Ozs7Ozs7QUN2REQ7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7Ozs7Ozs7Ozs7O0FDOUdQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1FQUFtRTtBQUNuRTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhOzs7Ozs7Ozs7OztBQ2JBO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxZQUFZO0FBQ1osa0JBQWtCLG1CQUFPLENBQUMsb0NBQVk7QUFDdEMsZ0JBQWdCLG1CQUFPLENBQUMsZ0NBQVU7QUFDbEMsbUJBQW1CLG1CQUFPLENBQUMsb0RBQW9CO0FBQy9DLGVBQWUsbUJBQU8sQ0FBQyw0Q0FBZ0I7QUFDdkMsdUJBQXVCLG1CQUFPLENBQUMsNERBQXdCO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZOzs7Ozs7Ozs7OztBQzVFQztBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0I7QUFDdEIsa0JBQWtCLG1CQUFPLENBQUMsb0NBQVk7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZGQUE2RixnQkFBZ0I7QUFDN0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLFdBQVc7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7Ozs7Ozs7Ozs7O0FDdkNUO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDLFFBQVE7QUFDckQ7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUI7QUFDakIsa0JBQWtCLG1CQUFPLENBQUMsb0NBQVk7QUFDdEMsZ0JBQWdCLG1CQUFPLENBQUMsZ0NBQVU7QUFDbEMsbUJBQW1CLG1CQUFPLENBQUMsb0RBQW9CO0FBQy9DLGVBQWUsbUJBQU8sQ0FBQyw0Q0FBZ0I7QUFDdkMseUJBQXlCLG1CQUFPLENBQUMsZ0VBQTBCO0FBQzNELHVCQUF1QixtQkFBTyxDQUFDLDREQUF3QjtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7Ozs7Ozs7QUNsREo7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsbUJBQW1CO0FBQ25CLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMscUNBQXFDO0FBQ25ELGNBQWMsOENBQThDO0FBQzVELGNBQWMscUNBQXFDO0FBQ25EO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7OztBQ3JCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxzQkFBc0I7QUFDdEIsc0JBQXNCO0FBQ3RCO0FBQ0E7Ozs7Ozs7Ozs7O0FDTGE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsZ0JBQWdCO0FBQ2hCLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGlCQUFpQjtBQUNqQixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7Ozs7OztBQ3pCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxZQUFZO0FBQ1osWUFBWTtBQUNaO0FBQ0E7QUFDQSxlQUFlLFlBQVk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDs7Ozs7Ozs7Ozs7QUN2Q2E7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsb0JBQW9CO0FBQ3BCLGlCQUFpQixtQkFBTyxDQUFDLGtDQUFXO0FBQ3BDLG9CQUFvQixtQkFBTyxDQUFDLDBEQUF1QjtBQUNuRCxlQUFlLG1CQUFPLENBQUMsZ0RBQWtCO0FBQ3pDLHlCQUF5QixtQkFBTyxDQUFDLG9FQUE0QjtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9COzs7Ozs7O1VDZnBCO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsdUJBQXVCLG1CQUFPLENBQUMsMkRBQXVCO0FBQ3RELGlCQUFpQixtQkFBTyxDQUFDLGlDQUFVO0FBQ25DLHVCQUF1QixtQkFBTyxDQUFDLDZDQUFnQjtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvQUVudGl0eS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQVNjZW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9FbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0lucHV0TWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvTWl4ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL0JhbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL0dhbWVDb250cm9sbGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9QbGF5ZXJCYXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy9ib3hDb2xsaWVkZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21peGlucy9sb2NrZWRPblNjcmVlbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbWl4aW5zL3Bvc2l0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9taXhpbnMvcmVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL0RlZmF1bHRTY2VuZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQUVudGl0eSA9IHZvaWQgMDtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGluaXQoc2NlbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLl9zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLl9lbmdpbmUgPSBlbmdpbmU7XG4gICAgICAgIHRoaXMuZW50aXR5TGlzdC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgICBlbnRpdHkuaW5pdCh0aGlzLCBjYW52YXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYyA9IDEwMDA7XG4gICAgICAgIGNvbnN0IHJhd1dhbGxMaXN0ID0ge1xuICAgICAgICAgICAgdG9wOiBbeyB4OiAtYywgeTogLWMgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiAtYyB9LCB7IHg6IGNhbnZhcy53aWR0aCArIGMsIHk6IDAgfSwgeyB4OiAtYywgeTogMCB9XSxcbiAgICAgICAgICAgIHJpZ2h0OiBbeyB4OiBjYW52YXMud2lkdGgsIHk6IC1jIH0sIHsgeDogY2FudmFzLndpZHRoICsgYywgeTogLWMgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiBjYW52YXMuaGVpZ2h0ICsgYyB9LCB7XG4gICAgICAgICAgICAgICAgICAgIHg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgICAgICAgICAgeTogY2FudmFzLmhlaWdodCArIGNcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGJvdHRvbTogW3sgeDogLWMsIHk6IGNhbnZhcy5oZWlnaHQgfSwgeyB4OiBjYW52YXMud2lkdGggKyBjLCB5OiBjYW52YXMuaGVpZ2h0IH0sIHtcbiAgICAgICAgICAgICAgICAgICAgeDogY2FudmFzLndpZHRoICsgYyxcbiAgICAgICAgICAgICAgICAgICAgeTogY2FudmFzLmhlaWdodCArIGNcbiAgICAgICAgICAgICAgICB9LCB7IHg6IC1jLCB5OiBjYW52YXMuaGVpZ2h0ICsgYyB9XSxcbiAgICAgICAgICAgIGxlZnQ6IFt7IHg6IC1jLCB5OiAtYyB9LCB7IHg6IDAsIHk6IC1jIH0sIHsgeDogMCwgeTogY2FudmFzLmhlaWdodCArIGMgfSwgeyB4OiAtYywgeTogY2FudmFzLmhlaWdodCArIGMgfV0sXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2FsbExpc3QgPSBPYmplY3RcbiAgICAgICAgICAgIC5rZXlzKHJhd1dhbGxMaXN0KVxuICAgICAgICAgICAgLnJlZHVjZSgoYWNjLCBrZXkpID0+IHtcbiAgICAgICAgICAgIGFjY1trZXldID0ge1xuICAgICAgICAgICAgICAgIHZlcnRpY2VzKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmF3V2FsbExpc3Rba2V5XTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGhhc0NvbGxpc2lvbldpdGgodCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIHt9KTtcbiAgICB9XG4gICAgdXBkYXRlKGR0LCBpbnB1dCkge1xuICAgICAgICB2YXIgX2EsIF9iLCBfYywgX2Q7XG4gICAgICAgIGZvciAoY29uc3QgZW50aXR5IG9mIHRoaXMuZW50aXR5TGlzdCkge1xuICAgICAgICAgICAgZW50aXR5LnVwZGF0ZShkdCwgaW5wdXQpO1xuICAgICAgICAgICAgaWYgKCFlbnRpdHkuaXNMb2NrZWRPblNjcmVlbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBlbnRpdHkuaGFzQ29sbGlzaW9uV2l0aCkge1xuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzQ29sbGlzaW9uV2l0aCh0aGlzLndhbGxMaXN0LnRvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5LnkgPSAwICsgKChfYSA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5hbmNob3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS55KSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbGxpc2lvbldpdGgodGhpcy53YWxsTGlzdC5ib3R0b20pKSB7XG4gICAgICAgICAgICAgICAgICAgIGVudGl0eS55XG4gICAgICAgICAgICAgICAgICAgICAgICA9IHRoaXMuX2VuZ2luZS5jYW52YXMuaGVpZ2h0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBlbnRpdHkuaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKChfYiA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5hbmNob3IpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi55KSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbGxpc2lvbldpdGgodGhpcy53YWxsTGlzdC5sZWZ0KSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkueCA9IDAgKyAoKF9jID0gZW50aXR5ID09PSBudWxsIHx8IGVudGl0eSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50aXR5LmFuY2hvcikgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jLngpIHx8IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlbnRpdHkuaGFzQ29sbGlzaW9uV2l0aCh0aGlzLndhbGxMaXN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgICAgICBlbnRpdHkueFxuICAgICAgICAgICAgICAgICAgICAgICAgPSB0aGlzLl9lbmdpbmUuY2FudmFzLndpZHRoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBlbnRpdHkud1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKChfZCA9IGVudGl0eSA9PT0gbnVsbCB8fCBlbnRpdHkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVudGl0eS5hbmNob3IpID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZC54KSB8fCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIC8vIERlZmF1bHQgY2xlYXIgc2NlbmUgYmVmb3JlIGFsbCB0aGUgZW50aXRpZXMgcmVuZGVyZWRcbiAgICAgICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLmVudGl0eUxpc3QpIHtcbiAgICAgICAgICAgIGVudGl0eS5yZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQobmFtZSwgZW50aXR5KSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcFtuYW1lXSA9IGVudGl0eTtcbiAgICB9XG4gICAgcmVtb3ZlKG5hbWUpIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG59XG5leHBvcnRzLkFTY2VuZSA9IEFTY2VuZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FbmdpbmUgPSB2b2lkIDA7XG5jbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZSQU1FX1JBVEUgPSA2MDtcbiAgICB9XG4gICAgZ2V0IGNhbnZhcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbnZhcztcbiAgICB9XG4gICAgZ2V0IGN0eCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N0eDtcbiAgICB9XG4gICAgZ2V0IGlucHV0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faW5wdXQ7XG4gICAgfVxuICAgIHN0YXJ0KGNhbnZhcywgY3R4LCBpbnB1dCwgc2NlbmUpIHtcbiAgICAgICAgdGhpcy5fY2FudmFzID0gY2FudmFzO1xuICAgICAgICB0aGlzLl9jdHggPSBjdHg7XG4gICAgICAgIHRoaXMuX2lucHV0ID0gaW5wdXQ7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZSA9IHNjZW5lO1xuICAgICAgICB0aGlzLl9pbnB1dC5zdGFydCgpO1xuICAgICAgICBzY2VuZS5pbml0KHRoaXMsIGNhbnZhcyk7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIGNoYW5nZVNjZW5lKCkge1xuICAgICAgICAvLyBUT0RPXG4gICAgfVxuICAgIF9nYW1lTG9vcCh0aW1lKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGltZSAtIHRoaXMuX2xhc3RGcmFtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSB0aW1lO1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLmZsb29yKDEwMDAgLyBkZWx0YSk7XG4gICAgICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgTnVtYmVyKE1hdGgucm91bmQoZGVsdGEgLyAoMTAwMCAvIHRoaXMuRlJBTUVfUkFURSkpLnRvRml4ZWQoMikpKTtcbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS51cGRhdGUoZHQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5yZW5kZXIodGhpcy5fY2FudmFzLCB0aGlzLl9jdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy9kZWJ1Z1xuICAgICAgICB0aGlzLl9kZWJ1ZyhkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIC8vIG5leHQgaXRlcmF0aW9uXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aW1lID0+IHRoaXMuX2dhbWVMb29wKHRpbWUpKTtcbiAgICB9XG4gICAgX2RlYnVnKGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICh0aGlzLl9pbnB1dC5hbHRLZXkpIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCAxMjAsIDUwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5mb250ID0gJzE1cHggc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYOKIgiAke2R0fWAsIDEwLCAxNSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDOlDogJHtkZWx0YX1gLCAxMCwgMzAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgZnBzOiAke2Zwc31gLCAxMCwgNDUsIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkVuZ2luZSA9IEVuZ2luZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbnB1dE1hbmFnZXIgPSB2b2lkIDA7XG4vLyBUT0RPIGFkZCBtb3VzZVxuY2xhc3MgSW5wdXRNYW5hZ2VyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxlZnQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5yaWdodCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmRvd24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zcGFjZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICB0aGlzLnZlcnRpY2FsID0gMDtcbiAgICAgICAgdGhpcy5rZXkgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuY29kZSA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5hbHRLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jdHJsS2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWV0YUtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fa2V5RG93bkxpc3RlbmVyID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gZS5rZXk7XG4gICAgICAgICAgICB0aGlzLmNvZGUgPSBlLmNvZGU7XG4gICAgICAgICAgICB0aGlzLmFsdEtleSA9IGUuYWx0S2V5O1xuICAgICAgICAgICAgdGhpcy5jdHJsS2V5ID0gZS5jdHJsS2V5O1xuICAgICAgICAgICAgdGhpcy5tZXRhS2V5ID0gZS5tZXRhS2V5O1xuICAgICAgICAgICAgdGhpcy5zaGlmdEtleSA9IGUuc2hpZnRLZXk7XG4gICAgICAgICAgICBzd2l0Y2ggKGUuY29kZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NwYWNlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGFjZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IC0xO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yaWdodCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93VXAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleVcnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAtMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2tleVVwTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5RCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Vyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLmRvd24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbn1cbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gSW5wdXRNYW5hZ2VyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm1peGluID0gdm9pZCAwO1xuZnVuY3Rpb24gbWl4aW4obWl4SW4sIHJ1bGVzID0gbnVsbCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBkZWNvcmF0b3IoQmFzZSkge1xuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhtaXhJbikuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgICAgICAgIGlmIChydWxlcyB8fCB0eXBlb2YgQmFzZS5wcm90b3R5cGVbbmFtZV0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEJhc2UucHJvdG90eXBlLCAoKHJ1bGVzIHx8IHt9KVtuYW1lXSB8fCBuYW1lKSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtaXhJbiwgbmFtZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIEJhc2U7XG4gICAgfTtcbn1cbmV4cG9ydHMubWl4aW4gPSBtaXhpbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5CYWxsID0gdm9pZCAwO1xuY29uc3QgQUVudGl0eV8xID0gcmVxdWlyZShcIi4uL0FFbnRpdHlcIik7XG5jb25zdCBNaXhlcl8xID0gcmVxdWlyZShcIi4uL01peGVyXCIpO1xuY29uc3QgcG9zaXRpb25fMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvcG9zaXRpb25cIik7XG5jb25zdCByZWN0XzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL3JlY3RcIik7XG5jb25zdCBib3hDb2xsaWVkZXJfMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvYm94Q29sbGllZGVyXCIpO1xubGV0IEJhbGwgPSBjbGFzcyBCYWxsIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNwZWVkID0ge1xuICAgICAgICAgICAgeDogNCxcbiAgICAgICAgICAgIHk6IDQsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGluaXQoc2NlbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0ge1xuICAgICAgICAgICAgeDogTWF0aC5yYW5kb20oKSAqIGNhbnZhcy53aWR0aCxcbiAgICAgICAgICAgIHk6IDIwLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmggPSAxMDtcbiAgICAgICAgdGhpcy53ID0gMTA7XG4gICAgICAgIHRoaXMuYW5jaG9yID0ge1xuICAgICAgICAgICAgeDogNSxcbiAgICAgICAgICAgIHk6IDUsXG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyLmluaXQoc2NlbmUsIGNhbnZhcyk7XG4gICAgICAgIHRoaXMuZ2FtZUNvbnRyb2xsZXIgPSB0aGlzLl9zY2VuZS5nZXQoJ2dhbWVDb250cm9sbGVyJyk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgY29uc3QgcGxheWVyQmFyID0gdGhpcy5fc2NlbmUuZ2V0KCdwbGF5ZXJCYXInKTtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlzaW9uV2l0aCh0aGlzLl9zY2VuZS53YWxsTGlzdC50b3ApKSB7XG4gICAgICAgICAgICB0aGlzLnNwZWVkLnkgKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlzaW9uV2l0aChwbGF5ZXJCYXIpKSB7XG4gICAgICAgICAgICB0aGlzLnkgLT0gNztcbiAgICAgICAgICAgIHRoaXMuc3BlZWQueSAqPSAtMTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNvbnRyb2xsZXIuaW5jcmVhc2VTY29yZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhhc0NvbGxpc2lvbldpdGgodGhpcy5fc2NlbmUud2FsbExpc3QubGVmdCkgfHwgdGhpcy5oYXNDb2xsaXNpb25XaXRoKHRoaXMuX3NjZW5lLndhbGxMaXN0LnJpZ2h0KSkge1xuICAgICAgICAgICAgdGhpcy5zcGVlZC54ICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmhhc0NvbGxpc2lvbldpdGgodGhpcy5fc2NlbmUud2FsbExpc3QuYm90dG9tKSkge1xuICAgICAgICAgICAgdGhpcy5nYW1lQ29udHJvbGxlci5nYW1lT3ZlcigpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnggKz0gdGhpcy5zcGVlZC54LFxuICAgICAgICAgICAgeTogdGhpcy55ICs9IHRoaXMuc3BlZWQueSxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ29yYW5nZSc7XG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgY3R4LmVsbGlwc2UoLi4udGhpcy5ib2R5KHRoaXMucG9zaXRpb24pLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGN0eC5maWxsKCk7XG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKTtcbiAgICB9XG4gICAgc3BlZWRVcCh2YWx1ZSkge1xuICAgICAgICBjb25zdCB2eG0gPSB0aGlzLnNwZWVkLnggLyBNYXRoLmFicyh0aGlzLnNwZWVkLngpO1xuICAgICAgICBjb25zdCB2eW0gPSB0aGlzLnNwZWVkLnkgLyBNYXRoLmFicyh0aGlzLnNwZWVkLnkpO1xuICAgICAgICB0aGlzLnNwZWVkLnggKz0gdmFsdWUueCAqIHZ4bTtcbiAgICAgICAgdGhpcy5zcGVlZC55ICs9IHZhbHVlLnkgKiB2eG07XG4gICAgfVxufTtcbkJhbGwgPSBfX2RlY29yYXRlKFtcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikocG9zaXRpb25fMS5wb3NpdGlvbiksXG4gICAgKDAsIE1peGVyXzEubWl4aW4pKHJlY3RfMS5yZWN0KSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikoYm94Q29sbGllZGVyXzEuYm94Q29sbGlkZXIpXG5dLCBCYWxsKTtcbmV4cG9ydHMuQmFsbCA9IEJhbGw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuR2FtZUNvbnRyb2xsZXIgPSB2b2lkIDA7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vQUVudGl0eVwiKTtcbmNsYXNzIEdhbWVDb250cm9sbGVyIGV4dGVuZHMgQUVudGl0eV8xLkFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLnNjb3JlID0gMDtcbiAgICAgICAgdGhpcy5pc0dhbWVPdmVyID0gZmFsc2U7XG4gICAgfVxuICAgIGluY3JlYXNlU2NvcmUoKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jO1xuICAgICAgICB0aGlzLnNjb3JlICs9IDEwO1xuICAgICAgICBpZiAodGhpcy5zY29yZSA+IDAgJiYgMCA9PT0gdGhpcy5zY29yZSAlIDUwKSB7XG4gICAgICAgICAgICAoX2EgPSB0aGlzLl9zY2VuZS5nZXQoJ3BsYXllckJhcicpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubW92ZVVwKDEwKTtcbiAgICAgICAgICAgIChfYiA9IHRoaXMuX3NjZW5lLmdldCgncGxheWVyQmFyJykpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5pbmNyZWFzZVNwZWVkKDEuNSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2NvcmUgPiAwICYmIDAgPT09IHRoaXMuc2NvcmUgJSAzMCkge1xuICAgICAgICAgICAgKF9jID0gdGhpcy5fc2NlbmUuZ2V0KCdiYWxsJykpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5zcGVlZFVwKHsgeDogMC41LCB5OiAwLjUgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2FtZU92ZXIoKSB7XG4gICAgICAgIHRoaXMuX3NjZW5lLnJlbW92ZSgncGxheWVyQmFyJyk7XG4gICAgICAgIHRoaXMuX3NjZW5lLnJlbW92ZSgnYmFsbCcpO1xuICAgICAgICB0aGlzLmlzR2FtZU92ZXIgPSB0cnVlO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgICAgIGN0eC5mb250ID0gJzMwcHggc2VyaWYnO1xuICAgICAgICBjdHguZmlsbFRleHQoYFNjb3JlOiAke3RoaXMuc2NvcmV9YCwgY2FudmFzLndpZHRoIC0gMTUwLCAyNSwgMTUwKTtcbiAgICAgICAgaWYgKHRoaXMuaXNHYW1lT3Zlcikge1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICdyZWQnO1xuICAgICAgICAgICAgY3R4LmZvbnQgPSAnNjVweCBzZXJpZic7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQoYEdBTUUgT1ZFUmAsIGNhbnZhcy53aWR0aCAvIDIgLSAyMDAsIGNhbnZhcy5oZWlnaHQgLyAyICsgMTApO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5HYW1lQ29udHJvbGxlciA9IEdhbWVDb250cm9sbGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBsYXllckJhciA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9BRW50aXR5XCIpO1xuY29uc3QgTWl4ZXJfMSA9IHJlcXVpcmUoXCIuLi9NaXhlclwiKTtcbmNvbnN0IHBvc2l0aW9uXzEgPSByZXF1aXJlKFwiLi4vbWl4aW5zL3Bvc2l0aW9uXCIpO1xuY29uc3QgcmVjdF8xID0gcmVxdWlyZShcIi4uL21peGlucy9yZWN0XCIpO1xuY29uc3QgbG9ja2VkT25TY3JlZW5fMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvbG9ja2VkT25TY3JlZW5cIik7XG5jb25zdCBib3hDb2xsaWVkZXJfMSA9IHJlcXVpcmUoXCIuLi9taXhpbnMvYm94Q29sbGllZGVyXCIpO1xubGV0IFBsYXllckJhciA9IGNsYXNzIFBsYXllckJhciBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5zcGVlZCA9IDU7XG4gICAgfVxuICAgIGluaXQoc2NlbmUsIGNhbnZhcykge1xuICAgICAgICBzdXBlci5pbml0KHNjZW5lLCBjYW52YXMpO1xuICAgICAgICB0aGlzLnggPSBjYW52YXMud2lkdGggLyAyO1xuICAgICAgICB0aGlzLnkgPSBjYW52YXMuaGVpZ2h0IC0gMTA7XG4gICAgICAgIHRoaXMudyA9IDUwO1xuICAgICAgICB0aGlzLmggPSAxNTtcbiAgICAgICAgdGhpcy5hbmNob3IgPSB7IHg6IHRoaXMudyAvIDIsIHk6IHRoaXMuaCB9O1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIHRoaXMueCArPSBkdCAqIHRoaXMuc3BlZWQgKiBpbnB1dC5ob3Jpem9udGFsO1xuICAgIH1cbiAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICBjdHguZmlsbFJlY3QoLi4udGhpcy5ib2R5KHRoaXMucG9zaXRpb24pKTtcbiAgICB9XG4gICAgbW92ZVVwKHZhbHVlKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy55IC09IHZhbHVlO1xuICAgICAgICB9LCAyMDApO1xuICAgIH1cbiAgICBpbmNyZWFzZVNwZWVkKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3BlZWQgKz0gdmFsdWU7XG4gICAgfVxufTtcblBsYXllckJhciA9IF9fZGVjb3JhdGUoW1xuICAgICgwLCBNaXhlcl8xLm1peGluKShwb3NpdGlvbl8xLnBvc2l0aW9uKSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikocmVjdF8xLnJlY3QpLFxuICAgICgwLCBNaXhlcl8xLm1peGluKShsb2NrZWRPblNjcmVlbl8xLmxvY2tlZE9uU2NyZWVuKSxcbiAgICAoMCwgTWl4ZXJfMS5taXhpbikoYm94Q29sbGllZGVyXzEuYm94Q29sbGlkZXIpXG5dLCBQbGF5ZXJCYXIpO1xuZXhwb3J0cy5QbGF5ZXJCYXIgPSBQbGF5ZXJCYXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYm94Q29sbGlkZXIgPSB2b2lkIDA7XG5leHBvcnRzLmJveENvbGxpZGVyID0ge1xuICAgIHZlcnRpY2VzKCkge1xuICAgICAgICBjb25zdCB0b3BMZWZ0ID0gdGhpcy5zY3J1ZmYodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICB0b3BMZWZ0LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LnggKyB0aGlzLncsIHk6IHRvcExlZnQueSB9LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LnggKyB0aGlzLncsIHk6IHRvcExlZnQueSArIHRoaXMuaCB9LFxuICAgICAgICAgICAgeyB4OiB0b3BMZWZ0LngsIHk6IHRvcExlZnQueSArIHRoaXMuaCB9LFxuICAgICAgICBdO1xuICAgIH0sXG4gICAgaGFzQ29sbGlzaW9uV2l0aCh0YXJnZXQpIHtcbiAgICAgICAgY29uc3QgY3VyclZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcygpO1xuICAgICAgICBjb25zdCB0YXJnZXRWZXJ0aWNlcyA9IHRhcmdldC52ZXJ0aWNlcygpO1xuICAgICAgICByZXR1cm4gY3VyclZlcnRpY2VzWzBdLnggPCB0YXJnZXRWZXJ0aWNlc1sxXS54XG4gICAgICAgICAgICAmJiBjdXJyVmVydGljZXNbMV0ueCA+IHRhcmdldFZlcnRpY2VzWzBdLnhcbiAgICAgICAgICAgICYmIGN1cnJWZXJ0aWNlc1swXS55IDwgdGFyZ2V0VmVydGljZXNbMl0ueVxuICAgICAgICAgICAgJiYgY3VyclZlcnRpY2VzWzJdLnkgPiB0YXJnZXRWZXJ0aWNlc1swXS55O1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmxvY2tlZE9uU2NyZWVuID0gdm9pZCAwO1xuZXhwb3J0cy5sb2NrZWRPblNjcmVlbiA9IHtcbiAgICBpc0xvY2tlZE9uU2NyZWVuOiB0cnVlLFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wb3NpdGlvbiA9IHZvaWQgMDtcbmV4cG9ydHMucG9zaXRpb24gPSB7XG4gICAgX3g6IDAsXG4gICAgX3k6IDAsXG4gICAgZ2V0IHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl94O1xuICAgIH0sXG4gICAgc2V0IHgodmFsdWUpIHtcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0IHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl95O1xuICAgIH0sXG4gICAgc2V0IHkodmFsdWUpIHtcbiAgICAgICAgdGhpcy5feSA9IHZhbHVlO1xuICAgIH0sXG4gICAgZ2V0IHBvc2l0aW9uKCkge1xuICAgICAgICByZXR1cm4geyB4OiB0aGlzLl94LCB5OiB0aGlzLl95IH07XG4gICAgfSxcbiAgICBzZXQgcG9zaXRpb24odmFsdWUpIHtcbiAgICAgICAgdGhpcy5feCA9IHZhbHVlLng7XG4gICAgICAgIHRoaXMuX3kgPSB2YWx1ZS55O1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlY3QgPSB2b2lkIDA7XG5leHBvcnRzLnJlY3QgPSB7XG4gICAgX3c6IDAsXG4gICAgX2g6IDAsXG4gICAgX2FuY2hvcjogeyB4OiAwLCB5OiAwIH0sXG4gICAgc2NydWZmKHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBwb3NpdGlvbi54IC0gdGhpcy5fYW5jaG9yLngsXG4gICAgICAgICAgICB5OiBwb3NpdGlvbi55IC0gdGhpcy5fYW5jaG9yLnksXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBib2R5KHBvc2l0aW9uKSB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgICBwb3NpdGlvbi54IC0gdGhpcy5fYW5jaG9yLngsXG4gICAgICAgICAgICBwb3NpdGlvbi55IC0gdGhpcy5fYW5jaG9yLnksXG4gICAgICAgICAgICB0aGlzLl93LFxuICAgICAgICAgICAgdGhpcy5faCxcbiAgICAgICAgXTtcbiAgICB9LFxuICAgIGdldCB3KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdztcbiAgICB9LFxuICAgIHNldCB3KHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3cgPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldCBoKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faDtcbiAgICB9LFxuICAgIHNldCBoKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2ggPSB2YWx1ZTtcbiAgICB9LFxuICAgIGdldCBhbmNob3IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hbmNob3I7XG4gICAgfSxcbiAgICBzZXQgYW5jaG9yKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX2FuY2hvciA9IHZhbHVlO1xuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IEFTY2VuZV8xID0gcmVxdWlyZShcIi4uL0FTY2VuZVwiKTtcbmNvbnN0IFBsYXllckJhcl8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL1BsYXllckJhclwiKTtcbmNvbnN0IEJhbGxfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9CYWxsXCIpO1xuY29uc3QgR2FtZUNvbnRyb2xsZXJfMSA9IHJlcXVpcmUoXCIuLi9lbnRpdGllcy9HYW1lQ29udHJvbGxlclwiKTtcbmNsYXNzIERlZmF1bHRTY2VuZSBleHRlbmRzIEFTY2VuZV8xLkFTY2VuZSB7XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmFkZCgnZ2FtZUNvbnRyb2xsZXInLCBuZXcgR2FtZUNvbnRyb2xsZXJfMS5HYW1lQ29udHJvbGxlcigpKTtcbiAgICAgICAgdGhpcy5hZGQoJ3BsYXllckJhcicsIG5ldyBQbGF5ZXJCYXJfMS5QbGF5ZXJCYXIoKSk7XG4gICAgICAgIHRoaXMuYWRkKCdiYWxsJywgbmV3IEJhbGxfMS5CYWxsKCkpO1xuICAgICAgICBzdXBlci5pbml0KGVuZ2luZSwgY2FudmFzKTtcbiAgICB9XG59XG5leHBvcnRzLkRlZmF1bHRTY2VuZSA9IERlZmF1bHRTY2VuZTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IERlZmF1bHRTY2VuZV8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0RlZmF1bHRTY2VuZVwiKTtcbmNvbnN0IEVuZ2luZV8xID0gcmVxdWlyZShcIi4vRW5naW5lXCIpO1xuY29uc3QgSW5wdXRNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9JbnB1dE1hbmFnZXJcIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgZGVmYXVsdFNjZW5lID0gbmV3IERlZmF1bHRTY2VuZV8xLkRlZmF1bHRTY2VuZSgpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBlbmdpbmUuc3RhcnQoY2FudmFzLCBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSwgaW5wdXRNYW5hZ2VyLCBkZWZhdWx0U2NlbmUpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=