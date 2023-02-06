import {Projectile} from './Projectile'
import {TInput} from '../infrastructure/InputManager'
import {IComponentMadeOF} from '../infrastructure/AEntity'
import {ITransform} from '../mixins/transform'
import {IBoxCollider} from '../mixins/boxCollieder'
import {IVector2, Vector2} from '../infrastructure/Vector2'
import {Size2} from '../infrastructure/Size2'
import {GameController} from './GameController'

export interface EnemyProjectile extends IComponentMadeOF, ITransform, IBoxCollider {

}

export class EnemyProjectile extends Projectile {
    tagList = ['enemyProjectile']

    SPEED = Vector2.down().mul(2)
    protected create(position: IVector2) {
        this.position = position
        this.size = new Size2(6, 6)
        this.anchor = new Vector2(3, 3)

        this.onCollisionWith('player', (targetList) => {
            targetList[0].destroy()
            const gameController = this.scene.get<GameController>('gameController')!
            gameController.gameOver()
            this.destroy()
        })
    }

    update(dt: number, input: TInput) {
        if(this.position.y > this.scene.frameSize.h + 10) {
            this.destroy()
        }

        this.position = this.position.add(this.SPEED.mul(dt))
    }
}
