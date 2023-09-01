window.addEventListener('load', () => {
  // create canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    alert('2d context not supported')
    return
  }

  // create 2d context
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  document.body.appendChild(canvas)

  // draw all black
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  // thre dots coords
  const dots = [
    { x: 100, y: 100, speedX: 100, speedY: 100 },
    { x: 200, y: 100, speedX: -100, speedY: 100 },
    { x: 200, y: 200, speedX: 250, speedY: -100 },
  ]

  let lastTime = 0
  // simple game loop (60fps)
  const loop = () => {
    // clear screen
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

    // calculate dt
    const time = performance.now()
    const dt = time - lastTime
    lastTime = time

    // move dots both coords with speed mul on dt
    // if a dot behind the screen, move it to the border and invert speed
    dots.forEach(dot => {
      dot.x += dot.speedX * dt / 1000
      dot.y += dot.speedY * dt / 1000
      if (dot.x < 0) {
        dot.x = 0
        dot.speedX *= -1
      }
      if (dot.x > width) {
        dot.x = width
        dot.speedX *= -1
      }
      if (dot.y < 0) {
        dot.y = 0
        dot.speedY *= -1
      }
      if (dot.y > height) {
        dot.y = height
        dot.speedY *= -1
      }
    })

    // render lines between dots
    ctx.strokeStyle = 'white'
    ctx.beginPath()
    ctx.moveTo(dots[0].x, dots[0].y)
    ctx.lineTo(dots[1].x, dots[1].y)
    ctx.lineTo(dots[2].x, dots[2].y)
    ctx.lineTo(dots[0].x, dots[0].y)
    ctx.stroke()


    window.requestAnimationFrame(loop)
  }
  loop()
})
