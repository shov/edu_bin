/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/sprite.ts":
/*!**********************************!*\
  !*** ./src/components/sprite.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sprite = exports.EAnchor = void 0;
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const ImageResource_1 = __webpack_require__(/*! ../infrastructure/ImageResource */ "./src/infrastructure/ImageResource.ts");
var EAnchor;
(function (EAnchor) {
    EAnchor[EAnchor["LT"] = 0] = "LT";
    EAnchor[EAnchor["CENTER"] = 1] = "CENTER";
})(EAnchor = exports.EAnchor || (exports.EAnchor = {}));
class SpriteComposition {
    constructor(target, filePath) {
        this.target = target;
        this.filePath = filePath;
        this.size = new Size2_1.Size2(0, 0);
        this.animation = new AnimationComposition();
        this.anchor = EAnchor.CENTER;
        this.offset = Vector2_1.Vector2.zero();
        if ('string' !== typeof filePath || filePath.length < 0) {
            throw new Error(`No sprite file path!`);
        }
        this.target['resourceList'].push(new ImageResource_1.ImageResource(filePath, filePath));
    }
    setAnchor(anchor) {
        this.anchor = anchor;
    }
    render(ctx, dt, delta, fps, position, angle) {
        this.makeSureImage();
        // set offset and size of a current frame
        if (this.animation.isPLayed) {
            const data = this.animation.trackPlayback(dt, delta, fps);
            this.size = data.size;
            this.offset = data.offset;
        }
        const anchor = this.getAnchorOffset();
        if ('number' === typeof angle) {
            ctx.translate(position.x + anchor.x, position.y + anchor.y);
            ctx.rotate(angle);
            ctx.drawImage(this.image, this.offset.x, this.offset.y, this.size.w, this.size.h, anchor.x, anchor.y, this.size.w, this.size.h);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            return;
        }
        ctx.drawImage(this.image, this.offset.x, this.offset.y, this.size.w, this.size.h, position.x + anchor.x, position.y + anchor.y, this.size.w, this.size.h);
    }
    getAnchorOffset() {
        if (EAnchor.LT === this.anchor) {
            return Vector2_1.Vector2.zero();
        }
        return new Vector2_1.Vector2(this.size.w, this.size.h).mul(-0.5);
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
class AnimationComposition {
    constructor() {
        this.isPLayed = false;
        this.animationDict = {};
        this.accDelta = 0;
        this.currFrame = 0;
    }
    addAnimation(a) {
        const animationList = Array.isArray(a) ? a : [a];
        animationList.forEach(a => this.animationDict[a.name] = a);
        return;
    }
    play(name) {
        if ('object' !== typeof this.animationDict[name]) {
            throw new Error(`Cannot play animation ${name}, not found`);
        }
        if (!this.isPLayed || this.playedName !== name) {
            this.isPLayed = true;
            this.playedName = name;
            this.accDelta = 0;
            this.currFrame = 0;
        }
    }
    stop() {
        this.isPLayed = false;
    }
    trackPlayback(dt, delta, fps) {
        if (!this.isPLayed || 'string' !== typeof this.playedName) {
            throw new Error(`Cannot track playback, it's stopped or no name set`);
        }
        const ani = this.animationDict[this.playedName];
        // calculate current frame 
        const timePassed = this.accDelta + delta;
        this.currFrame = (this.currFrame + (timePassed / ani.frameDuration) | 0) % ani.length;
        this.accDelta = timePassed % ani.frameDuration;
        return {
            size: ani.frameSize.clone(),
            offset: ani.firstFrameOffset.add(ani.nextFrameOffset.mul(this.currFrame))
        };
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

/***/ "./src/components/textured.ts":
/*!************************************!*\
  !*** ./src/components/textured.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.textured = void 0;
const ImageResource_1 = __webpack_require__(/*! ../infrastructure/ImageResource */ "./src/infrastructure/ImageResource.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
class TexturedComposiution {
    constructor(target, filePath) {
        this.target = target;
        this.filePath = filePath;
        this.size = new Size2_1.Size2(0, 0); // the same size for source and projection so far
    }
    renderRect(ctx, position, size) {
        const rectSize = size.clone();
        let offset = Vector2_1.Vector2.zero();
        // render rows (if the rest render not a whole row)
        while (rectSize.h > 0) {
            const height = Math.max(size.h, rectSize.h); // full height or the rest
            // render line (if the rest -=-)
            while (rectSize.w > 0) {
                const width = Math.max(size.w, rectSize.w); // full width or the rest
                const drawPos = position.add(offset);
                ctx.drawImage(this.image, 0, 0, width, height, drawPos.x, drawPos.y, width, height);
                rectSize.w -= width;
                offset = offset.add(new Vector2_1.Vector2(width, 0));
            }
            rectSize.h -= height;
            offset = offset.add(new Vector2_1.Vector2(0, height));
        }
    }
    makeSureResourceLoaded() {
        var _a;
        if (!this.image) {
            this.image = (_a = this.target['resourceList'].find(r => r.name === this.filePath)) === null || _a === void 0 ? void 0 : _a.value;
            if (!this.image) {
                throw new Error(`Cannot render a texture for ${this.target.constructor.name}, image ${this.filePath} is not loaded!`);
            }
            if (this.size.w === 0 && this.size.h === 0) { // default to img size
                this.size = new Size2_1.Size2(this.image.width, this.image.height);
            }
        }
    }
}
exports.textured = {
    [addComponent_1.COMPONENT_NAME_SYMBOL]: 'textured',
    [addComponent_1.COMPONENT_CONSTRUCTOR]: function (options) {
        if ('string' !== typeof options.filePath) {
            throw new Error('Cannot load a texture, no file path set');
        }
        this['resourceList'].push(new ImageResource_1.ImageResource(options.filePat, options.filePathh));
        this.textured = new TexturedComposiution(this, options.filePath);
    },
};


/***/ }),

/***/ "./src/entities/Floor.ts":
/*!*******************************!*\
  !*** ./src/entities/Floor.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Floor = void 0;
const textured_1 = __webpack_require__(/*! ../components/textured */ "./src/components/textured.ts");
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
let Floor = class Floor extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.position = Vector2_1.Vector2.zero();
    }
    init(scene) {
        this.size = new Size2_1.Size2(this.scene.frameSize.w, this.scene.frameSize.h);
    }
    render(canvas, ctx, dt, delta, fps) {
        this.textured.renderRect(ctx, this.position, this.size);
    }
};
Floor = __decorate([
    (0, addComponent_1.addComponent)(textured_1.textured, { filePath: 'assetes/floor.png' })
], Floor);
exports.Floor = Floor;


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
var Player_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = void 0;
const sprite_1 = __webpack_require__(/*! ../components/sprite */ "./src/components/sprite.ts");
const AEntity_1 = __webpack_require__(/*! ../infrastructure/AEntity */ "./src/infrastructure/AEntity.ts");
const Size2_1 = __webpack_require__(/*! ../infrastructure/Size2 */ "./src/infrastructure/Size2.ts");
const Vector2_1 = __webpack_require__(/*! ../infrastructure/Vector2 */ "./src/infrastructure/Vector2.ts");
const addComponent_1 = __webpack_require__(/*! ../infrastructure/addComponent */ "./src/infrastructure/addComponent.ts");
var EPlDir;
(function (EPlDir) {
    EPlDir[EPlDir["DOWN"] = 0] = "DOWN";
    EPlDir[EPlDir["RIGHT"] = 1] = "RIGHT";
    EPlDir[EPlDir["UP"] = 2] = "UP";
    EPlDir[EPlDir["LEFT"] = 3] = "LEFT";
})(EPlDir || (EPlDir = {}));
let Player = Player_1 = class Player extends AEntity_1.AEntity {
    constructor() {
        super(...arguments);
        this.walk = 0;
        this.direction = EPlDir.DOWN;
        this.speed = 1;
        this.indleAnimMap = {
            [EPlDir.DOWN]: 'idle_d',
            [EPlDir.RIGHT]: 'idle_r',
            [EPlDir.UP]: 'idle_u',
            [EPlDir.LEFT]: 'idle_l',
        };
        this.walkAnimMap = {
            [EPlDir.DOWN]: 'walk_d',
            [EPlDir.RIGHT]: 'walk_r',
            [EPlDir.UP]: 'walk_u',
            [EPlDir.LEFT]: 'walk_l',
        };
        this.wlakMoveMap = {
            [EPlDir.DOWN]: Vector2_1.Vector2.down(),
            [EPlDir.RIGHT]: Vector2_1.Vector2.right(),
            [EPlDir.UP]: Vector2_1.Vector2.up(),
            [EPlDir.LEFT]: Vector2_1.Vector2.left(),
        };
        this.isHit = false;
        this.subscribedOnInput = false;
    }
    init(scene) {
        super.init(scene);
        this.position = new Vector2_1.Vector2(scene.frameSize.w, scene.frameSize.h).mul(0.5);
        this.sprite.animation.addAnimation([
            {
                name: 'idle_d',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: Vector2_1.Vector2.zero(),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 4,
            },
            {
                name: 'walk_d',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(4),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 2,
            },
            {
                name: 'walk_r',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(6),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 2,
            },
            {
                name: 'idle_r',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(8),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 4,
            },
            {
                name: 'idle_u',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(12),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 4,
            },
            {
                name: 'walk_u',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(16),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 2,
            },
            {
                name: 'walk_l',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(18),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 2,
            },
            {
                name: 'idle_l',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: Player_1.ANIMATION_SPEED,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(20),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 4,
            },
            {
                name: 'hit_r',
                frameSize: new Size2_1.Size2(64, 64),
                frameDuration: 400,
                firstFrameOffset: new Vector2_1.Vector2(64, 0).mul(24 + 1),
                nextFrameOffset: new Vector2_1.Vector2(64, 0),
                length: 1,
            },
        ]);
        this.sprite.animation.play('idle_d');
    }
    update(dt, input) {
        if (!this.subscribedOnInput) {
            input.onKeyDown('KeyW', () => { this.direction = EPlDir.UP; this.walk ^= 8; });
            input.onKeyUp('KeyW', () => { this.walk ^= 8; });
            input.onKeyDown('KeyD', () => { this.direction = EPlDir.RIGHT; this.walk ^= 4; });
            input.onKeyUp('KeyD', () => { this.walk ^= 4; });
            input.onKeyDown('KeyS', () => { this.direction = EPlDir.DOWN; this.walk ^= 2; });
            input.onKeyUp('KeyS', () => { this.walk ^= 2; });
            input.onKeyDown('KeyA', () => { this.direction = EPlDir.LEFT; this.walk ^= 1; });
            input.onKeyUp('KeyA', () => { this.walk ^= 1; });
            input.onKeyDown('Space', () => {
                if (this.isHit) {
                    return;
                }
                this.isHit = true;
                this.sprite.animation.play('hit_r');
                setTimeout(() => {
                    this.sprite.animation.play(this.indleAnimMap[this.direction]);
                }, 300); // idle
                setTimeout(() => {
                    this.isHit = false;
                }, 450); // CD
            });
            input.onKeyUp('Space', () => { });
            this.subscribedOnInput = true;
        }
        // Cannot move or idle while hit
        if (this.isHit) {
            return;
        }
        if (this.walk < 0 || false === (input.up || input.down || input.right || input.left)) { // for anykey guys
            this.walk = 0;
        }
        if (this.walk > 0) {
            this.sprite.animation.play(this.walkAnimMap[this.direction]);
        }
        else {
            this.sprite.animation.play(this.indleAnimMap[this.direction]);
        }
        if (this.walk) {
            this.position = this.position.add(this.wlakMoveMap[this.direction].mul(dt).mul(this.speed));
        }
    }
    render(canvas, ctx, dt, delta, fps) {
        const pos = this.position.clone();
        this.sprite.render(ctx, dt, delta, fps, pos);
    }
};
Player.ANIMATION_SPEED = 400;
Player = Player_1 = __decorate([
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
const MainScene_1 = __webpack_require__(/*! ./MainScene */ "./src/scenes/MainScene.ts");
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
                    this.mainSceneOnLoad = false;
                }
                render(canvas, ctx, dt, delta, fps) {
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, this.scene.frameSize.w, this.scene.frameSize.h);
                    ctx.fillStyle = 'yellow';
                    ctx.font = '40px bold';
                    const mt = ctx.measureText(this.text);
                    ctx.fillText(this.text, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2 - 20);
                }
                update(dt, input) {
                    if (!this.mainSceneOnLoad) {
                        this.mainSceneOnLoad = true;
                        const mainScene = new MainScene_1.MainScene();
                        mainScene.init(engine, canvas).then(ok => {
                            setTimeout(() => engine.changeScene(mainScene), 1000);
                        }).catch(e => {
                            console.error(e);
                        });
                    }
                }
            });
            _super.init.call(this, engine, canvas);
        });
    }
}
exports.LoadingScreen = LoadingScreen;


/***/ }),

/***/ "./src/scenes/MainScene.ts":
/*!*********************************!*\
  !*** ./src/scenes/MainScene.ts ***!
  \*********************************/
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
exports.MainScene = void 0;
const Floor_1 = __webpack_require__(/*! ../entities/Floor */ "./src/entities/Floor.ts");
const Player_1 = __webpack_require__(/*! ../entities/Player */ "./src/entities/Player.ts");
const AScene_1 = __webpack_require__(/*! ../infrastructure/AScene */ "./src/infrastructure/AScene.ts");
class MainScene extends AScene_1.AScene {
    init(engine, canvas) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            this.add('floor', new Floor_1.Floor());
            this.add('player', new Player_1.Player());
            _super.init.call(this, engine, canvas);
        });
    }
}
exports.MainScene = MainScene;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7Ozs7Ozs7Ozs7O0FDM0xQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUMzQyxpQkFBaUIsbUJBQU8sQ0FBQyxvREFBb0I7QUFDN0MsaUJBQWlCLG1CQUFPLENBQUMsZ0VBQTBCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLGlCQUFpQjs7Ozs7OztVQzNCakI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsbUJBQU8sQ0FBQywrREFBeUI7QUFDbEQsdUJBQXVCLG1CQUFPLENBQUMsMkVBQStCO0FBQzlELHdCQUF3QixtQkFBTyxDQUFDLDZEQUF3QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9zcHJpdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvdGV4dHVyZWQudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VudGl0aWVzL0Zsb29yLnRzIiwid2VicGFjazovLy8uL3NyYy9lbnRpdGllcy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZnJhc3RydWN0dXJlL0FSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvQVNjZW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9Db2xsaWRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvRW5naW5lLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9JbWFnZUxvYWRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvSW1hZ2VSZXNvdXJjZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvSW5wdXRNYW5hZ2VyLnRzIiwid2VicGFjazovLy8uL3NyYy9pbmZyYXN0cnVjdHVyZS9TaXplMi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5mcmFzdHJ1Y3R1cmUvYWRkQ29tcG9uZW50LnRzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvTG9hZGluZ1NjcmVlbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL01haW5TY2VuZS50cyIsIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuc3ByaXRlID0gZXhwb3J0cy5FQW5jaG9yID0gdm9pZCAwO1xuY29uc3QgYWRkQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvYWRkQ29tcG9uZW50XCIpO1xuY29uc3QgVmVjdG9yMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1ZlY3RvcjJcIik7XG5jb25zdCBTaXplMl8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL1NpemUyXCIpO1xuY29uc3QgSW1hZ2VSZXNvdXJjZV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0ltYWdlUmVzb3VyY2VcIik7XG52YXIgRUFuY2hvcjtcbihmdW5jdGlvbiAoRUFuY2hvcikge1xuICAgIEVBbmNob3JbRUFuY2hvcltcIkxUXCJdID0gMF0gPSBcIkxUXCI7XG4gICAgRUFuY2hvcltFQW5jaG9yW1wiQ0VOVEVSXCJdID0gMV0gPSBcIkNFTlRFUlwiO1xufSkoRUFuY2hvciA9IGV4cG9ydHMuRUFuY2hvciB8fCAoZXhwb3J0cy5FQW5jaG9yID0ge30pKTtcbmNsYXNzIFNwcml0ZUNvbXBvc2l0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgICAgICB0aGlzLmFuaW1hdGlvbiA9IG5ldyBBbmltYXRpb25Db21wb3NpdGlvbigpO1xuICAgICAgICB0aGlzLmFuY2hvciA9IEVBbmNob3IuQ0VOVEVSO1xuICAgICAgICB0aGlzLm9mZnNldCA9IFZlY3RvcjJfMS5WZWN0b3IyLnplcm8oKTtcbiAgICAgICAgaWYgKCdzdHJpbmcnICE9PSB0eXBlb2YgZmlsZVBhdGggfHwgZmlsZVBhdGgubGVuZ3RoIDwgMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBzcHJpdGUgZmlsZSBwYXRoIWApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0WydyZXNvdXJjZUxpc3QnXS5wdXNoKG5ldyBJbWFnZVJlc291cmNlXzEuSW1hZ2VSZXNvdXJjZShmaWxlUGF0aCwgZmlsZVBhdGgpKTtcbiAgICB9XG4gICAgc2V0QW5jaG9yKGFuY2hvcikge1xuICAgICAgICB0aGlzLmFuY2hvciA9IGFuY2hvcjtcbiAgICB9XG4gICAgcmVuZGVyKGN0eCwgZHQsIGRlbHRhLCBmcHMsIHBvc2l0aW9uLCBhbmdsZSkge1xuICAgICAgICB0aGlzLm1ha2VTdXJlSW1hZ2UoKTtcbiAgICAgICAgLy8gc2V0IG9mZnNldCBhbmQgc2l6ZSBvZiBhIGN1cnJlbnQgZnJhbWVcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uLmlzUExheWVkKSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5hbmltYXRpb24udHJhY2tQbGF5YmFjayhkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgICAgICB0aGlzLnNpemUgPSBkYXRhLnNpemU7XG4gICAgICAgICAgICB0aGlzLm9mZnNldCA9IGRhdGEub2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFuY2hvciA9IHRoaXMuZ2V0QW5jaG9yT2Zmc2V0KCk7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFuZ2xlKSB7XG4gICAgICAgICAgICBjdHgudHJhbnNsYXRlKHBvc2l0aW9uLnggKyBhbmNob3IueCwgcG9zaXRpb24ueSArIGFuY2hvci55KTtcbiAgICAgICAgICAgIGN0eC5yb3RhdGUoYW5nbGUpO1xuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLm9mZnNldC54LCB0aGlzLm9mZnNldC55LCB0aGlzLnNpemUudywgdGhpcy5zaXplLmgsIGFuY2hvci54LCBhbmNob3IueSwgdGhpcy5zaXplLncsIHRoaXMuc2l6ZS5oKTtcbiAgICAgICAgICAgIGN0eC5zZXRUcmFuc2Zvcm0oMSwgMCwgMCwgMSwgMCwgMCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCB0aGlzLm9mZnNldC54LCB0aGlzLm9mZnNldC55LCB0aGlzLnNpemUudywgdGhpcy5zaXplLmgsIHBvc2l0aW9uLnggKyBhbmNob3IueCwgcG9zaXRpb24ueSArIGFuY2hvci55LCB0aGlzLnNpemUudywgdGhpcy5zaXplLmgpO1xuICAgIH1cbiAgICBnZXRBbmNob3JPZmZzZXQoKSB7XG4gICAgICAgIGlmIChFQW5jaG9yLkxUID09PSB0aGlzLmFuY2hvcikge1xuICAgICAgICAgICAgcmV0dXJuIFZlY3RvcjJfMS5WZWN0b3IyLnplcm8oKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHRoaXMuc2l6ZS53LCB0aGlzLnNpemUuaCkubXVsKC0wLjUpO1xuICAgIH1cbiAgICBtYWtlU3VyZUltYWdlKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5pbWFnZSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IChfYSA9IHRoaXMudGFyZ2V0WydyZXNvdXJjZUxpc3QnXS5maW5kKHIgPT4gci5uYW1lID09PSB0aGlzLmZpbGVQYXRoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZhbHVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVuZGVyIHNwcml0ZSBmb3IgJHt0aGlzLnRhcmdldC5jb25zdHJ1Y3Rvci5uYW1lfSwgaW1hZ2UgJHt0aGlzLmZpbGVQYXRofSBpcyBub3QgbG9hZGVkIWApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuY2xhc3MgQW5pbWF0aW9uQ29tcG9zaXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmlzUExheWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRGljdCA9IHt9O1xuICAgICAgICB0aGlzLmFjY0RlbHRhID0gMDtcbiAgICAgICAgdGhpcy5jdXJyRnJhbWUgPSAwO1xuICAgIH1cbiAgICBhZGRBbmltYXRpb24oYSkge1xuICAgICAgICBjb25zdCBhbmltYXRpb25MaXN0ID0gQXJyYXkuaXNBcnJheShhKSA/IGEgOiBbYV07XG4gICAgICAgIGFuaW1hdGlvbkxpc3QuZm9yRWFjaChhID0+IHRoaXMuYW5pbWF0aW9uRGljdFthLm5hbWVdID0gYSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGxheShuYW1lKSB7XG4gICAgICAgIGlmICgnb2JqZWN0JyAhPT0gdHlwZW9mIHRoaXMuYW5pbWF0aW9uRGljdFtuYW1lXSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcGxheSBhbmltYXRpb24gJHtuYW1lfSwgbm90IGZvdW5kYCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzUExheWVkIHx8IHRoaXMucGxheWVkTmFtZSAhPT0gbmFtZSkge1xuICAgICAgICAgICAgdGhpcy5pc1BMYXllZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnBsYXllZE5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5hY2NEZWx0YSA9IDA7XG4gICAgICAgICAgICB0aGlzLmN1cnJGcmFtZSA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5pc1BMYXllZCA9IGZhbHNlO1xuICAgIH1cbiAgICB0cmFja1BsYXliYWNrKGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgIGlmICghdGhpcy5pc1BMYXllZCB8fCAnc3RyaW5nJyAhPT0gdHlwZW9mIHRoaXMucGxheWVkTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgdHJhY2sgcGxheWJhY2ssIGl0J3Mgc3RvcHBlZCBvciBubyBuYW1lIHNldGApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGFuaSA9IHRoaXMuYW5pbWF0aW9uRGljdFt0aGlzLnBsYXllZE5hbWVdO1xuICAgICAgICAvLyBjYWxjdWxhdGUgY3VycmVudCBmcmFtZSBcbiAgICAgICAgY29uc3QgdGltZVBhc3NlZCA9IHRoaXMuYWNjRGVsdGEgKyBkZWx0YTtcbiAgICAgICAgdGhpcy5jdXJyRnJhbWUgPSAodGhpcy5jdXJyRnJhbWUgKyAodGltZVBhc3NlZCAvIGFuaS5mcmFtZUR1cmF0aW9uKSB8IDApICUgYW5pLmxlbmd0aDtcbiAgICAgICAgdGhpcy5hY2NEZWx0YSA9IHRpbWVQYXNzZWQgJSBhbmkuZnJhbWVEdXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNpemU6IGFuaS5mcmFtZVNpemUuY2xvbmUoKSxcbiAgICAgICAgICAgIG9mZnNldDogYW5pLmZpcnN0RnJhbWVPZmZzZXQuYWRkKGFuaS5uZXh0RnJhbWVPZmZzZXQubXVsKHRoaXMuY3VyckZyYW1lKSlcbiAgICAgICAgfTtcbiAgICB9XG59XG5jb25zdCBDT01QT05FTVRfTkFNRSA9ICdzcHJpdGUnO1xuZXhwb3J0cy5zcHJpdGUgPSB7XG4gICAgW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF06IENPTVBPTkVNVF9OQU1FLFxuICAgIFthZGRDb21wb25lbnRfMS5DT01QT05FTlRfQ09OU1RSVUNUT1JdOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICB0aGlzLnNwcml0ZSA9IG5ldyBTcHJpdGVDb21wb3NpdGlvbih0aGlzLCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmlsZVBhdGgpO1xuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudGV4dHVyZWQgPSB2b2lkIDA7XG5jb25zdCBJbWFnZVJlc291cmNlXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvSW1hZ2VSZXNvdXJjZVwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IGFkZENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL2FkZENvbXBvbmVudFwiKTtcbmNsYXNzIFRleHR1cmVkQ29tcG9zaXV0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIGZpbGVQYXRoKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLmZpbGVQYXRoID0gZmlsZVBhdGg7XG4gICAgICAgIHRoaXMuc2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApOyAvLyB0aGUgc2FtZSBzaXplIGZvciBzb3VyY2UgYW5kIHByb2plY3Rpb24gc28gZmFyXG4gICAgfVxuICAgIHJlbmRlclJlY3QoY3R4LCBwb3NpdGlvbiwgc2l6ZSkge1xuICAgICAgICBjb25zdCByZWN0U2l6ZSA9IHNpemUuY2xvbmUoKTtcbiAgICAgICAgbGV0IG9mZnNldCA9IFZlY3RvcjJfMS5WZWN0b3IyLnplcm8oKTtcbiAgICAgICAgLy8gcmVuZGVyIHJvd3MgKGlmIHRoZSByZXN0IHJlbmRlciBub3QgYSB3aG9sZSByb3cpXG4gICAgICAgIHdoaWxlIChyZWN0U2l6ZS5oID4gMCkge1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoc2l6ZS5oLCByZWN0U2l6ZS5oKTsgLy8gZnVsbCBoZWlnaHQgb3IgdGhlIHJlc3RcbiAgICAgICAgICAgIC8vIHJlbmRlciBsaW5lIChpZiB0aGUgcmVzdCAtPS0pXG4gICAgICAgICAgICB3aGlsZSAocmVjdFNpemUudyA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IE1hdGgubWF4KHNpemUudywgcmVjdFNpemUudyk7IC8vIGZ1bGwgd2lkdGggb3IgdGhlIHJlc3RcbiAgICAgICAgICAgICAgICBjb25zdCBkcmF3UG9zID0gcG9zaXRpb24uYWRkKG9mZnNldCk7XG4gICAgICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmltYWdlLCAwLCAwLCB3aWR0aCwgaGVpZ2h0LCBkcmF3UG9zLngsIGRyYXdQb3MueSwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgcmVjdFNpemUudyAtPSB3aWR0aDtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQuYWRkKG5ldyBWZWN0b3IyXzEuVmVjdG9yMih3aWR0aCwgMCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVjdFNpemUuaCAtPSBoZWlnaHQ7XG4gICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQuYWRkKG5ldyBWZWN0b3IyXzEuVmVjdG9yMigwLCBoZWlnaHQpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBtYWtlU3VyZVJlc291cmNlTG9hZGVkKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmICghdGhpcy5pbWFnZSkge1xuICAgICAgICAgICAgdGhpcy5pbWFnZSA9IChfYSA9IHRoaXMudGFyZ2V0WydyZXNvdXJjZUxpc3QnXS5maW5kKHIgPT4gci5uYW1lID09PSB0aGlzLmZpbGVQYXRoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnZhbHVlO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVuZGVyIGEgdGV4dHVyZSBmb3IgJHt0aGlzLnRhcmdldC5jb25zdHJ1Y3Rvci5uYW1lfSwgaW1hZ2UgJHt0aGlzLmZpbGVQYXRofSBpcyBub3QgbG9hZGVkIWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc2l6ZS53ID09PSAwICYmIHRoaXMuc2l6ZS5oID09PSAwKSB7IC8vIGRlZmF1bHQgdG8gaW1nIHNpemVcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUgPSBuZXcgU2l6ZTJfMS5TaXplMih0aGlzLmltYWdlLndpZHRoLCB0aGlzLmltYWdlLmhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLnRleHR1cmVkID0ge1xuICAgIFthZGRDb21wb25lbnRfMS5DT01QT05FTlRfTkFNRV9TWU1CT0xdOiAndGV4dHVyZWQnLFxuICAgIFthZGRDb21wb25lbnRfMS5DT01QT05FTlRfQ09OU1RSVUNUT1JdOiBmdW5jdGlvbiAob3B0aW9ucykge1xuICAgICAgICBpZiAoJ3N0cmluZycgIT09IHR5cGVvZiBvcHRpb25zLmZpbGVQYXRoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBsb2FkIGEgdGV4dHVyZSwgbm8gZmlsZSBwYXRoIHNldCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXNbJ3Jlc291cmNlTGlzdCddLnB1c2gobmV3IEltYWdlUmVzb3VyY2VfMS5JbWFnZVJlc291cmNlKG9wdGlvbnMuZmlsZVBhdCwgb3B0aW9ucy5maWxlUGF0aGgpKTtcbiAgICAgICAgdGhpcy50ZXh0dXJlZCA9IG5ldyBUZXh0dXJlZENvbXBvc2l1dGlvbih0aGlzLCBvcHRpb25zLmZpbGVQYXRoKTtcbiAgICB9LFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5GbG9vciA9IHZvaWQgMDtcbmNvbnN0IHRleHR1cmVkXzEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy90ZXh0dXJlZFwiKTtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9BRW50aXR5XCIpO1xuY29uc3QgU2l6ZTJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9TaXplMlwiKTtcbmNvbnN0IFZlY3RvcjJfMSA9IHJlcXVpcmUoXCIuLi9pbmZyYXN0cnVjdHVyZS9WZWN0b3IyXCIpO1xuY29uc3QgYWRkQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvYWRkQ29tcG9uZW50XCIpO1xubGV0IEZsb29yID0gY2xhc3MgRmxvb3IgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBWZWN0b3IyXzEuVmVjdG9yMi56ZXJvKCk7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zaXplID0gbmV3IFNpemUyXzEuU2l6ZTIodGhpcy5zY2VuZS5mcmFtZVNpemUudywgdGhpcy5zY2VuZS5mcmFtZVNpemUuaCk7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgdGhpcy50ZXh0dXJlZC5yZW5kZXJSZWN0KGN0eCwgdGhpcy5wb3NpdGlvbiwgdGhpcy5zaXplKTtcbiAgICB9XG59O1xuRmxvb3IgPSBfX2RlY29yYXRlKFtcbiAgICAoMCwgYWRkQ29tcG9uZW50XzEuYWRkQ29tcG9uZW50KSh0ZXh0dXJlZF8xLnRleHR1cmVkLCB7IGZpbGVQYXRoOiAnYXNzZXRlcy9mbG9vci5wbmcnIH0pXG5dLCBGbG9vcik7XG5leHBvcnRzLkZsb29yID0gRmxvb3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbnZhciBQbGF5ZXJfMTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyID0gdm9pZCAwO1xuY29uc3Qgc3ByaXRlXzEgPSByZXF1aXJlKFwiLi4vY29tcG9uZW50cy9zcHJpdGVcIik7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvU2l6ZTJcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvVmVjdG9yMlwiKTtcbmNvbnN0IGFkZENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL2FkZENvbXBvbmVudFwiKTtcbnZhciBFUGxEaXI7XG4oZnVuY3Rpb24gKEVQbERpcikge1xuICAgIEVQbERpcltFUGxEaXJbXCJET1dOXCJdID0gMF0gPSBcIkRPV05cIjtcbiAgICBFUGxEaXJbRVBsRGlyW1wiUklHSFRcIl0gPSAxXSA9IFwiUklHSFRcIjtcbiAgICBFUGxEaXJbRVBsRGlyW1wiVVBcIl0gPSAyXSA9IFwiVVBcIjtcbiAgICBFUGxEaXJbRVBsRGlyW1wiTEVGVFwiXSA9IDNdID0gXCJMRUZUXCI7XG59KShFUGxEaXIgfHwgKEVQbERpciA9IHt9KSk7XG5sZXQgUGxheWVyID0gUGxheWVyXzEgPSBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBBRW50aXR5XzEuQUVudGl0eSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIHRoaXMud2FsayA9IDA7XG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gRVBsRGlyLkRPV047XG4gICAgICAgIHRoaXMuc3BlZWQgPSAxO1xuICAgICAgICB0aGlzLmluZGxlQW5pbU1hcCA9IHtcbiAgICAgICAgICAgIFtFUGxEaXIuRE9XTl06ICdpZGxlX2QnLFxuICAgICAgICAgICAgW0VQbERpci5SSUdIVF06ICdpZGxlX3InLFxuICAgICAgICAgICAgW0VQbERpci5VUF06ICdpZGxlX3UnLFxuICAgICAgICAgICAgW0VQbERpci5MRUZUXTogJ2lkbGVfbCcsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMud2Fsa0FuaW1NYXAgPSB7XG4gICAgICAgICAgICBbRVBsRGlyLkRPV05dOiAnd2Fsa19kJyxcbiAgICAgICAgICAgIFtFUGxEaXIuUklHSFRdOiAnd2Fsa19yJyxcbiAgICAgICAgICAgIFtFUGxEaXIuVVBdOiAnd2Fsa191JyxcbiAgICAgICAgICAgIFtFUGxEaXIuTEVGVF06ICd3YWxrX2wnLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLndsYWtNb3ZlTWFwID0ge1xuICAgICAgICAgICAgW0VQbERpci5ET1dOXTogVmVjdG9yMl8xLlZlY3RvcjIuZG93bigpLFxuICAgICAgICAgICAgW0VQbERpci5SSUdIVF06IFZlY3RvcjJfMS5WZWN0b3IyLnJpZ2h0KCksXG4gICAgICAgICAgICBbRVBsRGlyLlVQXTogVmVjdG9yMl8xLlZlY3RvcjIudXAoKSxcbiAgICAgICAgICAgIFtFUGxEaXIuTEVGVF06IFZlY3RvcjJfMS5WZWN0b3IyLmxlZnQoKSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pc0hpdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLnN1YnNjcmliZWRPbklucHV0ID0gZmFsc2U7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgc3VwZXIuaW5pdChzY2VuZSk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoc2NlbmUuZnJhbWVTaXplLncsIHNjZW5lLmZyYW1lU2l6ZS5oKS5tdWwoMC41KTtcbiAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9uLmFkZEFuaW1hdGlvbihbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2lkbGVfZCcsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBWZWN0b3IyXzEuVmVjdG9yMi56ZXJvKCksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3dhbGtfZCcsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLm11bCg0KSxcbiAgICAgICAgICAgICAgICBuZXh0RnJhbWVPZmZzZXQ6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMig2NCwgMCksXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiAyLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBuYW1lOiAnd2Fsa19yJyxcbiAgICAgICAgICAgICAgICBmcmFtZVNpemU6IG5ldyBTaXplMl8xLlNpemUyKDY0LCA2NCksXG4gICAgICAgICAgICAgICAgZnJhbWVEdXJhdGlvbjogUGxheWVyXzEuQU5JTUFUSU9OX1NQRUVELFxuICAgICAgICAgICAgICAgIGZpcnN0RnJhbWVPZmZzZXQ6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMig2NCwgMCkubXVsKDYpLFxuICAgICAgICAgICAgICAgIG5leHRGcmFtZU9mZnNldDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDY0LCAwKSxcbiAgICAgICAgICAgICAgICBsZW5ndGg6IDIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG5hbWU6ICdpZGxlX3InLFxuICAgICAgICAgICAgICAgIGZyYW1lU2l6ZTogbmV3IFNpemUyXzEuU2l6ZTIoNjQsIDY0KSxcbiAgICAgICAgICAgICAgICBmcmFtZUR1cmF0aW9uOiBQbGF5ZXJfMS5BTklNQVRJT05fU1BFRUQsXG4gICAgICAgICAgICAgICAgZmlyc3RGcmFtZU9mZnNldDogbmV3IFZlY3RvcjJfMS5WZWN0b3IyKDY0LCAwKS5tdWwoOCksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2lkbGVfdScsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLm11bCgxMiksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3dhbGtfdScsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLm11bCgxNiksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ3dhbGtfbCcsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLm11bCgxOCksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogMixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2lkbGVfbCcsXG4gICAgICAgICAgICAgICAgZnJhbWVTaXplOiBuZXcgU2l6ZTJfMS5TaXplMig2NCwgNjQpLFxuICAgICAgICAgICAgICAgIGZyYW1lRHVyYXRpb246IFBsYXllcl8xLkFOSU1BVElPTl9TUEVFRCxcbiAgICAgICAgICAgICAgICBmaXJzdEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLm11bCgyMCksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ2hpdF9yJyxcbiAgICAgICAgICAgICAgICBmcmFtZVNpemU6IG5ldyBTaXplMl8xLlNpemUyKDY0LCA2NCksXG4gICAgICAgICAgICAgICAgZnJhbWVEdXJhdGlvbjogNDAwLFxuICAgICAgICAgICAgICAgIGZpcnN0RnJhbWVPZmZzZXQ6IG5ldyBWZWN0b3IyXzEuVmVjdG9yMig2NCwgMCkubXVsKDI0ICsgMSksXG4gICAgICAgICAgICAgICAgbmV4dEZyYW1lT2Zmc2V0OiBuZXcgVmVjdG9yMl8xLlZlY3RvcjIoNjQsIDApLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0pO1xuICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb24ucGxheSgnaWRsZV9kJyk7XG4gICAgfVxuICAgIHVwZGF0ZShkdCwgaW5wdXQpIHtcbiAgICAgICAgaWYgKCF0aGlzLnN1YnNjcmliZWRPbklucHV0KSB7XG4gICAgICAgICAgICBpbnB1dC5vbktleURvd24oJ0tleVcnLCAoKSA9PiB7IHRoaXMuZGlyZWN0aW9uID0gRVBsRGlyLlVQOyB0aGlzLndhbGsgXj0gODsgfSk7XG4gICAgICAgICAgICBpbnB1dC5vbktleVVwKCdLZXlXJywgKCkgPT4geyB0aGlzLndhbGsgXj0gODsgfSk7XG4gICAgICAgICAgICBpbnB1dC5vbktleURvd24oJ0tleUQnLCAoKSA9PiB7IHRoaXMuZGlyZWN0aW9uID0gRVBsRGlyLlJJR0hUOyB0aGlzLndhbGsgXj0gNDsgfSk7XG4gICAgICAgICAgICBpbnB1dC5vbktleVVwKCdLZXlEJywgKCkgPT4geyB0aGlzLndhbGsgXj0gNDsgfSk7XG4gICAgICAgICAgICBpbnB1dC5vbktleURvd24oJ0tleVMnLCAoKSA9PiB7IHRoaXMuZGlyZWN0aW9uID0gRVBsRGlyLkRPV047IHRoaXMud2FsayBePSAyOyB9KTtcbiAgICAgICAgICAgIGlucHV0Lm9uS2V5VXAoJ0tleVMnLCAoKSA9PiB7IHRoaXMud2FsayBePSAyOyB9KTtcbiAgICAgICAgICAgIGlucHV0Lm9uS2V5RG93bignS2V5QScsICgpID0+IHsgdGhpcy5kaXJlY3Rpb24gPSBFUGxEaXIuTEVGVDsgdGhpcy53YWxrIF49IDE7IH0pO1xuICAgICAgICAgICAgaW5wdXQub25LZXlVcCgnS2V5QScsICgpID0+IHsgdGhpcy53YWxrIF49IDE7IH0pO1xuICAgICAgICAgICAgaW5wdXQub25LZXlEb3duKCdTcGFjZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0hpdCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaXNIaXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFuaW1hdGlvbi5wbGF5KCdoaXRfcicpO1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5hbmltYXRpb24ucGxheSh0aGlzLmluZGxlQW5pbU1hcFt0aGlzLmRpcmVjdGlvbl0pO1xuICAgICAgICAgICAgICAgIH0sIDMwMCk7IC8vIGlkbGVcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc0hpdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0sIDQ1MCk7IC8vIENEXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlucHV0Lm9uS2V5VXAoJ1NwYWNlJywgKCkgPT4geyB9KTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlZE9uSW5wdXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENhbm5vdCBtb3ZlIG9yIGlkbGUgd2hpbGUgaGl0XG4gICAgICAgIGlmICh0aGlzLmlzSGl0KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMud2FsayA8IDAgfHwgZmFsc2UgPT09IChpbnB1dC51cCB8fCBpbnB1dC5kb3duIHx8IGlucHV0LnJpZ2h0IHx8IGlucHV0LmxlZnQpKSB7IC8vIGZvciBhbnlrZXkgZ3V5c1xuICAgICAgICAgICAgdGhpcy53YWxrID0gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy53YWxrID4gMCkge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9uLnBsYXkodGhpcy53YWxrQW5pbU1hcFt0aGlzLmRpcmVjdGlvbl0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcHJpdGUuYW5pbWF0aW9uLnBsYXkodGhpcy5pbmRsZUFuaW1NYXBbdGhpcy5kaXJlY3Rpb25dKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy53YWxrKSB7XG4gICAgICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbi5hZGQodGhpcy53bGFrTW92ZU1hcFt0aGlzLmRpcmVjdGlvbl0ubXVsKGR0KS5tdWwodGhpcy5zcGVlZCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICAgICAgY29uc3QgcG9zID0gdGhpcy5wb3NpdGlvbi5jbG9uZSgpO1xuICAgICAgICB0aGlzLnNwcml0ZS5yZW5kZXIoY3R4LCBkdCwgZGVsdGEsIGZwcywgcG9zKTtcbiAgICB9XG59O1xuUGxheWVyLkFOSU1BVElPTl9TUEVFRCA9IDQwMDtcblBsYXllciA9IFBsYXllcl8xID0gX19kZWNvcmF0ZShbXG4gICAgKDAsIGFkZENvbXBvbmVudF8xLmFkZENvbXBvbmVudCkoc3ByaXRlXzEuc3ByaXRlLCB7IGZpbGVQYXRoOiAnYXNzZXRzL2NoZWwucG5nJyB9KVxuXSwgUGxheWVyKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFFbnRpdHkgPSB2b2lkIDA7XG5jb25zdCBhZGRDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2FkZENvbXBvbmVudFwiKTtcbmNsYXNzIEFFbnRpdHkge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUgPSAndW5uYW1lZCcgKyBjcnlwdG8ucmFuZG9tVVVJRCgpKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFnTGlzdCA9IFtdO1xuICAgICAgICB0aGlzLnJlc291cmNlTGlzdCA9IFtdO1xuICAgICAgICAvLyBydW4gbWl4ZWQgY29tcG9uZW50cyBjb25zdHJ1Y3RvcnNcbiAgICAgICAgO1xuICAgICAgICAodGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuZm9yRWFjaCgoY29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgdmFyIF9hLCBfYiwgX2MsIF9kO1xuICAgICAgICAgICAgY29uc3QgY29tcG9uZW50Q29uc3RydWN0b3IgPSAoX2IgPSAoX2EgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnRDb25zdHJ1Y3Rvcikge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSAoX2QgPSAoX2MgPSB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZSkgPT09IG51bGwgfHwgX2MgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVF0pID09PSBudWxsIHx8IF9kID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZFtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICBjb21wb25lbnRDb25zdHJ1Y3Rvci5jYWxsKHRoaXMsIG9wdGlvbnMgfHwge30pO1xuICAgICAgICAgICAgICAgIGlmICh2b2lkIDAgIT09IG9wdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlW2FkZENvbXBvbmVudF8xLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsb2FkKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoUHJvbWlzZS5hbGwodGhpcy5yZXNvdXJjZUxpc3QubWFwKHIgPT4gci5sb2FkKHNjZW5lKSkpKS50aGVuKCk7XG4gICAgfVxuICAgIGluaXQoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IHNjZW5lO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgfVxuICAgIHJlbmRlcihjYW52YXMsIGN0eCwgZHQsIGRlbHRhLCBmcHMpIHtcbiAgICB9XG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5uYW1lKTtcbiAgICB9XG59XG5leHBvcnRzLkFFbnRpdHkgPSBBRW50aXR5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQVJlc291cmNlID0gdm9pZCAwO1xuY2xhc3MgQVJlc291cmNlIHtcbiAgICBnZXQgbmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25hbWU7XG4gICAgfVxuICAgIGdldCB2YWx1ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMuX25hbWUgPSBuYW1lO1xuICAgIH1cbiAgICBsb2FkKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgYmUgaW1wbGVtZW50ZWQhJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQVJlc291cmNlID0gQVJlc291cmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFTY2VuZSA9IHZvaWQgMDtcbmNvbnN0IENvbGxpZGVyXzEgPSByZXF1aXJlKFwiLi9Db2xsaWRlclwiKTtcbmNvbnN0IFNpemUyXzEgPSByZXF1aXJlKFwiLi9TaXplMlwiKTtcbmNvbnN0IEltYWdlTG9hZGVyXzEgPSByZXF1aXJlKFwiLi9JbWFnZUxvYWRlclwiKTtcbmNsYXNzIEFTY2VuZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hcCA9IHt9O1xuICAgICAgICB0aGlzLl90YWdEaWN0ID0ge307IC8vIHRhZyAtPiBuYW1lTGlzdFxuICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwID0ge307XG4gICAgICAgIHRoaXMuaW1hZ2VMb2FkZXIgPSBuZXcgSW1hZ2VMb2FkZXJfMS5JbWFnZUxvYWRlcigpOyAvLyB0b2RvIGFzc2V0IG9yIHJlc291cmNlIGxvYWRlclxuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKDAsIDApO1xuICAgIH1cbiAgICBnZXQgZW50aXR5TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcy5fZW50aXR5TWFwKTtcbiAgICB9XG4gICAgZ2V0IGNvbGxpc2lvbkJvZHlMaXN0KCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzLl9jb2xsaXNpb25Cb2R5TWFwKTtcbiAgICB9XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICB0aGlzLmZyYW1lU2l6ZSA9IG5ldyBTaXplMl8xLlNpemUyKGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIHRoaXMuX2VuZ2luZSA9IGVuZ2luZTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShQcm9taXNlLmFsbCh0aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkubG9hZCh0aGlzKSkpXG4gICAgICAgICAgICAudGhlbigoKSA9PiBQcm9taXNlLmFsbCh0aGlzLmVudGl0eUxpc3QubWFwKGVudGl0eSA9PiBlbnRpdHkuaW5pdCh0aGlzKSkpKSkudGhlbigpO1xuICAgIH1cbiAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgIC8vIENvbGxpc2lvbnNcbiAgICAgICAgY29uc3QgeyBjb3VwbGVMaXN0LCB0YWdNYXAgfSA9IG5ldyBDb2xsaWRlcl8xLkNvbGxpZGVyKHRoaXMuY29sbGlzaW9uQm9keUxpc3QpXG4gICAgICAgICAgICAucHJvY2VzcygpO1xuICAgICAgICBjb3VwbGVMaXN0LmZvckVhY2goKFthLCBiXSkgPT4ge1xuICAgICAgICAgICAgYS5jYWxsQ29sbGlzaW9uKGIpO1xuICAgICAgICAgICAgYi5jYWxsQ29sbGlzaW9uKGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgWy4uLnRhZ01hcC5rZXlzKCldLmZvckVhY2goYiA9PiB7XG4gICAgICAgICAgICBjb25zdCBvbmVUYWdCcmFuY2ggPSB0YWdNYXAuZ2V0KGIpO1xuICAgICAgICAgICAgT2JqZWN0LmtleXMob25lVGFnQnJhbmNoKS5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgYi5jYWxsVGFnQ29sbGlzaW9uKHRhZywgb25lVGFnQnJhbmNoW3RhZ10pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBVcGRhdGVcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkudXBkYXRlKGR0LCBpbnB1dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICAvLyBEZWZhdWx0IGNsZWFyIHNjZW5lIGJlZm9yZSBhbGwgdGhlIGVudGl0aWVzIHJlbmRlcmVkXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRpdHkgb2YgdGhpcy5lbnRpdHlMaXN0KSB7XG4gICAgICAgICAgICBlbnRpdHkucmVuZGVyKGNhbnZhcywgY3R4LCBkdCwgZGVsdGEsIGZwcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKC4uLmFyZ3MpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBsZXQgbmFtZTtcbiAgICAgICAgbGV0IGVudGl0eTtcbiAgICAgICAgaWYgKGFyZ3MubGVuZ3RoID4gMSAmJiAnc3RyaW5nJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIG5hbWUgPSBhcmdzWzBdO1xuICAgICAgICAgICAgZW50aXR5ID0gYXJnc1sxXTtcbiAgICAgICAgICAgIGVudGl0eS5uYW1lID0gbmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVudGl0eSA9IGFyZ3NbMF07XG4gICAgICAgICAgICBuYW1lID0gZW50aXR5Lm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZW50aXR5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICAvLyBUYWdzXG4gICAgICAgIGVudGl0eS50YWdMaXN0LmZvckVhY2godGFnID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgIChfYSA9IChfYiA9IHRoaXMuX3RhZ0RpY3QpW3RhZ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IChfYlt0YWddID0gW10pO1xuICAgICAgICAgICAgdGhpcy5fdGFnRGljdFt0YWddLnB1c2gobmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBDb2xsaXNpb25zXG4gICAgICAgIGlmICgoX2EgPSBlbnRpdHkgPT09IG51bGwgfHwgZW50aXR5ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlbnRpdHkuY29tcG9uZW50TGlzdCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmluY2x1ZGVzKCdib3hDb2xsaWRlcicpKSB7XG4gICAgICAgICAgICB0aGlzLl9jb2xsaXNpb25Cb2R5TWFwW25hbWVdID0gZW50aXR5O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZShuYW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fZW50aXR5TWFwW25hbWVdKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLl9lbnRpdHlNYXBbbmFtZV0udGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICB0aGlzLl90YWdEaWN0W3RhZ10gPSB0aGlzLl90YWdEaWN0W3RhZ10uZmlsdGVyKGVudGl0eU5hbWUgPT4gZW50aXR5TmFtZSAhPT0gbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBkZWxldGUgdGhpcy5fZW50aXR5TWFwW25hbWVdO1xuICAgICAgICBkZWxldGUgdGhpcy5fY29sbGlzaW9uQm9keU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hcFtuYW1lXTtcbiAgICB9XG4gICAgZmluZEJ5VGFnKHRhZykge1xuICAgICAgICByZXR1cm4gKHRoaXMuX3RhZ0RpY3RbdGFnXSB8fCBbXSkubWFwKG5hbWUgPT4gdGhpcy5nZXQobmFtZSkpO1xuICAgIH1cbn1cbmV4cG9ydHMuQVNjZW5lID0gQVNjZW5lO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkNvbGxpZGVyID0gdm9pZCAwO1xuY2xhc3MgQ29sbGlkZXIge1xuICAgIGNvbnN0cnVjdG9yKF9ib2R5TGlzdCkge1xuICAgICAgICB0aGlzLl9ib2R5TGlzdCA9IF9ib2R5TGlzdDtcbiAgICB9XG4gICAgcHJvY2VzcygpIHtcbiAgICAgICAgY29uc3Qgb3BlbkZpcnN0T3JkZXIgPSBbJ29wZW4nLCAnY2xvc2UnXTsgLy8gaWYgdHdvIGZpZ3VyZXMgc3RheSBvbiBvbmUgbGluZSB0aGV5IG11c3QgY3Jvc3NcbiAgICAgICAgY29uc3QgeFJlZkxpc3QgPSB0aGlzLl9ib2R5TGlzdC5yZWR1Y2UoKGFjYywgYikgPT4ge1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54LCBwb3M6ICdvcGVuJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgYWNjLnB1c2goeyB2OiBiLnNjcnVmZi54ICsgYi5zaXplLncsIHBvczogJ2Nsb3NlJywgcmVmOiBiIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgW10pLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhLnYgLSBiLnYgfHwgKG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYS5wb3MpIC0gb3BlbkZpcnN0T3JkZXIuaW5kZXhPZihiLnBvcykpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgeENhbmRpZGF0ZVBhdGhNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGxldCBjdXJyT3Blbk1hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeFJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBwYWlyIHdpdGggYWxsIG9wZW5cbiAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgICAgWy4uLmN1cnJPcGVuTWFwLnZhbHVlcygpXS5mb3JFYWNoKG9wZW5DciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2ggYm90aC1kaXJlY3Rpb24gcGF0aHNcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KGNyLnJlZiwgKHhDYW5kaWRhdGVQYXRoTWFwLmdldChjci5yZWYpIHx8IG5ldyBTZXQoKSkuYWRkKG9wZW5Dci5yZWYpKTtcbiAgICAgICAgICAgICAgICAgICAgeENhbmRpZGF0ZVBhdGhNYXAuc2V0KG9wZW5Dci5yZWYsICh4Q2FuZGlkYXRlUGF0aE1hcC5nZXQob3BlbkNyLnJlZikgfHwgbmV3IFNldCgpKS5hZGQoY3IucmVmKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IG9wZW4gaXRzZWxmXG4gICAgICAgICAgICAgICAgY3Vyck9wZW5NYXAuc2V0KGNyLnJlZiwgY3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY2xvc2VcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5kZWxldGUoY3IucmVmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHlSZWZMaXN0ID0gdGhpcy5fYm9keUxpc3QucmVkdWNlKChhY2MsIGIpID0+IHtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSwgcG9zOiAnb3BlbicsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIGFjYy5wdXNoKHsgdjogYi5zY3J1ZmYueSArIGIuc2l6ZS5oLCBwb3M6ICdjbG9zZScsIHJlZjogYiB9KTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sIFtdKS5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYS52IC0gYi52IHx8IChvcGVuRmlyc3RPcmRlci5pbmRleE9mKGEucG9zKSAtIG9wZW5GaXJzdE9yZGVyLmluZGV4T2YoYi5wb3MpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGN1cnJPcGVuTWFwID0gbmV3IE1hcCgpO1xuICAgICAgICBjb25zdCBjb3VwbGVMaXN0ID0gW107XG4gICAgICAgIGNvbnN0IHRhZ01hcCA9IG5ldyBNYXAoKTtcbiAgICAgICAgeVJlZkxpc3QuZm9yRWFjaChjciA9PiB7XG4gICAgICAgICAgICBpZiAoY3IucG9zID09PSAnb3BlbicpIHtcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBleGlzdGluZyBjb2xsaXNpb25zIGJ5IHggKG9uZSBkaXJlY3Rpb24gaXMgZW5vdWdoKVxuICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgICBbLi4uY3Vyck9wZW5NYXAudmFsdWVzKCldLmZvckVhY2gob3BlbkNyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeFJvb3QgPSB4Q2FuZGlkYXRlUGF0aE1hcC5nZXQoY3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHhSb290ICYmIHhSb290LmhhcyhvcGVuQ3IucmVmKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY291cGxlTGlzdC5wdXNoKFtjci5yZWYsIG9wZW5Dci5yZWZdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhZ0RpY3QgPSAodGFnTWFwLmdldChjci5yZWYpIHx8IHt9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wZW5Dci5yZWYudGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChfYSA9IHRhZ0RpY3RbdGFnXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKHRhZ0RpY3RbdGFnXSA9IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdEaWN0W3RhZ10ucHVzaChvcGVuQ3IucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRhZ0RpY3QpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YWdNYXAuc2V0KGNyLnJlZiwgdGFnRGljdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBzZXQgb3BlbiBpdHNlbGZcbiAgICAgICAgICAgICAgICBjdXJyT3Blbk1hcC5zZXQoY3IucmVmLCBjcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjbG9zZVxuICAgICAgICAgICAgICAgIGN1cnJPcGVuTWFwLmRlbGV0ZShjci5yZWYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHsgY291cGxlTGlzdCwgdGFnTWFwIH07XG4gICAgfVxufVxuZXhwb3J0cy5Db2xsaWRlciA9IENvbGxpZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRW5naW5lID0gdm9pZCAwO1xuY2xhc3MgRW5naW5lIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GUkFNRV9SQVRFID0gNjA7XG4gICAgICAgIHRoaXMuaXNEZWJ1Z09uID0gZmFsc2U7XG4gICAgfVxuICAgIGdldCBjYW52YXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jYW52YXM7XG4gICAgfVxuICAgIGdldCBjdHgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdHg7XG4gICAgfVxuICAgIGdldCBpbnB1dCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgIH1cbiAgICBzdGFydChjYW52YXMsIGN0eCwgaW5wdXQsIHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLl9jYW52YXMgPSBjYW52YXM7XG4gICAgICAgICAgICB0aGlzLl9jdHggPSBjdHg7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dCA9IGlucHV0O1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gc2NlbmU7XG4gICAgICAgICAgICB0aGlzLl9pbnB1dC5vbktleURvd24oJ0tleUcnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0RlYnVnT24gPSAhdGhpcy5pc0RlYnVnT247XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0LnN0YXJ0KCk7XG4gICAgICAgICAgICB5aWVsZCBQcm9taXNlLnJlc29sdmUoc2NlbmUuaW5pdCh0aGlzLCBjYW52YXMpKTtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRpbWUgPT4gdGhpcy5fZ2FtZUxvb3AodGltZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hhbmdlU2NlbmUoc2NlbmUpIHtcbiAgICAgICAgdGhpcy5fY3VycmVudFNjZW5lID0gc2NlbmU7XG4gICAgfVxuICAgIF9nYW1lTG9vcCh0aW1lKSB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGltZSAtIHRoaXMuX2xhc3RGcmFtZVRpbWU7XG4gICAgICAgIHRoaXMuX2xhc3RGcmFtZVRpbWUgPSB0aW1lO1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLmZsb29yKDEwMDAgLyBkZWx0YSk7XG4gICAgICAgIGNvbnN0IGR0ID0gTWF0aC5tYXgoMCwgTnVtYmVyKE1hdGgucm91bmQoZGVsdGEgLyAoMTAwMCAvIHRoaXMuRlJBTUVfUkFURSkpLnRvRml4ZWQoMikpKTtcbiAgICAgICAgLy8gaW5wdXRcbiAgICAgICAgdGhpcy5faW5wdXQudXBkYXRlKGR0KTtcbiAgICAgICAgLy8gdXBkYXRlXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS51cGRhdGUoZHQsIHRoaXMuX2lucHV0KTtcbiAgICAgICAgLy8gcmVuZGVyXG4gICAgICAgIHRoaXMuX2N1cnJlbnRTY2VuZS5yZW5kZXIodGhpcy5fY2FudmFzLCB0aGlzLl9jdHgsIGR0LCBkZWx0YSwgZnBzKTtcbiAgICAgICAgLy8gZGVidWdcbiAgICAgICAgdGhpcy5fZGVidWcoZHQsIGRlbHRhLCBmcHMpO1xuICAgICAgICAvLyBuZXh0IGl0ZXJhdGlvblxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGltZSA9PiB0aGlzLl9nYW1lTG9vcCh0aW1lKSk7XG4gICAgfVxuICAgIF9kZWJ1ZyhkdCwgZGVsdGEsIGZwcykge1xuICAgICAgICBpZiAodGhpcy5pc0RlYnVnT24pIHtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCAxMjAsIDg1KTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5mb250ID0gJzE1cHggc2VyaWYnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LnN0cm9rZVRleHQoYOKIgiAke2R0fWAsIDEwLCAxNSwgMTAwKTtcbiAgICAgICAgICAgIHRoaXMuX2N0eC5zdHJva2VUZXh0KGDOlDogJHtkZWx0YX1gLCAxMCwgMzAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgZnBzOiAke2Zwc31gLCAxMCwgNDUsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgb2JqLmNvdW50OiAke3RoaXMuX2N1cnJlbnRTY2VuZS5lbnRpdHlMaXN0Lmxlbmd0aH1gLCAxMCwgNjAsIDEwMCk7XG4gICAgICAgICAgICB0aGlzLl9jdHguc3Ryb2tlVGV4dChgaW4gSCxWOiAke3RoaXMuX2lucHV0Lmhvcml6b250YWwudG9GaXhlZCgyKX0sJHt0aGlzLmlucHV0LnZlcnRpY2FsLnRvRml4ZWQoMil9YCwgMTAsIDc1LCAxMDApO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5FbmdpbmUgPSBFbmdpbmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbWFnZUxvYWRlciA9IHZvaWQgMDtcbmNsYXNzIEltYWdlTG9hZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fbWFwID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICBsb2FkKG5hbWUsIHNyYykge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyLCBqKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcbiAgICAgICAgICAgICAgICBpbWcub25lcnJvciA9IGo7XG4gICAgICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwLnNldChuYW1lLCBpbWcpO1xuICAgICAgICAgICAgICAgICAgICByKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZGVsZXRlKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fbWFwLmRlbGV0ZShuYW1lKTtcbiAgICB9XG4gICAgZ2V0KG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hcC5nZXQobmFtZSk7XG4gICAgfVxufVxuZXhwb3J0cy5JbWFnZUxvYWRlciA9IEltYWdlTG9hZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW1hZ2VSZXNvdXJjZSA9IHZvaWQgMDtcbmNvbnN0IEFSZXNvdXJjZV8xID0gcmVxdWlyZShcIi4vQVJlc291cmNlXCIpO1xuY2xhc3MgSW1hZ2VSZXNvdXJjZSBleHRlbmRzIEFSZXNvdXJjZV8xLkFSZXNvdXJjZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgZmlsZVBhdGgpIHtcbiAgICAgICAgc3VwZXIobmFtZSk7XG4gICAgICAgIHRoaXMuZmlsZVBhdGggPSBmaWxlUGF0aDtcbiAgICB9XG4gICAgbG9hZChzY2VuZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgbG9hZGVkID0gc2NlbmUuaW1hZ2VMb2FkZXIuZ2V0KHRoaXMubmFtZSk7XG4gICAgICAgICAgICBpZiAoIWxvYWRlZCkge1xuICAgICAgICAgICAgICAgIHlpZWxkIHNjZW5lLmltYWdlTG9hZGVyLmxvYWQodGhpcy5uYW1lLCB0aGlzLmZpbGVQYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3ZhbHVlID0gc2NlbmUuaW1hZ2VMb2FkZXIuZ2V0KHRoaXMubmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuSW1hZ2VSZXNvdXJjZSA9IEltYWdlUmVzb3VyY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuSW5wdXRNYW5hZ2VyID0gdm9pZCAwO1xuLy8gVE9ETyBhZGQgbW91c2VcbmNsYXNzIElucHV0TWFuYWdlciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMudXAgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sZWZ0ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucmlnaHQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5kb3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuc3BhY2UgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gMDtcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IDA7XG4gICAgICAgIHRoaXMua2V5ID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmNvZGUgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuYWx0S2V5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMuY3RybEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1ldGFLZXkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5zaGlmdEtleSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3REb3duID0ge307XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RVcCA9IHt9O1xuICAgICAgICB0aGlzLl9rZXlEb3duTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlBJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sZWZ0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaG9yaXpvbnRhbCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhkZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5RCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGllO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsIDwgMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52ZGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnZlcnRpY2FsID4gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZSA9IHRoaXMuX2F4aXNUYWJsZS52aWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgO1xuICAgICAgICAgICAgKHRoaXMuX3N1YnNjcmlwdGlvbkRpY3REb3duW2UuY29kZV0gfHwgW10pLmZvckVhY2goY2IgPT4gY2IoKSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2tleVVwTGlzdGVuZXIgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBlLmtleTtcbiAgICAgICAgICAgIHRoaXMuY29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgIHRoaXMuYWx0S2V5ID0gZS5hbHRLZXk7XG4gICAgICAgICAgICB0aGlzLmN0cmxLZXkgPSBlLmN0cmxLZXk7XG4gICAgICAgICAgICB0aGlzLm1ldGFLZXkgPSBlLm1ldGFLZXk7XG4gICAgICAgICAgICB0aGlzLnNoaWZ0S2V5ID0gZS5zaGlmdEtleTtcbiAgICAgICAgICAgIHN3aXRjaCAoZS5jb2RlKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnU3BhY2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwYWNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5QSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGVmdCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMucmlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJySG9yaXpvbnRhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUuaGl6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93UmlnaHQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0tleUQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1VwJzpcbiAgICAgICAgICAgICAgICBjYXNlICdLZXlXJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuZG93bikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93RG93bic6XG4gICAgICAgICAgICAgICAgY2FzZSAnS2V5Uyc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZG93biA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMudXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2F4aXNDdXJyVmVydGljYWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLnZkejtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDtcbiAgICAgICAgICAgICh0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXBbZS5jb2RlXSB8fCBbXSkuZm9yRWFjaChjYiA9PiBjYigpKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5heGlzU2Vuc2l0aXZpdHkgPSAxIC8gMTA7XG4gICAgICAgIHRoaXMuX2F4aXNUYWJsZSA9IHtcbiAgICAgICAgICAgIGhpZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMCA/IDAgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhkZTogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMuaG9yaXpvbnRhbCAtIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPD0gLTEgPyAtMSA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGR6OiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy5ob3Jpem9udGFsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdmllOiAoZHQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gdGhpcy52ZXJ0aWNhbCArIGR0ICogdGhpcy5heGlzU2Vuc2l0aXZpdHk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHYgPj0gMSA/IDEgOiB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHZpejogKGR0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdiA9IHRoaXMudmVydGljYWwgKyBkdCAqIHRoaXMuYXhpc1NlbnNpdGl2aXR5O1xuICAgICAgICAgICAgICAgIHJldHVybiB2ID49IDAgPyAwIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZGU6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAtMSA/IC0xIDogdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB2ZHo6IChkdCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSB0aGlzLnZlcnRpY2FsIC0gZHQgKiB0aGlzLmF4aXNTZW5zaXRpdml0eTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdiA8PSAwID8gMCA6IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9heGlzQ3Vyckhvcml6b250YWxNb3ZlID0gdGhpcy5fYXhpc1RhYmxlLmhpejtcbiAgICAgICAgdGhpcy5fYXhpc0N1cnJWZXJ0aWNhbE1vdmUgPSB0aGlzLl9heGlzVGFibGUudml6O1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0YXJ0ZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLl9rZXlEb3duTGlzdGVuZXIpO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuX2tleVVwTGlzdGVuZXIpO1xuICAgICAgICB0aGlzLl9zdGFydGVkID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RvcCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdGFydGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5fa2V5RG93bkxpc3RlbmVyKTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLl9rZXlVcExpc3RlbmVyKTtcbiAgICAgICAgdGhpcy5fc3RhcnRlZCA9IGZhbHNlO1xuICAgIH1cbiAgICB1cGRhdGUoZHQpIHtcbiAgICAgICAgdGhpcy5ob3Jpem9udGFsID0gdGhpcy5fYXhpc0N1cnJIb3Jpem9udGFsTW92ZShkdCk7XG4gICAgICAgIHRoaXMudmVydGljYWwgPSB0aGlzLl9heGlzQ3VyclZlcnRpY2FsTW92ZShkdCk7XG4gICAgfVxuICAgIG9uS2V5RG93bihjb2RlLCBjYikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgKF9hID0gKF9iID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdERvd24pW2NvZGVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiAoX2JbY29kZV0gPSBbXSk7XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3REb3duW2NvZGVdLnB1c2goY2IpO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZUtleURvd24oY29kZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpcHRpb25EaWN0RG93bltjb2RlXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdGhpcy5fc3Vic2NyaXB0aW9uRGljdERvd25bY29kZV0gPSB0aGlzLl9zdWJzY3JpcHRpb25EaWN0RG93bltjb2RlXS5maWx0ZXIobGlzdGVuZXIgPT4gbGlzdGVuZXIgIT09IGNiKTtcbiAgICB9XG4gICAgb25LZXlVcChjb2RlLCBjYikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgKF9hID0gKF9iID0gdGhpcy5fc3Vic2NyaXB0aW9uRGljdFVwKVtjb2RlXSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9iW2NvZGVdID0gW10pO1xuICAgICAgICB0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXBbY29kZV0ucHVzaChjYik7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlS2V5VXAoY29kZSwgY2IpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9zdWJzY3JpcHRpb25EaWN0VXBbY29kZV0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RVcFtjb2RlXSA9IHRoaXMuX3N1YnNjcmlwdGlvbkRpY3RVcFtjb2RlXS5maWx0ZXIobGlzdGVuZXIgPT4gbGlzdGVuZXIgIT09IGNiKTtcbiAgICB9XG59XG5leHBvcnRzLklucHV0TWFuYWdlciA9IElucHV0TWFuYWdlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TaXplMiA9IHZvaWQgMDtcbmNsYXNzIFNpemUyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMudyA9IDA7XG4gICAgICAgIHRoaXMuaCA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLmggPSAnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMV0gPyBhcmdzWzFdIDogYXJnc1swXTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudyA9IGFyZ3NbMF0udztcbiAgICAgICAgICAgIHRoaXMuaCA9IGFyZ3NbMF0uaDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhZGQoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICB0aGlzLncgKz0gc3ViajtcbiAgICAgICAgICAgIHRoaXMuaCArPSBzdWJqO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53ICs9IHN1YmoudztcbiAgICAgICAgdGhpcy5oICs9IHN1YmouaDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG11bChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHRoaXMudyAqPSBzdWJqO1xuICAgICAgICAgICAgdGhpcy5oICo9IHN1Ymo7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLncgKj0gc3Viai53O1xuICAgICAgICB0aGlzLmggKj0gc3Viai5oO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgU2l6ZTIodGhpcyk7XG4gICAgfVxufVxuZXhwb3J0cy5TaXplMiA9IFNpemUyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG5jbGFzcyBWZWN0b3IyIHtcbiAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgIHRoaXMueCA9IDA7XG4gICAgICAgIHRoaXMueSA9IDA7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIGFyZ3NbMF0pIHtcbiAgICAgICAgICAgIHRoaXMueCA9IGFyZ3NbMF07XG4gICAgICAgICAgICB0aGlzLnkgPSBhcmdzWzFdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy54ID0gYXJnc1swXS54O1xuICAgICAgICAgICAgdGhpcy55ID0gYXJnc1swXS55O1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZChzdWJqKSB7XG4gICAgICAgIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHN1YmopIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKyBzdWJqLCB0aGlzLnkgKyBzdWJqKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54ICsgc3Viai54LCB0aGlzLnkgKyBzdWJqLnkpO1xuICAgIH1cbiAgICBzdWIoc3Viaikge1xuICAgICAgICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBzdWJqKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcy54IC0gc3ViaiwgdGhpcy55IC0gc3Viaik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAtIHN1YmoueCwgdGhpcy55IC0gc3Viai55KTtcbiAgICB9XG4gICAgbXVsKHN1YmopIHtcbiAgICAgICAgaWYgKCdudW1iZXInID09PSB0eXBlb2Ygc3Viaikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKHRoaXMueCAqIHN1YmosIHRoaXMueSAqIHN1YmopO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMih0aGlzLnggKiBzdWJqLngsIHRoaXMueSAqIHN1YmoueSk7XG4gICAgfVxuICAgIG1vdmVUbyh0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIubW92ZVRvKHRoaXMsIHRhcmdldCwgc3RlcCk7XG4gICAgfVxuICAgIGRpc3RhbmNlVG8odGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBWZWN0b3IyLmRpc3RhbmNlKHRoaXMsIHRhcmdldCk7XG4gICAgfVxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIodGhpcyk7XG4gICAgfVxuICAgIGVxdWFsKG90aGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IG90aGVyLnggJiYgdGhpcy55ID09PSBvdGhlci55O1xuICAgIH1cbiAgICBzdGF0aWMgdXAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAtMSk7XG4gICAgfVxuICAgIHN0YXRpYyBkb3duKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoMCwgMSk7XG4gICAgfVxuICAgIHN0YXRpYyBsZWZ0KCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjIoLTEsIDApO1xuICAgIH1cbiAgICBzdGF0aWMgcmlnaHQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigxLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIHplcm8oKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMigwLCAwKTtcbiAgICB9XG4gICAgc3RhdGljIG1vdmVUbyhzdWJqZWN0LCB0YXJnZXQsIHN0ZXApIHtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gVmVjdG9yMi5ub3JtYWxpemUodGFyZ2V0LnN1YihzdWJqZWN0KSk7XG4gICAgICAgIHJldHVybiBzdWJqZWN0LmFkZChkaXJlY3Rpb24ubXVsKHN0ZXApKTtcbiAgICB9XG4gICAgc3RhdGljIGRpc3RhbmNlKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIFZlY3RvcjIubGVuKGIuc3ViKGEpKTtcbiAgICB9XG4gICAgc3RhdGljIGxlbihhKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoYS54ICoqIDIgKyBhLnkgKiogMik7XG4gICAgfVxuICAgIHN0YXRpYyBub3JtYWxpemUoYSkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSBWZWN0b3IyLmxlbihhKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IyKGEueCAvIGxlbmd0aCwgYS55IC8gbGVuZ3RoKTtcbiAgICB9XG59XG5leHBvcnRzLlZlY3RvcjIgPSBWZWN0b3IyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFkZENvbXBvbmVudCA9IGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0xBU1RfT1BUSU9OU19ESUNUID0gZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVCA9IGV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SID0gZXhwb3J0cy5DT01QT05FTlRfUkVRVUlSRV9TWU1CT0wgPSBleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTCA9IHZvaWQgMDtcbmNvbnN0IEFFbnRpdHlfMSA9IHJlcXVpcmUoXCIuL0FFbnRpdHlcIik7XG4vLyBUT0RPIEkgYmV0dGVyIHVzZSBSZWZsZWN0b3IgaW5zdGVhZCBvZiBtZXRhIHN5bWJvbHNcbmV4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MID0gU3ltYm9sLmZvcignJGNvbXBvbmVudE5hbWUnKTtcbmV4cG9ydHMuQ09NUE9ORU5UX1JFUVVJUkVfU1lNQk9MID0gU3ltYm9sLmZvcignJGNvbXBvbmVudFJlcXVpcmUnKTtcbmV4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SID0gU3ltYm9sLmZvcignJGNvbXBvbmVudENvbnN0cnVjdG9yJyk7XG5leHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUID0gU3ltYm9sLmZvcignJGNvbXBvbmVudENvbnN0cnVjdG9yRGljdCcpO1xuZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1QgPSBTeW1ib2wuZm9yKCckY29tcG9uZW50Q29uc3RydWN0b3JEaWN0TGFzdE9wdGlvbnNEaWN0Jyk7XG5mdW5jdGlvbiBhZGRDb21wb25lbnQoY29tcG9uZW50LCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGRlY29yYXRvcihCYXNlKSB7XG4gICAgICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcbiAgICAgICAgdmFyIF9lLCBfZiwgX2csIF9oLCBfajtcbiAgICAgICAgLy8gQUVudGl0eSBpcyB0aGUgb25seSB0aGluZyBhIGNvbXBvbmVudCBjYW4gYmUgYXBwbGllZCB0b1xuICAgICAgICBpZiAoQmFzZS5wcm90b3R5cGUgaW5zdGFuY2VvZiBBRW50aXR5XzEuQUVudGl0eSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW5yICR7Y29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXX0gY2Fubm90IGJlIGFwcGxpZWQgdG8gbm9uLUFFbnRpdHktZGVyaXZlZCBjb25zdHJ1Y3Rvci4gUmVqZWN0ZWQgZm9yICR7QmFzZS5uYW1lfWApO1xuICAgICAgICB9XG4gICAgICAgIDtcbiAgICAgICAgKGNvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9SRVFVSVJFX1NZTUJPTF0gfHwgW10pLmZvckVhY2goKHJlcXVpcmVkQ29tcG9uZW50TmFtZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCEoQmFzZS5wcm90b3R5cGUuY29tcG9uZW50TGlzdCB8fCBbXSkuaW5jbHVkZXMocmVxdWlyZWRDb21wb25lbnROYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50ICR7Y29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXX0gcmVxdWlyZXMgJHtyZXF1aXJlZENvbXBvbmVudE5hbWV9LCBidXQgaXQgaGFzbid0IGFwcGxpZWQgdG8gJHtCYXNlLm5hbWV9IHlldGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gJ3J1bGVzJyBpcyBhIHNwZWNpYWwgZ2VuZXJhbCBvcHRpb24gdG8gcmVzb2x2ZSBuYW1pbmcgY29uZmxpdHNcbiAgICAgICAgY29uc3QgcnVsZXMgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMucnVsZXM7XG4gICAgICAgIC8vIGFwcGxpYWJsZSBmb3IgZnVuY3Rpb25zIG9ubHlcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoY29tcG9uZW50KS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgICAgICAgaWYgKCdmdW5jdGlvbicgIT09IHR5cGVvZiBjb21wb25lbnRbbmFtZV0pIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpZ25vcmUgbWl4aW4gY29uc3RydWN0b3IgaWYgbWV0XG4gICAgICAgICAgICBpZiAoZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1IgPT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1c2VyIHJ1bGVzIHRvIHJlc29sdmUgY29uZmxpY3RzXG4gICAgICAgICAgICBpZiAocnVsZXMgfHwgdHlwZW9mIEJhc2UucHJvdG90eXBlW25hbWVdID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShCYXNlLnByb3RvdHlwZSwgKChydWxlcyB8fCB7fSlbbmFtZV0gfHwgbmFtZSksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9uZW50LCBuYW1lKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAoX2EgPSAoX2UgPSBCYXNlLnByb3RvdHlwZSkuY29tcG9uZW50TGlzdCkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogKF9lLmNvbXBvbmVudExpc3QgPSBbXSk7IC8vIFRPRE8gcmVuYW1lIGNvbXBvbmVudExpc3QgdG8gYSBzeW1ib2w/XG4gICAgICAgIEJhc2UucHJvdG90eXBlLmNvbXBvbmVudExpc3QucHVzaChjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfTkFNRV9TWU1CT0xdKTtcbiAgICAgICAgaWYgKCdmdW5jdGlvbicgPT09IHR5cGVvZiBjb21wb25lbnRbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JdKSB7XG4gICAgICAgICAgICAoX2IgPSAoX2YgPSBCYXNlLnByb3RvdHlwZSlbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfRElDVF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IChfZltleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9ESUNUXSA9IHt9KTtcbiAgICAgICAgICAgIChfYyA9IChfZyA9IEJhc2UucHJvdG90eXBlW2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SX0RJQ1RdKVtfaCA9IGNvbXBvbmVudFtleHBvcnRzLkNPTVBPTkVOVF9OQU1FX1NZTUJPTF1dKSAhPT0gbnVsbCAmJiBfYyAhPT0gdm9pZCAwID8gX2MgOiAoX2dbX2hdID0gY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX0NPTlNUUlVDVE9SXSk7XG4gICAgICAgICAgICAoX2QgPSAoX2ogPSBCYXNlLnByb3RvdHlwZSlbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1RdKSAhPT0gbnVsbCAmJiBfZCAhPT0gdm9pZCAwID8gX2QgOiAoX2pbZXhwb3J0cy5DT01QT05FTlRfQ09OU1RSVUNUT1JfTEFTVF9PUFRJT05TX0RJQ1RdID0ge30pO1xuICAgICAgICAgICAgLy8gYW4gYUVudGl0eSBjb25zdHJ1Y3RvciBjbGVhbnMgaXQgdXAgYWZ0ZXIgYSBjb21wb25lbnQgY29uc3J1Y3RvciBjYWxsXG4gICAgICAgICAgICBCYXNlLnByb3RvdHlwZVtleHBvcnRzLkNPTVBPTkVOVF9DT05TVFJVQ1RPUl9MQVNUX09QVElPTlNfRElDVF1bY29tcG9uZW50W2V4cG9ydHMuQ09NUE9ORU5UX05BTUVfU1lNQk9MXV0gPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBCYXNlO1xuICAgIH07XG59XG5leHBvcnRzLmFkZENvbXBvbmVudCA9IGFkZENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkxvYWRpbmdTY3JlZW4gPSB2b2lkIDA7XG5jb25zdCBBRW50aXR5XzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQUVudGl0eVwiKTtcbmNvbnN0IEFTY2VuZV8xID0gcmVxdWlyZShcIi4uL2luZnJhc3RydWN0dXJlL0FTY2VuZVwiKTtcbmNvbnN0IE1haW5TY2VuZV8xID0gcmVxdWlyZShcIi4vTWFpblNjZW5lXCIpO1xuY2xhc3MgTG9hZGluZ1NjcmVlbiBleHRlbmRzIEFTY2VuZV8xLkFTY2VuZSB7XG4gICAgaW5pdChlbmdpbmUsIGNhbnZhcykge1xuICAgICAgICBjb25zdCBfc3VwZXIgPSBPYmplY3QuY3JlYXRlKG51bGwsIHtcbiAgICAgICAgICAgIGluaXQ6IHsgZ2V0OiAoKSA9PiBzdXBlci5pbml0IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB0aGlzLmFkZCgnbG9hZGluZycsIG5ldyBjbGFzcyBleHRlbmRzIEFFbnRpdHlfMS5BRW50aXR5IHtcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gJ0xvYWRpbmcuLi4nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm1haW5TY2VuZU9uTG9hZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZW5kZXIoY2FudmFzLCBjdHgsIGR0LCBkZWx0YSwgZnBzKSB7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5zY2VuZS5mcmFtZVNpemUudywgdGhpcy5zY2VuZS5mcmFtZVNpemUuaCk7XG4gICAgICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAneWVsbG93JztcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZvbnQgPSAnNDBweCBib2xkJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbXQgPSBjdHgubWVhc3VyZVRleHQodGhpcy50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMudGV4dCwgdGhpcy5zY2VuZS5mcmFtZVNpemUudyAvIDIgLSBtdC53aWR0aCAvIDIsIHRoaXMuc2NlbmUuZnJhbWVTaXplLmggLyAyIC0gMjApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1cGRhdGUoZHQsIGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5tYWluU2NlbmVPbkxvYWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubWFpblNjZW5lT25Mb2FkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW5TY2VuZSA9IG5ldyBNYWluU2NlbmVfMS5NYWluU2NlbmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5TY2VuZS5pbml0KGVuZ2luZSwgY2FudmFzKS50aGVuKG9rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGVuZ2luZS5jaGFuZ2VTY2VuZShtYWluU2NlbmUpLCAxMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgX3N1cGVyLmluaXQuY2FsbCh0aGlzLCBlbmdpbmUsIGNhbnZhcyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuTG9hZGluZ1NjcmVlbiA9IExvYWRpbmdTY3JlZW47XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NYWluU2NlbmUgPSB2b2lkIDA7XG5jb25zdCBGbG9vcl8xID0gcmVxdWlyZShcIi4uL2VudGl0aWVzL0Zsb29yXCIpO1xuY29uc3QgUGxheWVyXzEgPSByZXF1aXJlKFwiLi4vZW50aXRpZXMvUGxheWVyXCIpO1xuY29uc3QgQVNjZW5lXzEgPSByZXF1aXJlKFwiLi4vaW5mcmFzdHJ1Y3R1cmUvQVNjZW5lXCIpO1xuY2xhc3MgTWFpblNjZW5lIGV4dGVuZHMgQVNjZW5lXzEuQVNjZW5lIHtcbiAgICBpbml0KGVuZ2luZSwgY2FudmFzKSB7XG4gICAgICAgIGNvbnN0IF9zdXBlciA9IE9iamVjdC5jcmVhdGUobnVsbCwge1xuICAgICAgICAgICAgaW5pdDogeyBnZXQ6ICgpID0+IHN1cGVyLmluaXQgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkKCdmbG9vcicsIG5ldyBGbG9vcl8xLkZsb29yKCkpO1xuICAgICAgICAgICAgdGhpcy5hZGQoJ3BsYXllcicsIG5ldyBQbGF5ZXJfMS5QbGF5ZXIoKSk7XG4gICAgICAgICAgICBfc3VwZXIuaW5pdC5jYWxsKHRoaXMsIGVuZ2luZSwgY2FudmFzKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5NYWluU2NlbmUgPSBNYWluU2NlbmU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBFbmdpbmVfMSA9IHJlcXVpcmUoXCIuL2luZnJhc3RydWN0dXJlL0VuZ2luZVwiKTtcbmNvbnN0IElucHV0TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vaW5mcmFzdHJ1Y3R1cmUvSW5wdXRNYW5hZ2VyXCIpO1xuY29uc3QgTG9hZGluZ1NjcmVlbl8xID0gcmVxdWlyZShcIi4vc2NlbmVzL0xvYWRpbmdTY3JlZW5cIik7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjYW52YXMud2lkdGggPSA2NDA7XG4gICAgY2FudmFzLmhlaWdodCA9IDQ4MDtcbiAgICBjYW52YXMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtYWluLWNhbnZhcycpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290JykuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjb25zdCBpbnB1dE1hbmFnZXIgPSBuZXcgSW5wdXRNYW5hZ2VyXzEuSW5wdXRNYW5hZ2VyKCk7XG4gICAgY29uc3QgbG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nU2NyZWVuXzEuTG9hZGluZ1NjcmVlbigpO1xuICAgIGNvbnN0IGVuZ2luZSA9IG5ldyBFbmdpbmVfMS5FbmdpbmUoKTtcbiAgICBQcm9taXNlLnJlc29sdmUoZW5naW5lLnN0YXJ0KGNhbnZhcywgY2FudmFzLmdldENvbnRleHQoJzJkJyksIGlucHV0TWFuYWdlciwgbG9hZGluZ1NjcmVlbikpLmNhdGNoKGUgPT4gKGNvbnNvbGUuZXJyb3IoZSkpKTtcbn0pO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9