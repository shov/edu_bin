import { Game } from "./Game";
import { IGameEntity } from "./IGameEntity";
import { Material } from "./Material";
import { Vector2 } from "./Vector2";

export type TSpriteOptions = {
  w?: number;
  h?: number;
}

export class Sprite implements IGameEntity {
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

    this.size.x = options.w || 1;
    this.size.y = options.h || 1;
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

    this.aPosLoc = gl.getAttribLocation(this.material.program, 'a_position');
    this.aTexCoordLoc = gl.getAttribLocation(this.material.program, 'a_texCoord');
    const uImageLoc = gl.getUniformLocation(this.material.program, 'u_image');
    if (!uImageLoc) {
      throw new Error('Cannot get uniform location uImageLoc!');
    }
    this.uImageLoc = uImageLoc;

    const uWorldLoc = gl.getUniformLocation(this.material.program, 'u_world');
    if (!uWorldLoc) {
      throw new Error('Cannot get uniform location uWorldLoc!');
    }
    this.uWorldLoc = uWorldLoc;

    const uFrameOffsetLoc = gl.getUniformLocation(this.material.program, 'u_frame_offset');
    if (!uFrameOffsetLoc) {
      throw new Error('Cannot get uniform location uFrameOffsetLoc!');
    }

    this.uFrameOffsetLoc = uFrameOffsetLoc;

    gl.useProgram(null);
    this.isLoaded = true;
  }

  public update(dt: number) {
    if (!this.isLoaded) {
      return;
    }

    // Animation
    this.frameOffset.x = this.uv.x * (Date.now() % 800 / 200 | 0);
  }

  public render() {
    if (!this.isLoaded) {
      return;
    }

    const gl = this.gl;
    gl.useProgram(this.material.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(this.uImageLoc, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texBuffer);
    gl.enableVertexAttribArray(this.aTexCoordLoc);
    gl.vertexAttribPointer(this.aTexCoordLoc, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.geoBuffer);
    gl.enableVertexAttribArray(this.aPosLoc);
    gl.vertexAttribPointer(this.aPosLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix3fv(this.uWorldLoc, false, this.game.worldMatrix.floatData);

    gl.uniform2f(this.uFrameOffsetLoc, this.frameOffset.x, this.frameOffset.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);

    gl.useProgram(null);
  }
}