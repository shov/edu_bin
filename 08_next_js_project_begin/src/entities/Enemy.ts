import {AEntity} from '../infrastructure/AEntity'
import {mixin} from '../infrastructure/Mixer'
import {ITransform, transform} from '../mixins/transform'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'
import {IVector2, Vector2} from '../infrastructure/Vector2'
import {Size2} from '../infrastructure/Size2'
import {TInput} from '../infrastructure/InputManager'
import {GameController} from './GameController'
import {EnemyProjectile} from './EnemyProjectile'

export interface Enemy extends ITransform, IBoxCollider {

}

@mixin(boxCollider)
@mixin(transform)
export class Enemy extends AEntity {
    public tagList = ['enemy']

    isFireSet: boolean = false
    fireFreq = 3000 // ms
    static fireDesire = 0.2 // %

    public score = 10

    constructor(position: IVector2) {
        super()
        this.position = position
        this.size = new Size2(16, 15)
        this.anchor = new Vector2(0, 0)
    }

    update(dt: number, input: TInput) {
        if (this.vertices()[3].y >= this.scene.frameSize.h) {
            const gameController = this.scene.get<GameController>('gameController')!
            gameController.gameOver()
        }
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        ctx.fillStyle = 'black'
        ctx.fillRect(...this.body())
    }

    public firstRowFire(): boolean {
        if (!this.isFireSet && Math.random() <= Enemy.fireDesire) {
            this.isFireSet = true
            this.fire()
            setTimeout(this.canFire, this.fireFreq)
            return true
        }
        return false
    }

    fire() {
        const projectile = new EnemyProjectile(new Vector2(this.position.x + this.size.w / 2, this.scruff.y + 6))
        this.scene.add(projectile)
        projectile.init(this.scene)
    }

    canFire = () => {
        this.isFireSet = false
    }
}
