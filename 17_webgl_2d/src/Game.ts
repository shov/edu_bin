import { IGameEntity } from './IGameEntity';
import { IGameScene } from './IGameScene';
import { IUpdatable } from './IUpdatable';
import { ResourceRegistry } from './ResourceRegistry';
import { Sprite } from './Sprite';
import { TransformationMatrix } from './TransformationMatrix';

export class Game implements IUpdatable {
  public get worldMatrix(): TransformationMatrix {
    return this.worldSpaceMatrix;
  }

  public gl: WebGL2RenderingContext;
  public canvas: HTMLCanvasElement;

  protected worldSpaceMatrix: TransformationMatrix = TransformationMatrix.identity();

  protected sceneList: IGameScene[] = [];

  public readonly resourceRegistry: ResourceRegistry = new ResourceRegistry();

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

  public addScene(scene: IGameScene) {
    this.sceneList.push(scene);
  }

  public async init() {
    for (const scene of this.sceneList) {
      await scene.init();
    }
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

    this.sceneList.forEach(scene => scene.update(dt));
    this.sceneList.forEach(scene => scene.render());

    this.gl.flush();
  }
}