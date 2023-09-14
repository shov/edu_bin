import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { GameController } from "./GameController";


export class BoardMap extends AEntity {
  protected readonly color = 'grey'
  protected gc!: GameController

  protected wallList: IVector2[] = []

  public init(scene: AScene): void {
    this.gc = scene.get<GameController>('gameController')!

    this.setupWalls()
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.wallList.forEach(wall => {
      this.gc.drawCell(ctx, wall, this.color)
    })
  }

  public getAllWallsLocationList(): IVector2[] {
    return this.wallList.map(w => w.clone())
  }

  protected setupWalls() {
    const w = this.gc.boardSize.w
    const h = this.gc.boardSize.h
    for (let i = h / 4 | 0; i < h - (h / 4 | 0); i++) {
      this.wallList.push(new Vector2(3, i))
      this.wallList.push(new Vector2(w - 1 - 3, i))
    }

    for (let i = w / 4 | 0; i < w - (w / 4 | 0); i++) {
      this.wallList.push(new Vector2(i, 3))
      this.wallList.push(new Vector2(i, h - 1 - 3))
    }
  }
}