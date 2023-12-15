let lastTime = 0;
const FRAME_RATE = 60;

export function loop() {
  const now = Date.now();
  const deltaTime = now - lastTime;
  const fps = Math.floor(1000 / deltaTime);
  const dt = Number((deltaTime / (1000 / FRAME_RATE)).toFixed(2));
  lastTime = now;

  // @ts-ignore
  window.game.update(dt);
  requestAnimationFrame(loop);
}