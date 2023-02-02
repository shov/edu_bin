import {ITransform} from './transform'
import {IVector2, Vector2} from '../Vector2'
import {IEntity} from '../AEntity'
import {MIXIN_NAME_SYMBOL, MIXIN_REQUIRE_SYMBOL} from '../Mixer'

export type TVertices4 = [IVector2, IVector2, IVector2, IVector2]

export interface IBoxCollider extends ITransform, IEntity {
    vertices(): TVertices4,

    hasCollisionWith(tag: string): boolean,
    hasCollisionWith(target: IBoxCollider): boolean,

    onCollisionWith(target: IBoxCollider, cb: (target: IBoxCollider) => void): void
    onCollisionWith(target: string, cb: (target: IBoxCollider[]) => void): void
}

export const boxCollider = {
    [MIXIN_NAME_SYMBOL]: 'boxCollider',
    [MIXIN_REQUIRE_SYMBOL]: ['transform'],

    vertices(this: IBoxCollider & ITransform): TVertices4 {
        const topLeft = this.scruff()
        const size = this.size
        return [
            topLeft,
            new Vector2({x: topLeft.x + size.w, y: topLeft.y}),
            new Vector2({x: topLeft.x + size.w, y: topLeft.y + size.h}),
            new Vector2({x: topLeft.x, y: topLeft.y + size.h}),
        ]
    },

    hasCollisionWith(this: IBoxCollider & ITransform, target: IBoxCollider | string): boolean {
        // Tag
        if('string' === typeof target) {
            const targetList = this.scene
                .findByTag(target)
                .filter(target => target.componentList.includes('boxCollider'))

            return targetList.some(target => this.hasCollisionWith(target as IBoxCollider))
        }

        // Another boxCollider entity
        const currVertices = this.vertices()
        const targetVertices = target.vertices()

        // TODO how to handle overlapping, allow it? layers?

        return currVertices[0].x < targetVertices[1].x
            && currVertices[1].x > targetVertices[0].x
            && currVertices[0].y < targetVertices[2].y
            && currVertices[2].y > targetVertices[0].y
    },

    onCollisionWith(this: IBoxCollider & ITransform, target: IBoxCollider | string, cb: (target: IBoxCollider | IBoxCollider[]) => void): void {

    }
}
