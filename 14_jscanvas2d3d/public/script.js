/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

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
    distance(v) {
        const dX = this.x - v.x;
        const dY = this.y - v.y;
        return Math.sqrt(dX * dX + dY * dY);
    }
    direction(v) {
        return v.sub(this).normalize();
    }
    // vector product (cross product)
    // it is a binary operation on two vectors in three-dimensional space
    // that results in another vector which is perpendicular to the plane
    cross(v) {
        return new Vector3(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
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
let width;
let height;
//camera
var camera = {
    pos: new Vector3_1.Vector3(0, 0, 0),
    rotation: new Vector3_1.Vector3(0, 0, -1),
    fov: Math.PI / 2,
};
var sphere = {
    center: new Vector3_1.Vector3(0, 0, 5),
    radius: 1,
};
var lightPos = new Vector3_1.Vector3(2, 2, 10);
window.addEventListener('load', () => {
    // create canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        alert('2d context not supported');
        return;
    }
    // create 2d context
    width = canvas.width = 640;
    height = canvas.height = 480;
    document.body.appendChild(canvas);
    // clear screen
    ctx.clearRect(0, 0, width, height);
    let lastTime = 0;
    // simple game loop (60fps)
    const loop = () => {
        // clear screen
        ctx.clearRect(0, 0, width, height);
        // fill white
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        // calculate dt
        const time = performance.now();
        const dt = time - lastTime;
        lastTime = time;
        // get fps
        const fps = Math.round(1000 / dt);
        // relative dt for 60 fps
        const t = dt / (1000 / 60);
        update(ctx, t);
        render(ctx, t);
        // setTimeout(loop, 1000)
        //window.requestAnimationFrame(loop)
    };
    loop();
});
function update(ctx, t) {
}
function render(ctx, t) {
    ctx.clearRect(0, 0, width, height);
    traceRays(ctx);
}
// trace rays from camera to screen
function traceRays(ctx) {
    // calculate screen dimensions
    const aspectRatio = width / height;
    const halfWidth = Math.tan(camera.fov / 2);
    const halfHeight = halfWidth / aspectRatio;
    const cameraWidth = halfWidth * 2;
    const cameraHeight = halfHeight * 2;
    // calculate camera axes
    const forward = camera.pos.sub(camera.rotation).normalize();
    const right = forward.cross(new Vector3_1.Vector3(0, 1, 0)).normalize();
    const up = right.cross(forward).normalize();
    console.log(forward.toString(), right.toString(), up.toString());
    // calculate screen corner
    const screenCorner = camera.pos.sub(right.mul(halfWidth)).add(up.mul(halfHeight)).add(forward.mul(2));
    console.log(screenCorner.toString());
    // tmp black background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            // calculate screen point
            const screenPoint = screenCorner.add(right.mul(cameraWidth * x / width))
                .sub(up.mul(cameraHeight * y / height));
            // calculate ray
            const ray = screenPoint.sub(camera.pos); //.normalize()
            // calculate intersection
            const intersection = intersectRaySphere(camera.pos, ray, sphere);
            console.log((intersection === null || intersection === void 0 ? void 0 : intersection.toString()) || 'no intersection');
            if (intersection) {
                //calculate normal
                const normal = intersection.sub(sphere.center).normalize();
                // calculate light direction
                const lightDir = intersection.sub(lightPos).normalize();
                // calculate diffuse
                console.log('dot to light', normal.dot(lightDir));
                const diffuse = Math.max(0, normal.dot(lightDir));
                // calculate color
                const color = Math.round(diffuse * 255);
                // set pixel
                ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
                ctx.fillRect(x, y, 1, 1);
                console.log(`rgb(${color}, ${color}, ${color})`, x, y);
            }
            else {
                // set pixel
                ctx.fillStyle = `rgb(0, 0, 0)`;
                ctx.fillRect(x, y, 1, 1);
                console.log('b', x, y);
            }
        }
    }
}
// calculate intersection of ray and sphere
function intersectRaySphere(origin, ray, sphere) {
    const oc = origin.sub(sphere.center);
    const a = ray.dot(ray);
    const b = 2.0 * oc.dot(ray);
    const c = oc.dot(oc) - sphere.radius * sphere.radius;
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return null; // No intersection
    }
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDiscriminant) / (2.0 * a);
    const t2 = (-b + sqrtDiscriminant) / (2.0 * a);
    if (t1 >= 0 || t2 >= 0) {
        // At least one intersection point is in front of the ray's origin
        const t = (t1 < t2 && t1 >= 0) ? t1 : t2;
        return origin.add(ray.mul(t));
    }
    return null; // Both intersection points are behind the ray's origin
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixPQUFPLElBQUksT0FBTyxJQUFJLE9BQU87QUFDdkQ7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O1VDaEhBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0Qsa0JBQWtCLG1CQUFPLENBQUMsbUNBQVc7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsWUFBWTtBQUNoQyx3QkFBd0IsV0FBVztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLE1BQU0sSUFBSSxNQUFNLElBQUksTUFBTTtBQUNqRTtBQUNBLG1DQUFtQyxNQUFNLElBQUksTUFBTSxJQUFJLE1BQU07QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQiIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9WZWN0b3IzLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5WZWN0b3IzID0gdm9pZCAwO1xuY2xhc3MgVmVjdG9yMyB7XG4gICAgY29uc3RydWN0b3IodiwgeSwgeikge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgdGhpcy54ID0gdlswXTtcbiAgICAgICAgICAgIHRoaXMueSA9IHZbMV07XG4gICAgICAgICAgICB0aGlzLnogPSB2WzJdO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnb2JqZWN0JyA9PT0gdHlwZW9mIHYpIHtcbiAgICAgICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgICAgIHRoaXMueSA9IHYueTtcbiAgICAgICAgICAgIHRoaXMueiA9IHYuejtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnggPSB2O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLnogPSB6O1xuICAgIH1cbiAgICBhZGQodikge1xuICAgICAgICBpZiAodHlwZW9mIHYgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54ICsgdiwgdGhpcy55ICsgdiwgdGhpcy56ICsgdik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKyB2WzBdLCB0aGlzLnkgKyB2WzFdLCB0aGlzLnogKyB2WzJdKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54ICsgdi54LCB0aGlzLnkgKyB2LnksIHRoaXMueiArIHYueik7XG4gICAgfVxuICAgIHN1Yih2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLSB2LCB0aGlzLnkgLSB2LCB0aGlzLnogLSB2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAtIHZbMF0sIHRoaXMueSAtIHZbMV0sIHRoaXMueiAtIHZbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLSB2LngsIHRoaXMueSAtIHYueSwgdGhpcy56IC0gdi56KTtcbiAgICB9XG4gICAgc2NhbGUobikge1xuICAgICAgICByZXR1cm4gdGhpcy5tdWwobik7XG4gICAgfVxuICAgIG11bCh2KSB7XG4gICAgICAgIGlmICh0eXBlb2YgdiA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKiB2LCB0aGlzLnkgKiB2LCB0aGlzLnogKiB2KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAqIHZbMF0sIHRoaXMueSAqIHZbMV0sIHRoaXMueiAqIHZbMl0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggKiB2LngsIHRoaXMueSAqIHYueSwgdGhpcy56ICogdi56KTtcbiAgICB9XG4gICAgZGl2KHYpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKHYgPT09IDApXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdEaXZpc2lvbiBieSB6ZXJvJyk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy54IC8gdiwgdGhpcy55IC8gdiwgdGhpcy56IC8gdik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodikpIHtcbiAgICAgICAgICAgIGlmICh2WzBdID09PSAwIHx8IHZbMV0gPT09IDAgfHwgdlsyXSA9PT0gMClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpdmlzaW9uIGJ5IHplcm8nKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLnggLyB2WzBdLCB0aGlzLnkgLyB2WzFdLCB0aGlzLnogLyB2WzJdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodi54ID09PSAwIHx8IHYueSA9PT0gMCB8fCB2LnogPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RpdmlzaW9uIGJ5IHplcm8nKTtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IzKHRoaXMueCAvIHYueCwgdGhpcy55IC8gdi55LCB0aGlzLnogLyB2LnopO1xuICAgIH1cbiAgICAvLyBNYXRoXG4gICAgbGVuZ3RoKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueSArIHRoaXMueiAqIHRoaXMueik7XG4gICAgfVxuICAgIG5vcm1hbGl6ZSgpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGgoKTtcbiAgICAgICAgcmV0dXJuIGxlbmd0aCA9PT0gMCA/IG5ldyBWZWN0b3IzKDAsIDAsIDApIDogdGhpcy5kaXYobGVuZ3RoKTtcbiAgICB9XG4gICAgLy8gc2NhbGFyIHByb2R1Y3QgKGRvdCBwcm9kdWN0KVxuICAgIC8vIEB1cmwgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRG90X3Byb2R1Y3RcbiAgICBkb3Qodikge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55ICsgdGhpcy56ICogdi56O1xuICAgIH1cbiAgICBkaXN0YW5jZSh2KSB7XG4gICAgICAgIGNvbnN0IGRYID0gdGhpcy54IC0gdi54O1xuICAgICAgICBjb25zdCBkWSA9IHRoaXMueSAtIHYueTtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChkWCAqIGRYICsgZFkgKiBkWSk7XG4gICAgfVxuICAgIGRpcmVjdGlvbih2KSB7XG4gICAgICAgIHJldHVybiB2LnN1Yih0aGlzKS5ub3JtYWxpemUoKTtcbiAgICB9XG4gICAgLy8gdmVjdG9yIHByb2R1Y3QgKGNyb3NzIHByb2R1Y3QpXG4gICAgLy8gaXQgaXMgYSBiaW5hcnkgb3BlcmF0aW9uIG9uIHR3byB2ZWN0b3JzIGluIHRocmVlLWRpbWVuc2lvbmFsIHNwYWNlXG4gICAgLy8gdGhhdCByZXN1bHRzIGluIGFub3RoZXIgdmVjdG9yIHdoaWNoIGlzIHBlcnBlbmRpY3VsYXIgdG8gdGhlIHBsYW5lXG4gICAgY3Jvc3Modikge1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcjModGhpcy55ICogdi56IC0gdGhpcy56ICogdi55LCB0aGlzLnogKiB2LnggLSB0aGlzLnggKiB2LnosIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueCk7XG4gICAgfVxuICAgIC8vIEFic3RyYWN0XG4gICAgY2xvbmUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcbiAgICB9XG4gICAgdG9BcnJheSgpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueSwgdGhpcy56XTtcbiAgICB9XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBgVmVjdG9yMygke3RoaXMueH0sICR7dGhpcy55fSwgJHt0aGlzLnp9KWA7XG4gICAgfVxufVxuZXhwb3J0cy5WZWN0b3IzID0gVmVjdG9yMztcblZlY3RvcjMuWkVSTyA9IG5ldyBWZWN0b3IzKDAsIDAsIDApO1xuVmVjdG9yMy5PTkUgPSBuZXcgVmVjdG9yMygxLCAxLCAxKTtcblZlY3RvcjMuVVAgPSBuZXcgVmVjdG9yMygwLCAxLCAwKTtcblZlY3RvcjMuRE9XTiA9IG5ldyBWZWN0b3IzKDAsIC0xLCAwKTtcblZlY3RvcjMuTEVGVCA9IG5ldyBWZWN0b3IzKC0xLCAwLCAwKTtcblZlY3RvcjMuUklHSFQgPSBuZXcgVmVjdG9yMygxLCAwLCAwKTtcblZlY3RvcjMuRk9SV0FSRCA9IG5ldyBWZWN0b3IzKDAsIDAsIDEpO1xuVmVjdG9yMy5CQUNLID0gbmV3IFZlY3RvcjMoMCwgMCwgLTEpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgVmVjdG9yM18xID0gcmVxdWlyZShcIi4vVmVjdG9yM1wiKTtcbmxldCB3aWR0aDtcbmxldCBoZWlnaHQ7XG4vL2NhbWVyYVxudmFyIGNhbWVyYSA9IHtcbiAgICBwb3M6IG5ldyBWZWN0b3IzXzEuVmVjdG9yMygwLCAwLCAwKSxcbiAgICByb3RhdGlvbjogbmV3IFZlY3RvcjNfMS5WZWN0b3IzKDAsIDAsIC0xKSxcbiAgICBmb3Y6IE1hdGguUEkgLyAyLFxufTtcbnZhciBzcGhlcmUgPSB7XG4gICAgY2VudGVyOiBuZXcgVmVjdG9yM18xLlZlY3RvcjMoMCwgMCwgNSksXG4gICAgcmFkaXVzOiAxLFxufTtcbnZhciBsaWdodFBvcyA9IG5ldyBWZWN0b3IzXzEuVmVjdG9yMygyLCAyLCAxMCk7XG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcbiAgICAvLyBjcmVhdGUgY2FudmFzIGVsZW1lbnRcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICBpZiAoIWN0eCkge1xuICAgICAgICBhbGVydCgnMmQgY29udGV4dCBub3Qgc3VwcG9ydGVkJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gY3JlYXRlIDJkIGNvbnRleHRcbiAgICB3aWR0aCA9IGNhbnZhcy53aWR0aCA9IDY0MDtcbiAgICBoZWlnaHQgPSBjYW52YXMuaGVpZ2h0ID0gNDgwO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAvLyBjbGVhciBzY3JlZW5cbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGxldCBsYXN0VGltZSA9IDA7XG4gICAgLy8gc2ltcGxlIGdhbWUgbG9vcCAoNjBmcHMpXG4gICAgY29uc3QgbG9vcCA9ICgpID0+IHtcbiAgICAgICAgLy8gY2xlYXIgc2NyZWVuXG4gICAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgICAgIC8vIGZpbGwgd2hpdGVcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgLy8gY2FsY3VsYXRlIGR0XG4gICAgICAgIGNvbnN0IHRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgICAgY29uc3QgZHQgPSB0aW1lIC0gbGFzdFRpbWU7XG4gICAgICAgIGxhc3RUaW1lID0gdGltZTtcbiAgICAgICAgLy8gZ2V0IGZwc1xuICAgICAgICBjb25zdCBmcHMgPSBNYXRoLnJvdW5kKDEwMDAgLyBkdCk7XG4gICAgICAgIC8vIHJlbGF0aXZlIGR0IGZvciA2MCBmcHNcbiAgICAgICAgY29uc3QgdCA9IGR0IC8gKDEwMDAgLyA2MCk7XG4gICAgICAgIHVwZGF0ZShjdHgsIHQpO1xuICAgICAgICByZW5kZXIoY3R4LCB0KTtcbiAgICAgICAgLy8gc2V0VGltZW91dChsb29wLCAxMDAwKVxuICAgICAgICAvL3dpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcClcbiAgICB9O1xuICAgIGxvb3AoKTtcbn0pO1xuZnVuY3Rpb24gdXBkYXRlKGN0eCwgdCkge1xufVxuZnVuY3Rpb24gcmVuZGVyKGN0eCwgdCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG4gICAgdHJhY2VSYXlzKGN0eCk7XG59XG4vLyB0cmFjZSByYXlzIGZyb20gY2FtZXJhIHRvIHNjcmVlblxuZnVuY3Rpb24gdHJhY2VSYXlzKGN0eCkge1xuICAgIC8vIGNhbGN1bGF0ZSBzY3JlZW4gZGltZW5zaW9uc1xuICAgIGNvbnN0IGFzcGVjdFJhdGlvID0gd2lkdGggLyBoZWlnaHQ7XG4gICAgY29uc3QgaGFsZldpZHRoID0gTWF0aC50YW4oY2FtZXJhLmZvdiAvIDIpO1xuICAgIGNvbnN0IGhhbGZIZWlnaHQgPSBoYWxmV2lkdGggLyBhc3BlY3RSYXRpbztcbiAgICBjb25zdCBjYW1lcmFXaWR0aCA9IGhhbGZXaWR0aCAqIDI7XG4gICAgY29uc3QgY2FtZXJhSGVpZ2h0ID0gaGFsZkhlaWdodCAqIDI7XG4gICAgLy8gY2FsY3VsYXRlIGNhbWVyYSBheGVzXG4gICAgY29uc3QgZm9yd2FyZCA9IGNhbWVyYS5wb3Muc3ViKGNhbWVyYS5yb3RhdGlvbikubm9ybWFsaXplKCk7XG4gICAgY29uc3QgcmlnaHQgPSBmb3J3YXJkLmNyb3NzKG5ldyBWZWN0b3IzXzEuVmVjdG9yMygwLCAxLCAwKSkubm9ybWFsaXplKCk7XG4gICAgY29uc3QgdXAgPSByaWdodC5jcm9zcyhmb3J3YXJkKS5ub3JtYWxpemUoKTtcbiAgICBjb25zb2xlLmxvZyhmb3J3YXJkLnRvU3RyaW5nKCksIHJpZ2h0LnRvU3RyaW5nKCksIHVwLnRvU3RyaW5nKCkpO1xuICAgIC8vIGNhbGN1bGF0ZSBzY3JlZW4gY29ybmVyXG4gICAgY29uc3Qgc2NyZWVuQ29ybmVyID0gY2FtZXJhLnBvcy5zdWIocmlnaHQubXVsKGhhbGZXaWR0aCkpLmFkZCh1cC5tdWwoaGFsZkhlaWdodCkpLmFkZChmb3J3YXJkLm11bCgyKSk7XG4gICAgY29uc29sZS5sb2coc2NyZWVuQ29ybmVyLnRvU3RyaW5nKCkpO1xuICAgIC8vIHRtcCBibGFjayBiYWNrZ3JvdW5kXG4gICAgY3R4LmZpbGxTdHlsZSA9ICdibGFjayc7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuICAgIGZvciAobGV0IHkgPSAwOyB5IDwgaGVpZ2h0OyB5ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB3aWR0aDsgeCArPSAxKSB7XG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgc2NyZWVuIHBvaW50XG4gICAgICAgICAgICBjb25zdCBzY3JlZW5Qb2ludCA9IHNjcmVlbkNvcm5lci5hZGQocmlnaHQubXVsKGNhbWVyYVdpZHRoICogeCAvIHdpZHRoKSlcbiAgICAgICAgICAgICAgICAuc3ViKHVwLm11bChjYW1lcmFIZWlnaHQgKiB5IC8gaGVpZ2h0KSk7XG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgcmF5XG4gICAgICAgICAgICBjb25zdCByYXkgPSBzY3JlZW5Qb2ludC5zdWIoY2FtZXJhLnBvcyk7IC8vLm5vcm1hbGl6ZSgpXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uXG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3Rpb24gPSBpbnRlcnNlY3RSYXlTcGhlcmUoY2FtZXJhLnBvcywgcmF5LCBzcGhlcmUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coKGludGVyc2VjdGlvbiA9PT0gbnVsbCB8fCBpbnRlcnNlY3Rpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IGludGVyc2VjdGlvbi50b1N0cmluZygpKSB8fCAnbm8gaW50ZXJzZWN0aW9uJyk7XG4gICAgICAgICAgICBpZiAoaW50ZXJzZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgLy9jYWxjdWxhdGUgbm9ybWFsXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9ybWFsID0gaW50ZXJzZWN0aW9uLnN1YihzcGhlcmUuY2VudGVyKS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgbGlnaHQgZGlyZWN0aW9uXG4gICAgICAgICAgICAgICAgY29uc3QgbGlnaHREaXIgPSBpbnRlcnNlY3Rpb24uc3ViKGxpZ2h0UG9zKS5ub3JtYWxpemUoKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgZGlmZnVzZVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkb3QgdG8gbGlnaHQnLCBub3JtYWwuZG90KGxpZ2h0RGlyKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZnVzZSA9IE1hdGgubWF4KDAsIG5vcm1hbC5kb3QobGlnaHREaXIpKTtcbiAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgY29sb3JcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvciA9IE1hdGgucm91bmQoZGlmZnVzZSAqIDI1NSk7XG4gICAgICAgICAgICAgICAgLy8gc2V0IHBpeGVsXG4gICAgICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGByZ2IoJHtjb2xvcn0sICR7Y29sb3J9LCAke2NvbG9yfSlgO1xuICAgICAgICAgICAgICAgIGN0eC5maWxsUmVjdCh4LCB5LCAxLCAxKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgcmdiKCR7Y29sb3J9LCAke2NvbG9yfSwgJHtjb2xvcn0pYCwgeCwgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXQgcGl4ZWxcbiAgICAgICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gYHJnYigwLCAwLCAwKWA7XG4gICAgICAgICAgICAgICAgY3R4LmZpbGxSZWN0KHgsIHksIDEsIDEpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdiJywgeCwgeSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyBjYWxjdWxhdGUgaW50ZXJzZWN0aW9uIG9mIHJheSBhbmQgc3BoZXJlXG5mdW5jdGlvbiBpbnRlcnNlY3RSYXlTcGhlcmUob3JpZ2luLCByYXksIHNwaGVyZSkge1xuICAgIGNvbnN0IG9jID0gb3JpZ2luLnN1YihzcGhlcmUuY2VudGVyKTtcbiAgICBjb25zdCBhID0gcmF5LmRvdChyYXkpO1xuICAgIGNvbnN0IGIgPSAyLjAgKiBvYy5kb3QocmF5KTtcbiAgICBjb25zdCBjID0gb2MuZG90KG9jKSAtIHNwaGVyZS5yYWRpdXMgKiBzcGhlcmUucmFkaXVzO1xuICAgIGNvbnN0IGRpc2NyaW1pbmFudCA9IGIgKiBiIC0gNCAqIGEgKiBjO1xuICAgIGlmIChkaXNjcmltaW5hbnQgPCAwKSB7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBObyBpbnRlcnNlY3Rpb25cbiAgICB9XG4gICAgY29uc3Qgc3FydERpc2NyaW1pbmFudCA9IE1hdGguc3FydChkaXNjcmltaW5hbnQpO1xuICAgIGNvbnN0IHQxID0gKC1iIC0gc3FydERpc2NyaW1pbmFudCkgLyAoMi4wICogYSk7XG4gICAgY29uc3QgdDIgPSAoLWIgKyBzcXJ0RGlzY3JpbWluYW50KSAvICgyLjAgKiBhKTtcbiAgICBpZiAodDEgPj0gMCB8fCB0MiA+PSAwKSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IG9uZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgaW4gZnJvbnQgb2YgdGhlIHJheSdzIG9yaWdpblxuICAgICAgICBjb25zdCB0ID0gKHQxIDwgdDIgJiYgdDEgPj0gMCkgPyB0MSA6IHQyO1xuICAgICAgICByZXR1cm4gb3JpZ2luLmFkZChyYXkubXVsKHQpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7IC8vIEJvdGggaW50ZXJzZWN0aW9uIHBvaW50cyBhcmUgYmVoaW5kIHRoZSByYXkncyBvcmlnaW5cbn1cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==