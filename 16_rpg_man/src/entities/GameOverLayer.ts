import { AEntity } from "../infrastructure/AEntity"
import { AScene } from "../infrastructure/AScene"
import { GameController } from "./GameController"

export class GameOverLayer extends AEntity {
  protected gc!: GameController

  public init(scene: AScene): void {
    super.init(scene)
    this.gc = scene.get<GameController>('gameController')!

  }

  readonly GO_TEXT = 'GAME OVER SNEK!'
  readonly PLAY_AGAIN_TEXT = '[ PRESS SPACE TO RESTART ]'

  maxForBlink = 24;
  blinkCounter = 0

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    if (this.gc.isGameOver) {
      ctx.fillStyle = 'red'
      ctx.font = '40px bold'
      const mt = ctx.measureText(this.GO_TEXT)
      ctx.fillText(this.GO_TEXT, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2);

      this.blinkCounter++
      if (this.blinkCounter < this.maxForBlink / 2) {
        ctx.fillStyle = 'yellow'
        ctx.font = '16px bold'
        const mt = ctx.measureText(this.PLAY_AGAIN_TEXT)
        ctx.fillText(this.PLAY_AGAIN_TEXT, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2 + 45);
      } else if (this.blinkCounter >= this.maxForBlink) {
        this.blinkCounter = 0
      }
    }
  }
}