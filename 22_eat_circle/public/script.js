/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

window.addEventListener('load', () => {
    const game = new Game();
    game.addScene(new DefaultScene(game));
    // @ts-ignore
    window.game = game;
    game.init().then(() => {
        game.resize(window.innerWidth, window.innerHeight);
        loop();
    });
});
window.addEventListener('resize', () => {
    var _a;
    // @ts-ignore
    (_a = window.game) === null || _a === void 0 ? void 0 : _a.resize(window.innerWidth, window.innerHeight);
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIGNvbnN0IGdhbWUgPSBuZXcgR2FtZSgpO1xuICAgIGdhbWUuYWRkU2NlbmUobmV3IERlZmF1bHRTY2VuZShnYW1lKSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdpbmRvdy5nYW1lID0gZ2FtZTtcbiAgICBnYW1lLmluaXQoKS50aGVuKCgpID0+IHtcbiAgICAgICAgZ2FtZS5yZXNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICAgIGxvb3AoKTtcbiAgICB9KTtcbn0pO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICB2YXIgX2E7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIChfYSA9IHdpbmRvdy5nYW1lKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=