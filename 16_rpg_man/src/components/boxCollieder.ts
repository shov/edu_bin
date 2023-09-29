import {ITransform} from './transform'
import {IVector2, Vector2} from '../infrastructure/Vector2'
import {IEntity} from '../infrastructure/AEntity'
import {COMPONENT_NAME_SYMBOL, COMPONENT_REQUIRE_SYMBOL} from '../infrastructure/addComponent'

export type TVertices4 = [IVector2, IVector2, IVector2, IVector2]

export interface IBoxCollider extends ITransform, IEntity {
    vertices(): TVertices4,

    hasCollisionWith(target: IBoxCollider): boolean,

    onCollisionWith(target: IBoxCollider, cb: (target: IBoxCollider) => void): void

    onCollisionWith(target: string, cb: (targetList: IBoxCollider[]) => void): void

    unsubscribeFromCollisionWith(target: IBoxCollider, cb?: any): void

    unsubscribeFromCollisionWith(target: string, cb?: any): void

    callCollision(body: IBoxCollider): void

    callTagCollision(tag: string, bodyList: IBoxCollider[]): void
}

/**
 * @deprecated TODO REFACTOR 
 */
export const boxCollider = {
    [COMPONENT_NAME_SYMBOL]: 'boxCollider',
    [COMPONENT_REQUIRE_SYMBOL]: ['transform'],

    vertices(this: IBoxCollider & ITransform): TVertices4 {
        const topLeft = this.scruff
        const size = this.size
        return [
            topLeft,
            new Vector2({x: topLeft.x + size.w, y: topLeft.y}),
            new Vector2({x: topLeft.x + size.w, y: topLeft.y + size.h}),
            new Vector2({x: topLeft.x, y: topLeft.y + size.h}),
        ]
    },

    hasCollisionWith(this: IBoxCollider & ITransform, target: IBoxCollider): boolean {
        // Another boxCollider entity
        const currVertices = this.vertices()
        const targetVertices = target.vertices()

        return currVertices[0].x < targetVertices[1].x
            && currVertices[1].x > targetVertices[0].x
            && currVertices[0].y < targetVertices[2].y
            && currVertices[2].y > targetVertices[0].y
    },

    onCollisionWith(this: IBoxCollider & ITransform & TDict, target: IBoxCollider | string, cb: (target: IBoxCollider | IBoxCollider[]) => void): void {
        if ('string' === typeof target) {
            type S = { [tag: string]: (typeof cb)[] }
            this['boxCollider.tagSubscriptionDict'] ??= {} as S

            this['boxCollider.tagSubscriptionDict'][target] ??= []
            this['boxCollider.tagSubscriptionDict'][target].push(cb)
        } else {
            type B = Map<IBoxCollider, (typeof cb)[]>
            this['boxCollider.bodySubscriptionMap'] ??= new Map() as B

            const listenerList = (this['boxCollider.bodySubscriptionMap'] as B).get(target) || []
            listenerList.push(cb)
            ;(this['boxCollider.bodySubscriptionMap'] as B).set(target, listenerList)
        }
    },

    unsubscribeFromCollisionWith(this: IBoxCollider & ITransform & TDict, target: IBoxCollider | string, cb?: any): void {
        if ('string' === typeof target) {
            type S = { [tag: string]: (typeof cb)[] }
            this['boxCollider.tagSubscriptionDict'] ??= {} as S

            if (!cb) {
                delete this['boxCollider.tagSubscriptionDict'][target]
                return
            }

            if (!this['boxCollider.tagSubscriptionDict'][target]) {
                return
            }

            ;(this['boxCollider.tagSubscriptionDict'] as S)[target]
                = (this['boxCollider.tagSubscriptionDict'] as S)[target]
                .filter(listener => listener !== cb)
        } else {
            type B = Map<IBoxCollider, (typeof cb)[]>
            this['boxCollider.bodySubscriptionMap'] ??= new Map() as B

            if (!cb) {
                ;(this['boxCollider.bodySubscriptionMap'] as B).delete(target)
                return
            }

            let listenerList = (this['boxCollider.bodySubscriptionMap'] as B).get(target)

            if (!listenerList) {
                return
            }

            listenerList = listenerList.filter(listener => listener !== cb)
            ;(this['boxCollider.bodySubscriptionMap'] as B).set(target, listenerList)
        }
    },

    callCollision(this: IBoxCollider & ITransform & TDict, body: IBoxCollider): void {
        type B = Map<IBoxCollider, ((target: IBoxCollider) => void)[]>
        this['boxCollider.bodySubscriptionMap'] ??= new Map()

        ;((this['boxCollider.bodySubscriptionMap'] as B).get(body) || []).forEach(cb => cb(body))
    },

    callTagCollision(this: IBoxCollider & ITransform & TDict, tag: string, bodyList: IBoxCollider[]): void {
        type S = { [tag: string]: ((targetList: IBoxCollider[]) => void)[] }
        this['boxCollider.tagSubscriptionDict'] ??= {} as S

        if (!this['boxCollider.tagSubscriptionDict'][tag]) {
            return
        }

        ;(this['boxCollider.tagSubscriptionDict'] as S)[tag].forEach(cb => cb(bodyList))
    },
}
