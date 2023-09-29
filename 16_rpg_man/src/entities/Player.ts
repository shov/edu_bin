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

  direction: EPlDir = EPlDir.DOWN
  speed: number = 1
  movement: IVector2 = Vector2.zero()
  directionMap = {
    [EPlDir.DOWN]: { idle: 'idle_d', walk: 'walk_d', move: Vector2.down() },
    [EPlDir.RIGHT]: { idle: 'idle_r', walk: 'walk_r', move: Vector2.right() },
    [EPlDir.UP]: { idle: 'idle_u', walk: 'walk_u', move: Vector2.up() },
    [EPlDir.LEFT]: { idle: 'idle_l', walk: 'walk_l', move: Vector2.left() },
  }
  keyboardDirectionMap: Record<string, EPlDir> = {
    'KeyW': EPlDir.UP,
    'ArrowUp': EPlDir.UP,
    'KeyA': EPlDir.LEFT,
    'ArrowLeft': EPlDir.LEFT,
    'KeyD': EPlDir.RIGHT,
    'ArrowRight': EPlDir.RIGHT,
    'KeyS': EPlDir.DOWN,
    'ArrowDown': EPlDir.DOWN,
  }

  isHit: boolean = false

  protected onKeyDown(e: KeyboardEvent) {
    if (void 0 !== this.keyboardDirectionMap[e.code]) {
      this.direction = this.keyboardDirectionMap[e.code]
      this.movement = this.directionMap[this.direction].move
      this.sprite.animation.play(this.directionMap[this.direction].walk)
    }
  }

  protected onKeyUp(e: KeyboardEvent) {
    
  }

  protected onSpacePress() {
    if (this.isHit) return
    
    this.isHit = true

    this.sprite.animation.play('hit_r') // Right or Left

    setTimeout(() => {
      this.sprite.animation.play(this.directionMap[this.direction].idle)
    }, 350)
    setTimeout(() => {
      this.isHit = false
    }, 450)

  }

  protected onBPress() {
    // block Right or Left
  }

  subscribedOnInput: boolean = false
  public update(dt: number, input: TInput): void {
    if (!this.subscribedOnInput) {
      input.onKeyDown(this.onKeyDown.bind(this))
      input.onKeyUp(this.onKeyUp.bind(this))
      input.onKeyDown('KeyB', this.onBPress.bind(this))
      input.onKeyDown('Space', this.onSpacePress.bind(this))
    }

    const moveKeyPressed = input.up || input.down || input.right || input.left
    if(moveKeyPressed && !this.isHit) {
      this.position = this.position.add(this.movement.mul(this.speed).mul(dt))
    }

    if(!moveKeyPressed && !this.isHit) {
      this.sprite.animation.play(this.directionMap[this.direction].idle)
    }

  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    const pos = this.position.clone()
    this.sprite.render(ctx, dt, delta, fps, pos)
  }
}