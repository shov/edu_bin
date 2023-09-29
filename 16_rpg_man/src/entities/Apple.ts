import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { IVector2 } from "../infrastructure/Vector2";
import { GameController } from "./GameController";

let appleCounter = 0

export class Apple extends AEntity {
  fillColor: string = 'red'
  strokeColor: string = 'yellow'
  location!: IVector2
  sprite!: HTMLImageElement
  gc!: GameController

  constructor(location: IVector2, sprite: HTMLImageElement) {
    super(`Apple${appleCounter++}`)
    this.location = location.clone()
    this.sprite = sprite
  }

  public init(scene: AScene): void {
    this.gc = scene.get<GameController>('gameController')!
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.gc.drawSpriteOnBoard(ctx, this.location, this.sprite)
  }
}