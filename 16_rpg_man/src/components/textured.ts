import { AEntity } from "../infrastructure/AEntity";
import { ImageResource } from "../infrastructure/ImageResource";
import { ISize2, Size2 } from "../infrastructure/Size2";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { COMPONENT_CONSTRUCTOR, COMPONENT_NAME_SYMBOL } from "../infrastructure/addComponent";

type TTexturedComposition = {
  renderRect(ctx: CanvasRenderingContext2D, position: IVector2, size: ISize2): void
}

export interface ITextured {
  textured: TTexturedComposition,
}

class TexturedComposiution {
  public size: ISize2 = new Size2(0, 0) // the same size for source and projection so far
  // no offsets so far

  protected image!: HTMLImageElement

  constructor(protected target: AEntity, protected filePath: string) { }

  renderRect(ctx: CanvasRenderingContext2D, position: IVector2, rectSizeOrigin: ISize2) {
    this.makeSureResourceLoaded() 

    const rectSize = rectSizeOrigin.clone()
    let offset = Vector2.zero()
    // render rows (if the rest render not a whole row)
    while (rectSize.h > 0) {
      const height = Math.min(this.size.h, rectSize.h) // full height or the rest
      
      // render line (if the rest -=-)
      while (rectSize.w > 0) {
        const width = Math.min(this.size.w, rectSize.w) // full width or the rest
        const drawPos = position.add(offset)
        ctx.drawImage(
          this.image,
          0, 0,
          width, height,
          drawPos.x, drawPos.y,
          width, height,
        )
        rectSize.w -= width
        offset = offset.add(new Vector2(width, 0))
      }

      rectSize.w = rectSizeOrigin.w
      offset.x = 0
      rectSize.h -= height
      offset = offset.add(new Vector2(0, height))
    }
  }

  protected makeSureResourceLoaded() {
    if (!this.image) {
      this.image = this.target['resourceList'].find(r => r.name === this.filePath)?.value

      if (!this.image) {
        throw new Error(`Cannot render a texture for ${this.target.constructor.name}, image ${this.filePath} is not loaded!`)
      }

      if (this.size.w === 0 && this.size.h === 0) { // default to img size
        this.size = new Size2(this.image.width, this.image.height)
      }
    }
  }
}
export const textured: TComponent = {
  [COMPONENT_NAME_SYMBOL]: 'textured',
  [COMPONENT_CONSTRUCTOR]: function (this: AEntity & ITextured, options: TDict) {
    if ('string' !== typeof options.filePath) {
      throw new Error('Cannot load a texture, no file path set')
    }
    this['resourceList'].push(new ImageResource(options.filePath, options.filePath))
    this.textured = new TexturedComposiution(this, options.filePath)
  },
}