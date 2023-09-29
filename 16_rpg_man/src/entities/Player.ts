import { ISprite, sprite } from "../components/sprite";
import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { TInput } from "../infrastructure/InputManager";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { addComponent } from "../infrastructure/addComponent";

export interface Player extends ISprite { }
@addComponent(sprite, { filePath: 'assets/chel.png' })
export class Player extends AEntity {
  position!: IVector2
  public init(scene: AScene): void | Promise<void> {
    super.init(scene)
    this.position = new Vector2(scene.frameSize.w, scene.frameSize.h).mul(0.5)
    this.sprite.setSizeFromImage()
    this.sprite.setAnchorToCenter()
    console.dir(this.sprite.size)
    console.dir(this.sprite.anchor)
  }

  rotate = 0
  public update(dt: number, input: TInput): void {
    if(this.rotate > Math.PI * 2) {
      this.rotate = 0
    } else {
      this.rotate += 0.3
    }
  }
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.sprite.render(ctx, dt, this.position.clone(), this.rotate)
  }
}