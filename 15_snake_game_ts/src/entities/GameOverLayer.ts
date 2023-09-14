import { AEntity } from "../infrastructure/AEntity"
import { AScene } from "../infrastructure/AScene"
import { GameController } from "./GameController"

export class GameOverLayer extends AEntity {
  protected gc!: GameController

  public init(scene: AScene): void {
    super.init(scene)
    this.gc = scene.get<GameController>('gameController')!

  }

  maxForBlink = 24;
  blinkCounter = 0

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    if (this.gc.isGameOver) {
      ctx.fillStyle = 'red'
      ctx.font = '40px bold'
      ctx.fillText('GAME OVER SNEK!', this.scene.frameSize.w / 2 - 170, this.scene.frameSize.h / 2);

      this.blinkCounter++
      if (this.blinkCounter < this.maxForBlink / 2) {
        ctx.fillStyle = 'yellow'
        ctx.font = '16px bold'
        ctx.fillText('[ PRESS SPACE TO RESTART ]', this.scene.frameSize.w / 2 - 90, this.scene.frameSize.h / 2 + 45);
      } else if (this.blinkCounter >= this.maxForBlink) {
        this.blinkCounter = 0
      }
    }
  }
}