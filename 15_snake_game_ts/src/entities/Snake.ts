import { AEntity } from "../infrastructure/AEntity";
import { AScene } from "../infrastructure/AScene";
import { TInput } from "../infrastructure/InputManager";
import { IVector2, Vector2 } from "../infrastructure/Vector2";
import { GameController } from "./GameController";

const rndClr = (from: number = 100, to: number = 255) => (from + Math.random() * (to - from) | 0).toString(16)
const randomGreenBody = () => {
  const green = rndClr(160, 200)
  const sec = rndClr(50, 70)
  return `#${sec}${green}${sec}`
}

class SnakeSegment {
  static readonly HEAD_COLOR: string = 'lime'
  static readonly BODY_COLOR: string = 'green'

  location: IVector2 = new Vector2(0, 0)
  color: string = randomGreenBody()

  public render(ctx: CanvasRenderingContext2D, gc: GameController): void {
    gc.drawCell(ctx, this.location, this.color)
  }

  public follow(next: SnakeSegment): void {
    this.location = next.location.clone()
  }

  public moveBy(deltaLoc: IVector2): void {
    this.location = this.location.add(deltaLoc)
  }

}

class SnakeHeadSegment extends SnakeSegment {
  color: string = SnakeSegment.HEAD_COLOR
  constructor(location: Vector2) {
    super()
    this.location = location.clone()
  }
}

export class Snake extends AEntity {
  protected readonly MOVE_INTERVAL: number = 8 // todo use dt
  protected readonly MIN_MOVE_INTERVAL: number = 3
  protected readonly MAX_LENGTH: number = 100
  protected readonly DEFAULT_DELTA: Vector2 = new Vector2(0, 1)

  protected lastAcceptedDtLoc = this.DEFAULT_DELTA

  protected startLocation!: IVector2
  protected deltaLoc!: IVector2
  protected segmentList!: SnakeSegment[]
  protected head!: SnakeSegment

  protected ticksToNextMove: number = this.MOVE_INTERVAL
  protected toGrow: number = 0

  protected gc!: GameController


  public init(scene: AScene): void {
    super.init(scene)

    this.gc = scene.get<GameController>('gameController')!
    if (!this.gc) { throw new Error('GameController not found') }

    this.reset()
  }

  public update(dt: number, input: TInput): void {
    if (this.gc.isGameOver) {
      return
    }

    // snek cannot change direction to an opposite!
    const ladl = this.lastAcceptedDtLoc
    const isLen1 = this.segmentList.length === 1
    if (
      input.up
      && (isLen1 || !ladl.equal(Vector2.down()))
    ) {
      this.deltaLoc = Vector2.up()
    } else if (
      input.down
      && (isLen1 || !ladl.equal(Vector2.up()))
    ) {
      this.deltaLoc = Vector2.down()
    } else if (
      input.left
      && (isLen1 || !ladl.equal(Vector2.right()))
    ) {
      this.deltaLoc = Vector2.left()
    } else if (
      input.right
      && (isLen1 || !ladl.equal(Vector2.left()))
    ) {
      this.deltaLoc = Vector2.right()
    }

    this.ticksToNextMove -= 1
    if (this.ticksToNextMove <= 0) {

      // grow
      if (input.shiftKey) {
        this.grow()
      }

      while(this.toGrow > 0) {
        this.grow()
        this.toGrow--
      }

      // one step delta loc
      const deltaLoc: Vector2 = this.deltaLoc.clone()

      // last accepted dt loc
      this.lastAcceptedDtLoc = deltaLoc.clone()

      // detect out of the board
      // transfer to another side?
      {
        const nextCell = this.head.location.add(deltaLoc)
        if (nextCell.x < 0) {
          deltaLoc.x = this.gc.boardSize.w - 1 // move to the very right 
        }
        if (nextCell.x >= this.gc.boardSize.w) {
          deltaLoc.x = 1 - this.gc.boardSize.w // move to the very left
        }
        if (nextCell.y < 0) {
          deltaLoc.y = this.gc.boardSize.h - 1 // move to the very bottom
        }
        if (nextCell.y >= this.gc.boardSize.h) {
          deltaLoc.y = 1 - this.gc.boardSize.h // move to the very top
        }
      }

      // detect collision with the tail
      // game over
      {
        const nextCell = this.head.location.add(deltaLoc)
        const isCollidedTheTail = this.segmentList
          .slice(0, -1)
          .some(seg => seg.location.equal(nextCell))

        if (isCollidedTheTail) {
          this.gc.gameOver()
          return
        }
      }

      // - detect collision with an obstacle
      // - detect collision with an apple
      //  \_ are conducted by GameController

      this.moveBy(deltaLoc)
      this.ticksToNextMove = Math.max(this.MOVE_INTERVAL / (this.segmentList.length / 2) | 0, this.MIN_MOVE_INTERVAL)
    }
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    this.segmentList.forEach(seg => {
      seg.render(ctx, this.gc)
    })
  }

  public reset() {
    this.startLocation = new Vector2((this.gc.boardSize.w / 2 | 0) - 1, (this.gc.boardSize.h / 2 | 0) - 1)
    this.segmentList = [new SnakeHeadSegment(this.startLocation)];
    this.head = this.segmentList[0]
    this.deltaLoc = this.DEFAULT_DELTA
  }

  public getPositionList(): IVector2[] {
    return this.segmentList.map(seg => seg.location.clone())
  }

  public getHeadPosition(): IVector2 {
    return this.head.location.clone()
  }

  public willGrow(): void {
    this.toGrow++
  }

  protected grow(): void {
    if (this.segmentList.length < this.MAX_LENGTH) {
      this.segmentList.push(new SnakeSegment())
    }
  }

  protected moveBy(deltaLoc: IVector2): void {
    for (let i = this.segmentList.length - 1; i > 0; i--) {
      this.segmentList[i]
        .follow(this.segmentList[i - 1])
    }
    this.head.moveBy(deltaLoc)
  }
}