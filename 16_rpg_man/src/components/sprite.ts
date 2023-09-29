import { AScene } from "../infrastructure/AScene";
import { COMPONENT_CONSTRUCTOR, COMPONENT_NAME_SYMBOL } from "../infrastructure/addComponent";
import { IVector2 } from "../infrastructure/Vector2";
import { AEntity } from "../infrastructure/AEntity";

interface ISpriteComposition {
  get anchor(): IVector2,
  set anchor(anchor: IVector2): void,
  // scale?

  get scene(): AScene,
  set scene(scene: AScene): void,

  render(ctx: CanvasRenderingContext2D, dt: number, position: IVector2, angle?: number): void

  configAnimation(): void
}

class SpriteComposition implements ISpriteComposition {
  constructor(protected target: AEntity) { }

}

export interface ISprite {
  sprite: ISpriteComposition,
}

export const sprite: TComponent = {
  [COMPONENT_NAME_SYMBOL]: 'spite',
  ['$sprite.scene']: void 0, // if it's spite it has to have a scane
  [COMPONENT_CONSTRUCTOR]: (target: AEntity & ISprite) => {
    target.sprite = new SpriteComposition(target)
  }

}