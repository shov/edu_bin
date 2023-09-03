/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Vector2.ts":
/*!************************!*\
  !*** ./src/Vector2.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector2 = void 0;
class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
exports.Vector2 = Vector2;


/***/ }),

/***/ "./src/Vector3.ts":
/*!************************!*\
  !*** ./src/Vector3.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Vector3 = void 0;
class Vector3 {
    constructor(v, y, z) {
        if (Array.isArray(v)) {
            this.x = v[0];
            this.y = v[1];
            this.z = v[2];
            return;
        }
        if ('object' === typeof v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return;
        }
        this.x = v;
        this.y = y;
        this.z = z;
    }
    add(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x + v, this.y + v, this.z + v);
        }
        if (Array.isArray(v)) {
            return new Vector3(this.x + v[0], this.y + v[1], this.z + v[2]);
        }
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x - v, this.y - v, this.z - v);
        }
        if (Array.isArray(v)) {
            return new Vector3(this.x - v[0], this.y - v[1], this.z - v[2]);
        }
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    scale(n) {
        return this.mul(n);
    }
    mul(v) {
        if (typeof v === 'number') {
            return new Vector3(this.x * v, this.y * v, this.z * v);
        }
        if (Array.isArray(v)) {
            return new Vector3(this.x * v[0], this.y * v[1], this.z * v[2]);
        }
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    div(v) {
        if (typeof v === 'number') {
            if (v === 0)
                throw new Error('Division by zero');
            return new Vector3(this.x / v, this.y / v, this.z / v);
        }
        if (Array.isArray(v)) {
            if (v[0] === 0 || v[1] === 0 || v[2] === 0)
                throw new Error('Division by zero');
            return new Vector3(this.x / v[0], this.y / v[1], this.z / v[2]);
        }
        if (v.x === 0 || v.y === 0 || v.z === 0)
            throw new Error('Division by zero');
        return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z);
    }
    // Math
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    normalize() {
        const length = this.length();
        return length === 0 ? new Vector3(0, 0, 0) : this.div(length);
    }
    // scalar product (dot product)
    // @url https://en.wikipedia.org/wiki/Dot_product
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    // Abstract
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toString() {
        return `Vector3(${this.x}, ${this.y}, ${this.z})`;
    }
}
exports.Vector3 = Vector3;
Vector3.ZERO = new Vector3(0, 0, 0);
Vector3.ONE = new Vector3(1, 1, 1);
Vector3.UP = new Vector3(0, 1, 0);
Vector3.DOWN = new Vector3(0, -1, 0);
Vector3.LEFT = new Vector3(-1, 0, 0);
Vector3.RIGHT = new Vector3(1, 0, 0);
Vector3.FORWARD = new Vector3(0, 0, 1);
Vector3.BACK = new Vector3(0, 0, -1);


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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
const Vector3_1 = __webpack_require__(/*! ./Vector3 */ "./src/Vector3.ts");
const Vector2_1 = __webpack_require__(/*! ./Vector2 */ "./src/Vector2.ts");
window.addEventListener('load', () => {
    // create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        alert('2d context not supported');
        return;
    }
    // create 2d context
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    //camera
    const fov = Math.PI / 2; // field of view
    const distanceToProjectionPlane = (width / 4) / Math.tan(fov / 2); // distance to projection plane
    const objects = [
        [0, 0, 3],
        [-1, -1, 2],
        [1, -1, 2],
        [1, 1, 2],
        [-1, 1, 2],
    ].map(va => new Vector3_1.Vector3(va));
    function project3DTo2D(v) {
        const scale = distanceToProjectionPlane / (v.z + distanceToProjectionPlane);
        const projectedX = (v.x * scale) + (width / 2);
        const projectedY = (-v.y * scale) + (height / 2);
        return new Vector2_1.Vector2(projectedX, projectedY);
    }
    // clear screen
    ctx.clearRect(0, 0, width, height);
    let lastTime = 0;
    // simple game loop (60fps)
    const loop = () => {
        // clear screen
        ctx.clearRect(0, 0, width, height);
        // fill background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        // calculate dt
        const time = performance.now();
        const dt = time - lastTime;
        lastTime = time;
        for (const v3 of objects) {
            const v = project3DTo2D(v3);
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        window.requestAnimationFrame(loop);
    };
    loop();
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUNURjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLE9BQU8sSUFBSSxPQUFPLElBQUksT0FBTztBQUN2RDtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7VUNsR0E7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7OztBQ3RCYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxrQkFBa0IsbUJBQU8sQ0FBQyxtQ0FBVztBQUNyQyxrQkFBa0IsbUJBQU8sQ0FBQyxtQ0FBVztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3Qix1RUFBdUU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3RvcjIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1ZlY3RvcjMudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovLy8uL3NyYy9hcHAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZlY3RvcjIgPSB2b2lkIDA7XG5jbGFzcyBWZWN0b3IyIHtcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufVxuZXhwb3J0cy5WZWN0b3IyID0gVmVjdG9yMjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5WZWN0b3IzID0gdm9pZCAwO1xuY2xhc3MgVmVjdG9yMyB7XG4gICAgY29uc3RydWN0b3IodiwgeSwgeikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgdGhpcy54ID0gdlswXTtcbiAgICAgICAgICAgIHRoaXMueSA9IHZbMV07XG4gICAgICAgICAgICB0aGlzLnogPSB2WzJdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIHYpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgICAgIHRoaXMueSA9IHYueTtcbiAgICAgICAgICAgIHRoaXMueiA9IHYuejtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnggPSB2O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLnogPSB6O1xuICAgIH1cbiAgICBhZGQodikge1xuICAgICAgICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54ICsgdiwgdGhpcy55ICsgdiwgdGhpcy56ICsgdik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKyB2WzBdLCB0aGlzLnkgKyB2WzFdLCB0aGlzLnogKyB2WzJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnksIHRoaXMueiArIHYueik7XG4gICAgfVxuICAgIHN1Yih2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLSB2LCB0aGlzLnkgLSB2LCB0aGlzLnogLSB2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAtIHZbMF0sIHRoaXMueSAtIHZbMV0sIHRoaXMueiAtIHZbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSwgdGhpcy56IC0gdi56KTtcbiAgICB9XG4gICAgc2NhbGUobikge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWwobik7XG4gICAgfVxuICAgIG11bCh2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKiB2LCB0aGlzLnkgKiB2LCB0aGlzLnogKiB2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAqIHZbMF0sIHRoaXMueSAqIHZbMV0sIHRoaXMueiAqIHZbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSwgdGhpcy56ICogdi56KTtcbiAgICB9XG4gICAgZGl2KHYpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKHYgPT09IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaXZpc2lvbiBieSB6ZXJvJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54IC8gdiwgdGhpcy55IC8gdiwgdGhpcy56IC8gdik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgIGlmICh2WzBdID09PSAwIHx8IHZbMV0gPT09IDAgfHwgdlsyXSA9PT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpdmlzaW9uIGJ5IHplcm8nKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLyB2WzBdLCB0aGlzLnkgLyB2WzFdLCB0aGlzLnogLyB2WzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodi54ID09PSAwIHx8IHYueSA9PT0gMCB8fCB2LnogPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpdmlzaW9uIGJ5IHplcm8nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55LCB0aGlzLnogLyB2LnopO1xuICAgIH1cbiAgICAvLyBNYXRoXG4gICAgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMueik7XG4gICAgfVxuICAgIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcbiAgICAgICAgcmV0dXJuIGxlbmd0aCA9PT0gMCA/IG5ldyBWZWN0b3IzKDAsIDAsIDApIDogdGhpcy5kaXYobGVuZ3RoKTtcbiAgICB9XG4gICAgLy8gc2NhbGFyIHByb2R1Y3QgKGRvdCBwcm9kdWN0KVxuICAgIC8vIEB1cmwgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRG90X3Byb2R1Y3RcbiAgICBkb3Qodikge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55ICsgdGhpcy56ICogdi56O1xuICAgIH1cbiAgICAvLyBBYnN0cmFjdFxuICAgIGNsb25lKCkge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54LCB0aGlzLnksIHRoaXMueik7XG4gICAgfVxuICAgIHRvQXJyYXkoKSB7XG4gICAgICAgIHJldHVybiBbdGhpcy54LCB0aGlzLnksIHRoaXMuel07XG4gICAgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gYFZlY3RvcjMoJHt0aGlzLnh9LCAke3RoaXMueX0sICR7dGhpcy56fSlgO1xuICAgIH1cbn1cbmV4cG9ydHMuVmVjdG9yMyA9IFZlY3RvcjM7XG5WZWN0b3IzLlpFUk8gPSBuZXcgVmVjdG9yMygwLCAwLCAwKTtcblZlY3RvcjMuT05FID0gbmV3IFZlY3RvcjMoMSwgMSwgMSk7XG5WZWN0b3IzLlVQID0gbmV3IFZlY3RvcjMoMCwgMSwgMCk7XG5WZWN0b3IzLkRPV04gPSBuZXcgVmVjdG9yMygwLCAtMSwgMCk7XG5WZWN0b3IzLkxFRlQgPSBuZXcgVmVjdG9yMygtMSwgMCwgMCk7XG5WZWN0b3IzLlJJR0hUID0gbmV3IFZlY3RvcjMoMSwgMCwgMCk7XG5WZWN0b3IzLkZPUldBUkQgPSBuZXcgVmVjdG9yMygwLCAwLCAxKTtcblZlY3RvcjMuQkFDSyA9IG5ldyBWZWN0b3IzKDAsIDAsIC0xKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFZlY3RvcjNfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvcjNcIik7XG5jb25zdCBWZWN0b3IyXzEgPSByZXF1aXJlKFwiLi9WZWN0b3IyXCIpO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgLy8gY3JlYXRlIGNhbnZhcyBlbGVtZW50XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgaWYgKCFjdHgpIHtcbiAgICAgICAgYWxlcnQoJzJkIGNvbnRleHQgbm90IHN1cHBvcnRlZCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGNyZWF0ZSAyZCBjb250ZXh0XG4gICAgY29uc3Qgd2lkdGggPSBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICBjb25zdCBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAvL2NhbWVyYVxuICAgIGNvbnN0IGZvdiA9IE1hdGguUEkgLyAyOyAvLyBmaWVsZCBvZiB2aWV3XG4gICAgY29uc3QgZGlzdGFuY2VUb1Byb2plY3Rpb25QbGFuZSA9ICh3aWR0aCAvIDQpIC8gTWF0aC50YW4oZm92IC8gMik7IC8vIGRpc3RhbmNlIHRvIHByb2plY3Rpb24gcGxhbmVcbiAgICBjb25zdCBvYmplY3RzID0gW1xuICAgICAgICBbMCwgMCwgM10sXG4gICAgICAgIFstMSwgLTEsIDJdLFxuICAgICAgICBbMSwgLTEsIDJdLFxuICAgICAgICBbMSwgMSwgMl0sXG4gICAgICAgIFstMSwgMSwgMl0sXG4gICAgXS5tYXAodmEgPT4gbmV3IFZlY3RvcjNfMS5WZWN0b3IzKHZhKSk7XG4gICAgZnVuY3Rpb24gcHJvamVjdDNEVG8yRCh2KSB7XG4gICAgICAgIGNvbnN0IHNjYWxlID0gZGlzdGFuY2VUb1Byb2plY3Rpb25QbGFuZSAvICh2LnogKyBkaXN0YW5jZVRvUHJvamVjdGlvblBsYW5lKTtcbiAgICAgICAgY29uc3QgcHJvamVjdGVkWCA9ICh2LnggKiBzY2FsZSkgKyAod2lkdGggLyAyKTtcbiAgICAgICAgY29uc3QgcHJvamVjdGVkWSA9ICgtdi55ICogc2NhbGUpICsgKGhlaWdodCAvIDIpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjJfMS5WZWN0b3IyKHByb2plY3RlZFgsIHByb2plY3RlZFkpO1xuICAgIH1cbiAgICAvLyBjbGVhciBzY3JlZW5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGxldCBsYXN0VGltZSA9IDA7XG4gICAgLy8gc2ltcGxlIGdhbWUgbG9vcCAoNjBmcHMpXG4gICAgY29uc3QgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgLy8gY2xlYXIgc2NyZWVuXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIC8vIGZpbGwgYmFja2dyb3VuZFxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3doaXRlJztcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICAvLyBjYWxjdWxhdGUgZHRcbiAgICAgICAgY29uc3QgdGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgICBjb25zdCBkdCA9IHRpbWUgLSBsYXN0VGltZTtcbiAgICAgICAgbGFzdFRpbWUgPSB0aW1lO1xuICAgICAgICBmb3IgKGNvbnN0IHYzIG9mIG9iamVjdHMpIHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBwcm9qZWN0M0RUbzJEKHYzKTtcbiAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSAnYmxhY2snO1xuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY3R4LmFyYyh2LngsIHYueSwgNSwgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICAgICAgY3R4LmZpbGwoKTtcbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH07XG4gICAgbG9vcCgpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=