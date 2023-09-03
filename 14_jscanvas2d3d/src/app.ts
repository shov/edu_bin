import { IVector3, TVector3Array, Vector3 } from "./Vector3"
import { IVector2, Vector2 } from "./Vector2"

let width: number
let height: number

//camera
var camera = {
  pos: new Vector3(0, 0, 0),
  rotation: new Vector3(0, 0, -1),
  fov: Math.PI / 2,
}

var sphere = {
  center: new Vector3(0, 0, 5),
  radius: 1,
}

var lightPos = new Vector3(2, 2, 10)

window.addEventListener('load', () => {
  // create canvas element
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    alert('2d context not supported')
    return
  }

  // create 2d context
  width = canvas.width = 640
  height = canvas.height = 480
  document.body.appendChild(canvas)

  // clear screen
  ctx.clearRect(0, 0, width, height)

  let lastTime = 0
  // simple game loop (60fps)
  const loop = () => {
    // clear screen
    ctx.clearRect(0, 0, width, height)
    // fill white
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)

    // calculate dt
    const time = performance.now()
    const dt = time - lastTime
    lastTime = time
    // get fps
    const fps = Math.round(1000 / dt)
    // relative dt for 60 fps
    const t = dt / (1000 / 60)

    update(ctx, t)
    render(ctx, t)
    // setTimeout(loop, 1000)

    //window.requestAnimationFrame(loop)
  }
  loop()
})

function update(ctx: CanvasRenderingContext2D, t: number) {

}

function render(ctx: CanvasRenderingContext2D, t: number) {
  ctx.clearRect(0, 0, width, height)
  traceRays(ctx)
}

// trace rays from camera to screen
function traceRays(ctx: CanvasRenderingContext2D) {
  // calculate screen dimensions
  const aspectRatio = width / height
  const halfWidth = Math.tan(camera.fov / 2)
  const halfHeight = halfWidth / aspectRatio
  const cameraWidth = halfWidth * 2
  const cameraHeight = halfHeight * 2

  // calculate camera axes
  const forward = camera.pos.sub(camera.rotation).normalize()
  const right = forward.cross(new Vector3(0, 1, 0)).normalize()
  const up = right.cross(forward).normalize()

  console.log(forward.toString(), right.toString(), up.toString())
  

  // calculate screen corner
  const screenCorner =
    camera.pos.sub(right.mul(halfWidth)).add(up.mul(halfHeight)).add(forward.mul(2))

    console.log(screenCorner.toString())

    // tmp black background
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)

  for (let y = 0; y < height; y+=1) {
    for (let x = 0; x < width; x+=1) {
      // calculate screen point
      const screenPoint =
        screenCorner.add(right.mul(cameraWidth * x / width))
          .sub(up.mul(cameraHeight * y / height))

      // calculate ray
      const ray =
        screenPoint.sub(camera.pos)//.normalize()

      // calculate intersection
      const intersection = intersectRaySphere(camera.pos, ray, sphere)
      console.log(intersection?.toString() || 'no intersection')
      if (intersection) {
        //calculate normal
        const normal = intersection.sub(sphere.center).normalize()
        // calculate light direction
        const lightDir = intersection.sub(lightPos).normalize()
        // calculate diffuse
        console.log('dot to light', normal.dot(lightDir))
        const diffuse = Math.max(0, normal.dot(lightDir))
        // calculate color
        const color = Math.round(diffuse * 255)
        // set pixel

        ctx.fillStyle = `rgb(${color}, ${color}, ${color})`
        
        ctx.fillRect(x, y, 1, 1)
        console.log(`rgb(${color}, ${color}, ${color})`, x, y)
      } else {
        // set pixel
        ctx.fillStyle = `rgb(0, 0, 0)`
        ctx.fillRect(x, y, 1, 1)
        console.log('b', x, y)
      }
    }
  }
}

// calculate intersection of ray and sphere
function intersectRaySphere(
  origin: IVector3,
  ray: IVector3,
  sphere: { center: IVector3, radius: number }
): IVector3 | null {
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
