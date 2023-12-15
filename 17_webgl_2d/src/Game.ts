import { IGameEntity } from './IGameEntity';
import { IUpdatable } from './IUpdatable';
import { Sprite } from './Sprite';
import { TransformationMatrix } from './TransformationMatrix';

export class Game implements IUpdatable {
  public get worldMatrix(): TransformationMatrix {
    return this.worldSpaceMatrix;
  }

  protected canvas: HTMLCanvasElement;
  protected gl: WebGL2RenderingContext;
  protected worldSpaceMatrix: TransformationMatrix = TransformationMatrix.identity();

  protected entityList: IGameEntity[] = [];

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.height = 600;
    this.canvas.width = 800;

    const ctx = this.canvas.getContext('webgl2');
    if (null === ctx) {
      throw new Error('Cnnot obtain webgl2 context!');

    }

    this.gl = ctx;
    this.gl.clearColor(0.4, 0.6, 1.0, 1.0);

    document.body.appendChild(this.canvas);
  }

  public async init() {
    let vs = await fetch('shaders/vertex.glsl').then(r => r.text());
    let fs = await fetch('shaders/fragment.glsl').then(r => r.text());

    this.entityList.push(new Sprite(this.gl, this, 'assets/turtle.png', vs, fs, { w: 64, h: 64 }));
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;

    const scaleFactor = 250;
    const wRatio = width / (height / scaleFactor);
    this.worldSpaceMatrix = TransformationMatrix
    .identity()
    .transition(-1, 1)
    .scale(2 / wRatio, -2 / scaleFactor);
  }

  public update(dt: number) {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.entityList.forEach(e => e.update(dt));
    this.entityList.forEach(e => e.render());

    this.gl.flush();
  }
}