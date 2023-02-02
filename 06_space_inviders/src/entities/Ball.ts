import {AEntity} from '../AEntity'
import {mixin} from '../Mixer'
import {IPosition, position} from '../mixins/position'
import {IRect, rect} from '../mixins/rect'
import {ILockedOnScreen, lockedOnScreen} from '../mixins/lockedOnScreen'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'
import {AScene} from '../AScene'
import {TInput} from '../InputManager'
import {PlayerBar} from './PlayerBar'
import {GameController} from './GameController'

export interface Ball extends IPosition, IRect, ILockedOnScreen, IBoxCollider {
}

@mixin(position)
@mixin(rect)
@mixin(boxCollider)
export class Ball extends AEntity {
    public speed: TVector2 = {
        x: 4,
        y: 4,
    }

    public gameController!: GameController

    init(scene: AScene, canvas: HTMLCanvasElement) {
        this.position = {
            x: Math.random() * canvas.width,
            y: 20,
        }

        this.h = 10
        this.w = 10

        this.anchor = {
            x: 5,
            y: 5,
        }

        super.init(scene, canvas)
        this.gameController = this._scene.get<GameController>('gameController')!
    }

    update(dt: number, input: TInput) {
        const playerBar = this._scene.get<PlayerBar>('playerBar')!

        if (this.hasCollisionWith(this._scene.wallList.top)) {
            this.speed.y *= -1
        }

        if (this.hasCollisionWith(playerBar)) {
            this.y -= 7
            this.speed.y *= -1
            this.gameController.increaseScore()
        }

        if (this.hasCollisionWith(this._scene.wallList.left) || this.hasCollisionWith(this._scene.wallList.right)) {
            this.speed.x *= -1
        }

        if (this.hasCollisionWith(this._scene.wallList.bottom)) {
            this.gameController.gameOver()
        }

        this.position = {
            x: this.x += this.speed.x,
            y: this.y += this.speed.y,
        }
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        ctx.fillStyle = 'orange'
        ctx.beginPath()
        ctx.ellipse(...this.body(this.position), 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }

    public speedUp(value: TVector2) {
        const vxm = this.speed.x / Math.abs(this.speed.x)
        const vym = this.speed.y / Math.abs(this.speed.y)

        this.speed.x += value.x * vxm
        this.speed.y += value.y * vxm
    }
}
