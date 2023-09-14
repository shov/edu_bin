import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { IVector2 } from "../infrastructure/Vector2";
import { GameController } from "./GameController";

let appleCounter = 0

export class Apple extends AEntity {
  fillColor: string = 'red'
  strokeColor: string = 'yellow'
  location!: IVector2
  gc!: GameController

  constructor(location: IVector2) {
    super(`Apple${appleCounter++}`)
    this.location = location.clone()
  }

  public init(scene: AScene): void {
    this.gc = scene.get<GameController>('gameController')!
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.gc.drawCell(ctx, this.location, this.fillColor, this.strokeColor)
  }
}