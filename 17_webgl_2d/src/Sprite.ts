import { Game } from "./Game";
import { IGameEntity } from "./IGameEntity";
import { Material } from "./Material";
import { Vector2 } from "./Vector2";

export type TSpriteOptions = {
  w?: number;
  h?: number;
  uv?: Vector2;
}

export class Sprite implements IGameEntity {

  public setAnimation(cb: (this: Sprite) => void) {
    if (/^bound\s/.test(cb.name)) {
      throw new Error('Animation callback must be unbound function!');
    }
    if (/^[^{]+=>(\s+)?\{/.test(cb.toString())) {
      throw new Error('Animation callback must be non-arrow function!');
    }

    this.animationCb = cb;
  }

  protected isLoaded: boolean = false;
  protected material: Material;

  protected image!: HTMLImageElement & { sprite: Sprite };
  protected texture!: WebGLTexture;

  protected uv: Vector2 = new Vector2(1, 1);
  protected frameOffset: Vector2 = new Vector2(0, 0);

  protected geoBuffer!: WebGLBuffer;
  protected texBuffer!: WebGLBuffer;

  protected aPosLoc!: number;
  protected aTexCoordLoc!: number;
  protected uImageLoc!: WebGLUniformLocation;
  protected uWorldLoc!: WebGLUniformLocation;
  protected uFrameOffsetLoc!: WebGLUniformLocation;

  protected size: Vector2 = new Vector2(1, 1);

  protected animationCb: ((this: Sprite) => void) | null = null;

  constructor(
    protected readonly gl: WebGL2RenderingContext,
    protected readonly game: Game,
    imgURL: string,
    vs: string,
    fs: string,
    options: TSpriteOptions = {},
  ) {
    this.material = new Material(this.gl, vs, fs);

    this.image = new Image() as HTMLImageElement & { sprite: Sprite };
    this.image.src = imgURL;
    this.image.sprite = this;
    this.image.onload = () => {
      this.setup();
    };

    this.size.x = 'number' === typeof options.w
      ? options.w :
      1;

    this.size.y = 'number' === typeof options.h
      ? options.h
      : 1;

    this.uv.x = 'number' === typeof options.uv?.x
      ? options.uv.x
      : 1;
    this.uv.y = 'number' === typeof options.uv?.y
      ? options.uv.y
      : 1;
  }

  protected static createRectArray(x: number = 0, y: number = 0, w: number = 1, h: number = 1) {
    return new Float32Array([
      // two triangles 2d coords
      x, y,
      x, y + h,
      x + w, y,
      x, y + h,
      x + w, y + h,
      x + w, y,
    ]);
  }

  protected setup() {
    const gl = this.gl;

    this.uv.x = this.size.x / this.image.width;
    this.uv.y = this.size.y / this.image.height;

    gl.useProgram(this.material.program);

    const texture = gl.createTexture();
    if (!texture) {
      throw new Error('Cannot create texture!');
    }
    this.texture = texture;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    gl.bindTexture(gl.TEXTURE_2D, null);

    const geoBuffer = gl.createBuffer();
    if (!geoBuffer) {
      throw new Error('Cannot create buffer!');
    }
    this.geoBuffer = geoBuffer;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.size.x, this.size.y), gl.STATIC_DRAW);

    const texBuffer = gl.createBuffer();
    if (!texBuffer) {
      throw new Error('Cannot create buffer!');
    }
    this.texBuffer = texBuffer;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, Sprite.createRectArray(0, 0, this.uv.x, this.uv.y), gl.STATIC_DRAW);

    gl.useProgram(null);
    this.isLoaded = true;
  }

  public update(dt: number) {
    if (!this.isLoaded) {
      return;
    }

    // Animation
    if (this.animationCb) {
      this.animationCb.call(this);
    }
  }

  public render() {
    if (!this.isLoaded) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.material.program);

    this.material.setParameterBindTexture('u_image', this.texture, 0);
    this.material.setParameterBindBuffer('a_texCoord', this.texBuffer);
    this.material.setParameterBindBuffer('a_position', this.geoBuffer);
    this.material.setParameter('u_world', this.game.worldMatrix.floatData);
    this.material.setParameter('u_frame_offset', this.frameOffset.x, this.frameOffset.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

    gl.useProgram(null);
  }
}