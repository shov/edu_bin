import {mixin} from '../infrastructure/Mixer'
import {ITransform, transform} from '../mixins/transform'
import {AEntity, IComponentMadeOF} from '../infrastructure/AEntity'
import {AScene} from '../infrastructure/AScene'
import {Vector2} from '../infrastructure/Vector2'
import {Size2} from '../infrastructure/Size2'
import {TInput} from '../infrastructure/InputManager'
import {Projectile} from './Projectile'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'

export interface PlayerSpaceShip extends IComponentMadeOF, ITransform, IBoxCollider {

}

@mixin(boxCollider)
@mixin(transform)
export class PlayerSpaceShip extends AEntity {
    tagList = ['player']

    SPEED = 10
    isFireSet: boolean = false
    fireFreq = 150 // ms

    init(scene: AScene) {
        this.size = new Size2(15, 25)
        this.anchor = new Vector2(this.size.w / 2, this.size.h / 2)
        this.position = new Vector2({
            x: scene.frameSize.w / 2,
            y: scene.frameSize.h - 15 - this.size.h / 2,
        })
        super.init(scene)
    }

    update(dt: number, input: TInput) {
        this.position = this.position.add(Vector2.right().mul(dt * input.horizontal * this.SPEED))
        const {x} = this.scruff
        if (x <= 0) {
            this.position = new Vector2(this.anchor.x, this.position.y)
        }
        if (x >= this.scene.frameSize.w) {
            this.position = new Vector2(this.scene.frameSize.w - this.size.w + this.anchor.x, this.position.y)
        }

        if (input.space && !this.isFireSet) {
            this.isFireSet = true
            this.fire()
            setTimeout(this.canFire, this.fireFreq)
        }
    }

    fire() {
        const projectile = new Projectile(new Vector2(this.position.x, this.scruff.y - 6))
        this.scene.add(projectile)
        projectile.init(this.scene)
    }

    canFire = () => {
        this.isFireSet = false
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        ctx.fillStyle = 'black'
        ctx.fillRect(...this.body())
    }
}
