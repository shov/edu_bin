import { AScene } from "../infrastructure/AScene";
import { COMPONENT_CONSTRUCTOR, COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT, COMPONENT_NAME_SYMBOL } from "../infrastructure/addComponent";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { AEntity } from "../infrastructure/AEntity";
import { ISize2, Size2 } from "../infrastructure/Size2";
import { ImageResource } from "../infrastructure/ImageResource";

export enum EAnchor {
  LT, CENTER
}

interface ISpriteComposition {
  size: ISize2
  animation: AnimationComposition

  setAnchor(anchor: EAnchor): void
  render(ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number, position: IVector2, angle?: number): void
}

class SpriteComposition implements ISpriteComposition {
  public size: ISize2 = new Size2(0, 0)
  public animation: AnimationComposition = new AnimationComposition()

  protected anchor: EAnchor = EAnchor.CENTER
  protected offset: IVector2 = Vector2.zero()

  protected image!: HTMLImageElement


  constructor(protected target: AEntity, protected filePath: string) {
    if ('string' !== typeof filePath || filePath.length < 0) {
      throw new Error(`No sprite file path!`)
    }

    this.target['resourceList'].push(new ImageResource(filePath, filePath))
  }

  setAnchor(anchor: EAnchor) {
    this.anchor = anchor
  }

  render(ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number, position: IVector2, angle?: number | undefined): void {
    this.makeSureImage()

    // set offset and size of a current frame
    if (this.animation.isPLayed) {
      const data = this.animation.trackPlayback(dt, delta, fps)
      this.size = data.size
      this.offset = data.offset
    }

    const anchor = this.getAnchorOffset()

    if ('number' === typeof angle) {
      ctx.translate(position.x + anchor.x, position.y + anchor.y)
      ctx.rotate(angle)
      ctx.drawImage(
        this.image,
        this.offset.x,
        this.offset.y,
        this.size.w,
        this.size.h,
        anchor.x,
        anchor.y,
        this.size.w,
        this.size.h
      )
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      return
    }

    ctx.drawImage(
      this.image,
      this.offset.x,
      this.offset.y,
      this.size.w,
      this.size.h,
      position.x + anchor.x,
      position.y + anchor.y,
      this.size.w,
      this.size.h
    )
  }

  protected getAnchorOffset(): IVector2 {
    if (EAnchor.LT === this.anchor) {
      return Vector2.zero()
    }
    return new Vector2(this.size.w, this.size.h).mul(-0.5)
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

type TAnimation = {
  name: string,
  frameSize: ISize2,
  frameDuration: number, // ms
  firstFrameOffset: IVector2,
  nextFrameOffset: IVector2,
  length: number, // number of frames
}

type TAnimationCompositionTrackData = { size: ISize2, offset: IVector2 }
class AnimationComposition {
  public isPLayed: boolean = false

  protected animationDict: Record<string, TAnimation> = {}
  protected playedName?: string
  protected accDelta: number = 0
  protected currFrame: number = 0

  addAnimation(animation: TAnimation): void
  addAnimation(animationList: TAnimation[]): void
  addAnimation(a: TAnimation | TAnimation[]): void {
    const animationList = Array.isArray(a) ? a : [a]
    animationList.forEach(a => this.animationDict[a.name] = a)
    return
  }

  play(name: string) {
    if ('object' !== typeof this.animationDict[name]) {
      throw new Error(`Cannot play animation ${name}, not found`)
    }
    if (!this.isPLayed || this.playedName !== name) {
      this.isPLayed = true
      this.playedName = name
      this.accDelta = 0
      this.currFrame = 0
    }
  }

  stop() {
    this.isPLayed = false
  }

  trackPlayback(dt: number, delta: number, fps: number): TAnimationCompositionTrackData {
    if (!this.isPLayed || 'string' !== typeof this.playedName) {
      throw new Error(`Cannot track playback, it's stopped or no name set`)
    }

    const ani = this.animationDict[this.playedName]

    // calculate current frame 
    const timePassed = this.accDelta + delta
    this.currFrame = (this.currFrame + (timePassed / ani.frameDuration) | 0) % ani.length
    this.accDelta = timePassed % ani.frameDuration

    return {
      size: ani.frameSize.clone(),
      offset: ani.firstFrameOffset.add(ani.nextFrameOffset.mul(this.currFrame))
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