import { ISprite, sprite } from "../components/sprite";
import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { TInput } from "../infrastructure/InputManager";
import { Size2 } from "../infrastructure/Size2";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { addComponent } from "../infrastructure/addComponent";

enum EPlDir {
  DOWN, RIGHT, UP, LEFT,
}

export interface Player extends ISprite { }
@addComponent(sprite, { filePath: 'assets/chel.png' })
export class Player extends AEntity {
  static readonly ANIMATION_SPEED = 400
  position!: IVector2
  public init(scene: AScene): void | Promise<void> {
    super.init(scene)
    this.position = new Vector2(scene.frameSize.w, scene.frameSize.h).mul(0.5)
    this.sprite.animation.addAnimation([
      {
        name: 'idle_d',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: Vector2.zero(),
        nextFrameOffset: new Vector2(64, 0),
        length: 4,
      },
      {
        name: 'walk_d',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(4),
        nextFrameOffset: new Vector2(64, 0),
        length: 2,
      },
      {
        name: 'walk_r',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(6),
        nextFrameOffset: new Vector2(64, 0),
        length: 2,
      },
      {
        name: 'idle_r',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(8),
        nextFrameOffset: new Vector2(64, 0),
        length: 4,
      },
      {
        name: 'idle_u',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(12),
        nextFrameOffset: new Vector2(64, 0),
        length: 4,
      },
      {
        name: 'walk_u',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(16),
        nextFrameOffset: new Vector2(64, 0),
        length: 2,
      },
      {
        name: 'walk_l',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(18),
        nextFrameOffset: new Vector2(64, 0),
        length: 2,
      },
      {
        name: 'idle_l',
        frameSize: new Size2(64, 64),
        frameDuration: Player.ANIMATION_SPEED, //ms
        firstFrameOffset: new Vector2(64, 0).mul(20),
        nextFrameOffset: new Vector2(64, 0),
        length: 4,
      },
    ])
    this.sprite.animation.play('idle_d')
  }

  direction: EPlDir = EPlDir.DOWN
  speed: number = 1
  indleAnimMap = {
    [EPlDir.DOWN]: 'idle_d',
    [EPlDir.RIGHT]: 'idle_r',
    [EPlDir.UP]: 'idle_u',
    [EPlDir.LEFT]: 'idle_l',
  }
  public update(dt: number, input: TInput): void {
    let move: IVector2 | null = null
    if (input.down) {
      this.direction = EPlDir.DOWN
      move = Vector2.down().mul(dt).mul(this.speed)
      this.sprite.animation.play('walk_d')
    } else if (input.right) {
      this.direction = EPlDir.RIGHT
      move = Vector2.right().mul(dt).mul(this.speed)
      this.sprite.animation.play('walk_r')
    } else if (input.up) {
      this.direction = EPlDir.UP
      move = Vector2.up().mul(dt).mul(this.speed)
      this.sprite.animation.play('walk_u')
    } else if (input.left) {
      this.direction = EPlDir.LEFT
      move = Vector2.left().mul(dt).mul(this.speed)
      this.sprite.animation.play('walk_l')
    } else {
      this.sprite.animation.play(this.indleAnimMap[this.direction])
    }

    if (move) {
      this.position = this.position.add(move)
    }
  }
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    const pos = this.position.clone()
    this.sprite.render(ctx, dt, delta, fps, pos)
  }
}