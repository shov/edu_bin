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
      {
        name: 'hit_r',
        frameSize: new Size2(64, 64),
        frameDuration: 400, //ms
        firstFrameOffset: new Vector2(64, 0).mul(24 + 1),
        nextFrameOffset: new Vector2(64, 0),
        length: 1,
      },
    ])
    this.sprite.animation.play('idle_d')
  }

  walk: number = 0
  direction: EPlDir = EPlDir.DOWN
  speed: number = 1
  indleAnimMap = {
    [EPlDir.DOWN]: 'idle_d',
    [EPlDir.RIGHT]: 'idle_r',
    [EPlDir.UP]: 'idle_u',
    [EPlDir.LEFT]: 'idle_l',
  }
  walkAnimMap = {
    [EPlDir.DOWN]: 'walk_d',
    [EPlDir.RIGHT]: 'walk_r',
    [EPlDir.UP]: 'walk_u',
    [EPlDir.LEFT]: 'walk_l',
  }
  wlakMoveMap = {
    [EPlDir.DOWN]: Vector2.down(),
    [EPlDir.RIGHT]: Vector2.right(),
    [EPlDir.UP]: Vector2.up(),
    [EPlDir.LEFT]: Vector2.left(),
  }
  isHit: boolean = false

  subscribedOnInput: boolean = false
  public update(dt: number, input: TInput): void {
    if (!this.subscribedOnInput) {
      input.onKeyDown('KeyW', () => { this.direction = EPlDir.UP; this.walk ^= 8 })
      input.onKeyUp('KeyW', () => { this.walk ^= 8 })
      input.onKeyDown('KeyD', () => { this.direction = EPlDir.RIGHT; this.walk ^= 4 })
      input.onKeyUp('KeyD', () => { this.walk ^= 4 })
      input.onKeyDown('KeyS', () => { this.direction = EPlDir.DOWN; this.walk ^= 2 })
      input.onKeyUp('KeyS', () => { this.walk ^= 2 })
      input.onKeyDown('KeyA', () => { this.direction = EPlDir.LEFT; this.walk ^= 1 })
      input.onKeyUp('KeyA', () => { this.walk ^= 1 })
      input.onKeyDown('Space', () => {
        if(this.isHit) {
          return
        }
        this.isHit = true
        this.sprite.animation.play('hit_r')
        
        setTimeout(() => {
          this.sprite.animation.play(this.indleAnimMap[this.direction])
        }, 300) // idle
        setTimeout(() => {
          this.isHit = false
        }, 450) // CD
      })
      input.onKeyUp('Space', () => {})
      this.subscribedOnInput = true
    }

    // Cannot move or idle while hit
    if(this.isHit) {
      return
    }

    if(this.walk < 0 || false === (input.up || input.down || input.right || input.left)) { // for anykey guys
      this.walk = 0
    }

    if (this.walk > 0) {
      this.sprite.animation.play(this.walkAnimMap[this.direction])
    } else {
      this.sprite.animation.play(this.indleAnimMap[this.direction])
    }

    if (this.walk) {
      this.position = this.position.add(this.wlakMoveMap[this.direction].mul(dt).mul(this.speed))
    }
  }
  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    const pos = this.position.clone()
    this.sprite.render(ctx, dt, delta, fps, pos)
  }
}