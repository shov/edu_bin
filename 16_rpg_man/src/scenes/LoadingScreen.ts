import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { Engine } from "../infrastructure/Engine";
import { TInput } from "../infrastructure/InputManager";
import { MainScene } from "./MainScene";

export class LoadingScreen extends AScene {
  public async init(engine: Engine, canvas: HTMLCanvasElement): Promise<void> {
    this.add('loading', new class extends AEntity {
      text = 'Loading...'
      public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.scene.frameSize.w, this.scene.frameSize.h)
        ctx.fillStyle = 'yellow'
        ctx.font = '40px bold'
        const mt = ctx.measureText(this.text)
        ctx.fillText(this.text, this.scene.frameSize.w / 2 - mt.width / 2, this.scene.frameSize.h / 2 - 20)
      }

      mainSceneOnLoad = false
      public update(dt: number, input: TInput): void {
        if (!this.mainSceneOnLoad) {
          this.mainSceneOnLoad = true
          const mainScene = new MainScene()
          mainScene.init(engine, canvas).then(ok => {
            setTimeout(() => engine.changeScene(mainScene), 1000)
          }).catch(e => {
            console.error(e)
          })
        }
      }
    })
    super.init(engine, canvas)
  }
}