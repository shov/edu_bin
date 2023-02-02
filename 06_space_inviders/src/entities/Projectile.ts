import {mixin} from '../Mixer'
import {ITransform, transform} from '../mixins/transform'
import {boxCollider, IBoxCollider} from '../mixins/boxCollieder'
import {AEntity} from '../AEntity'
import {Size2} from '../Size2'
import {Vector2} from '../Vector2'

export interface Projectile extends ITransform, IBoxCollider {

}

@mixin(transform)
@mixin(boxCollider)
export class Projectile extends AEntity {
    constructor() {
        super()
        this.size = new Size2(6, 6)
        this.anchor = new Vector2(3, 3)
    }

}
