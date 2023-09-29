import { AScene } from "../infrastructure/AScene";
import { COMPONENT_CONSTRUCTOR, COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT, COMPONENT_NAME_SYMBOL } from "../infrastructure/addComponent";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { AEntity } from "../infrastructure/AEntity";
import { ISize2, Size2 } from "../infrastructure/Size2";
import { ImageResource } from "../infrastructure/ImageResource";

interface ISpriteComposition {
  anchor: IVector2
  size: ISize2

  getLocalCenter(): IVector2
  setSizeFromImage(): void
  setAnchorToCenter(): void
  render(ctx: CanvasRenderingContext2D, dt: number, position: IVector2, angle?: number): void

  // animation
  // config
  // play
  // stop
}

class SpriteComposition implements ISpriteComposition {
  public anchor: IVector2 = Vector2.zero()
  public size: ISize2 = new Size2(0, 0)

  protected image!: HTMLImageElement

  constructor(protected target: AEntity, protected filePath: string) {
    if ('string' !== typeof filePath || filePath.length < 0) {
      throw new Error(`No sprite file path!`)
    }

    this.target['resourceList'].push(new ImageResource(filePath, filePath))
  }

  getLocalCenter(): IVector2 {
    return new Vector2(this.size.w / 2, this.size.h / 2)
  }

  setSizeFromImage(): void {
    this.makeSureImage()
    this.size = new Size2(this.image.width, this.image.height)
  }

  setAnchorToCenter(): void {
    this.anchor = this.getLocalCenter().mul(-1)
  }

  render(ctx: CanvasRenderingContext2D, dt: number, position: IVector2, angle?: number | undefined): void {
    this.makeSureImage()

    if ('number' === typeof angle) {
      ctx.translate(position.x + this.anchor.x, position.y + this.anchor.y)
      ctx.rotate(angle)
      ctx.drawImage(this.image, this.anchor.x, this.anchor.y)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      return
    }

    ctx.drawImage(this.image, position.x + this.anchor.x, position.y + this.anchor.y)
  }

  protected makeSureImage() {
    if (!this.image) {
      this.image = this.target['resourceList'].find(r => r.name === this.filePath)?.value
      if (!this.image) {
        throw new Error(`Cannot render sprite for ${this.target.constructor.name}, image ${this.filePath} is not loaded!`)
      }
    }
  }
}

export interface ISprite {
  sprite: ISpriteComposition,
}

const COMPONEMT_NAME = 'sprite'
export const sprite: TComponent = {
  [COMPONENT_NAME_SYMBOL]: COMPONEMT_NAME,
  [COMPONENT_CONSTRUCTOR]: function (this: AEntity & ISprite, options: TDict) {
    this.sprite = new SpriteComposition(this, options?.filePath)
  }
}