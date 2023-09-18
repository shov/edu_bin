import { AEntity } from "../infrastructure/AEntity"
import { AScene } from "../infrastructure/AScene"
import { TInput } from "../infrastructure/InputManager"
import { mixin } from "../infrastructure/Mixer"
import { ISize2, Size2 } from "../infrastructure/Size2"
import { IVector2, Vector2 } from "../infrastructure/Vector2"
import { Apple } from "./Apple"
import { BoardMap } from "./BoardMap"
import { Snake } from "./Snake"

export class GameController extends AEntity {
  protected _boardSize!: ISize2
  public get boardSize(): ISize2 {
    return this._boardSize
  }

  readonly cellSize: number = 20
  screenColor: string = 'black'

  protected _isGameOver: boolean = false
  public get isGameOver() {
    return this._isGameOver
  }

  protected snek!: Snake

  protected appleList: Apple[] = []
  protected readonly MAX_APPLE_NUM = 5
  protected readonly APPLE_APPEAR_INTERVAL = 60 * 3
  protected currentCountdownToPlaceAnApple = this.APPLE_APPEAR_INTERVAL * Math.random() | 0

  protected boardMap!: BoardMap

  public init(scene: AScene) {
    super.init(scene)

    this._boardSize = new Size2((scene.frameSize.w / this.cellSize) | 0, (scene.frameSize.h / this.cellSize) | 0)

    this.snek = this.scene.get<Snake>('snake')!
    this.boardMap = this.scene.get<BoardMap>('boardMap')!
  }

  public update(dt: number, input: TInput): void {
    if (this.isGameOver && input.space) {
      this.snek.reset()
      this._isGameOver = false;
    }

    if (this.isGameOver) {
      return
    }

    // walls collision
    const collideAWall = this.boardMap.getAllWallsLocationList().some(w => w.equal(this.snek.getHeadPosition()))
    if(collideAWall) {
      this.gameOver()
      return
    }

    // apple collisions
    this.appleList = this.appleList.reduce<Apple[]>((acc, apple) => {
      if (this.snek.getHeadPosition().equal(apple.location)) {
        this.snek.willGrow()
        this.scene.remove(apple.name)
        return acc
      }

      acc.push(apple)
      return acc
    }, [])

    // new apples
    this.currentCountdownToPlaceAnApple--
    if (this.currentCountdownToPlaceAnApple <= 0) {
      switch (true) {
        case (this.appleList.length < this.MAX_APPLE_NUM): {
          const takenLocations = [
            ...this.appleList.map(a => a.location.clone()),
            ...this.boardMap.getAllWallsLocationList(),
            ...this.snek.getPositionList(),
            this.snek.getHeadPosition().add(Vector2.up()),
            this.snek.getHeadPosition().add(Vector2.down()),
            this.snek.getHeadPosition().add(Vector2.left()),
            this.snek.getHeadPosition().add(Vector2.right()),
            this.snek.getHeadPosition().add(Vector2.up().add(Vector2.right())),
            this.snek.getHeadPosition().add(Vector2.right().add(Vector2.down())),
            this.snek.getHeadPosition().add(Vector2.down().add(Vector2.left())),
            this.snek.getHeadPosition().add(Vector2.left().add(Vector2.up())),
          ]
          let appleLoc: IVector2
          do {
            appleLoc = new Vector2(
              (this.boardSize.w - 1) * Math.random() | 0,
              (this.boardSize.h - 1) * Math.random() | 0,
            )
          } while (takenLocations.some(t => t.equal(appleLoc)))

          const newApple = new Apple(appleLoc, this.scene.imageLoader.get('apple')!)
          this.scene.add(newApple)
          newApple.init(this.scene)
          this.appleList.push(newApple)
        }
        default: {
          this.currentCountdownToPlaceAnApple = this.APPLE_APPEAR_INTERVAL * Math.random() | 0
        }
      }
    }
  }

  render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {
    ctx.fillStyle = this.screenColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  protected readonly padding: number = 2
  public drawCell(ctx: CanvasRenderingContext2D, location: IVector2, color: string, strokeColor?: string) {
    ctx.fillStyle = color
    ctx.fillRect(
      location.x * this.cellSize + this.padding,
      location.y * this.cellSize + this.padding,
      this.cellSize - this.padding * 2,
      this.cellSize - this.padding * 2
    )

    if (strokeColor) {
      ctx.strokeStyle = strokeColor
      ctx.strokeRect(
        location.x * this.cellSize + this.padding,
        location.y * this.cellSize + this.padding,
        this.cellSize - this.padding * 2,
        this.cellSize - this.padding * 2
      )
    }
  }

  public drawSpriteOnBoard(ctx: CanvasRenderingContext2D, location: IVector2, sprite: HTMLImageElement, angle?: number) {
    if('number' === typeof angle) {
      ctx.translate(location.x * this.cellSize + sprite.width / 2, location.y * this.cellSize + sprite.height / 2)
      ctx.rotate(angle)
      ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      return
    }

    ctx.drawImage(sprite, location.x * this.cellSize, location.y * this.cellSize)
  }

  public gameOver() {
    this._isGameOver = true
  }
}