import {mixin} from '../Mixer'
import {ITransform, transform} from '../mixins/transform'
import {AEntity} from '../AEntity'
import {AScene} from '../AScene'
import {Vector2} from '../Vector2'
import {Size2} from '../Size2'

export interface PlayerSpaceShip extends ITransform {

}

@mixin(transform)
export class PlayerSpaceShip extends AEntity {
    init(scene: AScene, canvas: HTMLCanvasElement) {
        this.size = new Size2(15, 25)
        this.anchor = new Vector2(this.size.w / 2, this.size.h / 2)
        this.position = new Vector2({
            x: canvas.width / 2,
            y: canvas.height - 15 - this.size.h / 2,
        })
        super.init(scene, canvas)
    }
}
