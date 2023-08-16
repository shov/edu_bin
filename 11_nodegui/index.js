var ntk = require('ntk');

const BOX = {
  W: 800,
  H: 600,
}

ntk.createClient((err, app) => {
  var wnd = app.createWindow({ width: BOX.W, height: BOX.H, title: 'node window game demo' });

  /**
   * @type {CanvasRenderingContext2D}
   */
  var ctx = wnd.getContext('2d');

  // start game loop
  gameLoop(ctx);

  wnd.map();
});

const FRAME_RATE = 60;
let lastTime = Date.now();
//game loop function
function gameLoop(ctx) {
  let now = Date.now();
  let delta = now - lastTime;
  const fps = Math.floor(1000 / delta)
  const dt = Math.max(0, Number(Math.round(delta / (1000 / FRAME_RATE)).toFixed(2)))
  lastTime = now;
  update(ctx, dt, fps);
  render(ctx, dt, fps);
  setTimeout(() => gameLoop(ctx), 1000 / FRAME_RATE);
}

/**
 * @typedef {{
 *  x: number,
 *  y: number,
 *  direction?: Point,
 *  speed?: number,
 * }} Point
 */

/**
 * @type {Point[]}
 */
const sqList = [
  { x: 200, y: 200, direction: { x: 1, y: 0 }, speed: 2 },
  { x: 300, y: 200, direction: { x: 0, y: 1 }, speed: 1.7 },
  { x: 300, y: 300, direction: { x: -1, y: 0 }, speed: 0.7 },
];

/**
 * Update function
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} dt 
 * @param {number} fps 
 */
function update(ctx, dt, fps) {
  sqList.forEach(sq => {
    // if sq.x out of box, change direction
    if (sq.x < 0 || sq.x > BOX.W) {
      sq.direction.x *= -1;
    }
    sq.x += sq.direction.x * sq.speed * dt;

    // if sq.y out of box, change direction
    if (sq.y < 0 || sq.y > BOX.H) {
      sq.direction.y *= -1;
    }
    sq.y += sq.direction.y * sq.speed * dt;
  });
}

/**
 * Render function
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} dt 
 * @param {number} fps 
 */
function render(ctx, dt, fps) {
  // clear screen
  ctx.clearRect(0, 0, BOX.W, BOX.H);

  // white background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, BOX.W, BOX.H);

  // draw points, line from first thru each to last and then from last to first
  ctx.strokeStyle = '#000';
  ctx.beginPath();
  sqList.forEach((sq, i) => {
    if (i === 0) {
      ctx.moveTo(sq.x, sq.y);
    } else {
      ctx.lineTo(sq.x, sq.y);
    }
  }
  );
  ctx.lineTo(sqList[0].x, sqList[0].y);
  ctx.closePath();
  ctx.stroke();

}