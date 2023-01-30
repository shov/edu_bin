/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/

window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'main-canvas');
    document.getElementById('root').appendChild(canvas);
    window.addEventListener('resize', () => {
        console.dir(window.innerWidth);
        console.dir(window.innerHeight);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log(canvas.height);
        console.log(canvas.width);
        const context = canvas.getContext('2d');
        context.fillStyle = `#${(Math.abs(canvas.width) % 255).toString(16)}${(Math.abs(canvas.height) % 255).toString(16)}${(Math.abs(canvas.width - canvas.height) % 255).toString(16)}`;
        context.rect(0, 0, canvas.width, canvas.height);
        context.fill();
    });
});

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLDRDQUE0QyxFQUFFLDZDQUE2QyxFQUFFLDREQUE0RDtBQUN6TDtBQUNBO0FBQ0EsS0FBSztBQUNMLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgY2FudmFzLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbWFpbi1jYW52YXMnKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpLmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5kaXIod2luZG93LmlubmVyV2lkdGgpO1xuICAgICAgICBjb25zb2xlLmRpcih3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgICBjYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgY29uc29sZS5sb2coY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGNhbnZhcy53aWR0aCk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSBgIyR7KE1hdGguYWJzKGNhbnZhcy53aWR0aCkgJSAyNTUpLnRvU3RyaW5nKDE2KX0keyhNYXRoLmFicyhjYW52YXMuaGVpZ2h0KSAlIDI1NSkudG9TdHJpbmcoMTYpfSR7KE1hdGguYWJzKGNhbnZhcy53aWR0aCAtIGNhbnZhcy5oZWlnaHQpICUgMjU1KS50b1N0cmluZygxNil9YDtcbiAgICAgICAgY29udGV4dC5yZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgIH0pO1xufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=