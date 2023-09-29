import { ITextured, textured } from "../components/textured";
import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { ISize2, Size2 } from "../infrastructure/Size2";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { addComponent } from "../infrastructure/addComponent";

export interface Floor extends ITextured { }
@addComponent(textured, { filePath: 'assets/floor.png' })
export class Floor extends AEntity {
  position: IVector2 = Vector2.zero()
  size!: ISize2

  public init(scene: AScene): void | Promise<void> {
    super.init(scene)
    this.size = new Size2(this.scene.frameSize.w, this.scene.frameSize.h)
  }
  
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.textured.renderRect(ctx, this.position, this.size)
  }
}