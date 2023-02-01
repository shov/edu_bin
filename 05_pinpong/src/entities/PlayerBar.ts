import {AEntity} from '../AEntity'
import {mixin} from '../Mixer'
import {IPosition, position} from '../mixins/position'
import {IRect, rect} from '../mixins/rect'
import {AScene} from '../AScene'
import {TInput} from '../InputManager'
import {ILockedOnScreen, lockedOnScreen} from '../mixins/lockedOnScreen'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'

export interface PlayerBar extends IPosition, IRect, ILockedOnScreen, IBoxCollider {
}

@mixin(position)
@mixin(rect)
@mixin(lockedOnScreen)
@mixin(boxCollider)
export class PlayerBar extends AEntity {
    public speed = 5

    init(scene: AScene, canvas: HTMLCanvasElement) {
        super.init(scene, canvas)

        this.x = canvas.width / 2
        this.y = canvas.height - 10
        this.w = 50
        this.h = 15
        this.anchor = {x: this.w / 2, y: this.h}

    }

    update(dt: number, input: TInput) {
        this.x += dt * this.speed * input.horizontal
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        ctx.fillStyle = 'black'
        ctx.fillRect(...this.body(this.position))
    }

    public moveUp (value: number) {
        setTimeout(() => {
            this.y -= value
        }, 200)
    }

    public increaseSpeed(value: number) {
        this.speed += value
    }
}
