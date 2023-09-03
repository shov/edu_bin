import { IVector3, TVector3Array, Vector3 } from "./Vector3"
import { IVector2, Vector2 } from "./Vector2"

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

  //camera
  const fov = Math.PI / 2 // field of view
  const distanceToProjectionPlane = (width / 2) / Math.tan(fov / 2) // distance to projection plane

  const objects: IVector3[] = ([
    [0, 0, 3],
    [-1, -1, 2],
    [1, -1, 2],
    [1, 1, 2],
    [-1, 1, 2],
    [-100, 1, -200],
  ] as TVector3Array[]).map(va => new Vector3(va))

  function project3DTo2D(v: IVector3): IVector2 {
    const scale = distanceToProjectionPlane / (v.z + distanceToProjectionPlane);
    const projectedX = (v.x * scale) + (width / 2);
    const projectedY = (-v.y * scale) + (height / 2);
    return new Vector2(projectedX, projectedY);
  }

  // clear screen
  ctx.clearRect(0, 0, width, height)



  let lastTime = 0
  // simple game loop (60fps)
  const loop = () => {
    // clear screen
    ctx.clearRect(0, 0, width, height)

    // fill background
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // calculate dt
    const time = performance.now()
    const dt = time - lastTime
    lastTime = time

    for (const v3 of objects) {
      const v = project3DTo2D(v3);
      ctx.fillStyle = 'black'
      ctx.beginPath();
      ctx.arc(v.x, v.y, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    window.requestAnimationFrame(loop)
  }
  loop()
})
