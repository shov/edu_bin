import {IPosition} from './position'
import {IRect} from './rect'

// TODO not actually IRect must be there
export interface IBoxCollider extends IRect, IPosition {
    vertices(): TVertices4,

    hasCollisionWith(target: IBoxCollider): boolean,
}

export const boxCollider = {
    vertices(this: IBoxCollider & IRect & IPosition): TVertices4 {
        const topLeft = this.scruff(this.position)
        return [
            topLeft,
            {x: topLeft.x + this.w, y: topLeft.y},
            {x: topLeft.x + this.w, y: topLeft.y + this.h},
            {x: topLeft.x, y: topLeft.y + this.h},
        ]
    },

    hasCollisionWith(this: IBoxCollider & IRect & IPosition, target: IBoxCollider): boolean {
        const currVertices = this.vertices()
        const targetVertices = target.vertices()

        return currVertices[0].x < targetVertices[1].x
            && currVertices[1].x > targetVertices[0].x
            && currVertices[0].y < targetVertices[2].y
            && currVertices[2].y > targetVertices[0].y
    },
}
