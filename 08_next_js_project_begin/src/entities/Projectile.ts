import {mixin} from '../infrastructure/Mixer'
import {ITransform, transform} from '../mixins/transform'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'
import {AEntity, IComponentMadeOF} from '../infrastructure/AEntity'
import {Size2} from '../infrastructure/Size2'
import {IVector2, Vector2} from '../infrastructure/Vector2'
import {TInput} from '../infrastructure/InputManager'
import {GameController} from './GameController'
import {Enemy} from './Enemy'

export interface Projectile extends IComponentMadeOF, ITransform, IBoxCollider {

}

@mixin(boxCollider)
@mixin(transform)
export class Projectile extends AEntity {
    SPEED = Vector2.up().mul(10)

    constructor(position: IVector2) {
        super()
        this.create(position)
    }

    protected create(position: IVector2) {
        this.position = position
        this.size = new Size2(6, 6)
        this.anchor = new Vector2(3, 3)

        this.onCollisionWith('enemy', (targetList) => {
            const gameController = this.scene.get<GameController>('gameController')!
            targetList.forEach(enemy => {
                gameController.addScore(enemy as unknown as Enemy)
                enemy.destroy()
            })
            this.destroy()
        })

        this.onCollisionWith('enemyProjectile', (targetList) => {
            targetList.forEach(enemyProjectile => {
                enemyProjectile.destroy()
            })
            this.destroy()
        })
    }

    update(dt: number, input: TInput) {
        if (this.position.y < -10) {
            this.destroy()
        }

        this.position = this.position.add(this.SPEED.mul(dt))
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        const {x, y} = this.position
        const {w, h} = this.size

        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
    }
}
