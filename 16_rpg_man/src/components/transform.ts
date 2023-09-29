import {IVector2, Vector2} from '../infrastructure/Vector2'
import {ISize2, Size2} from '../infrastructure/Size2'
import {COMPONENT_NAME_SYMBOL} from '../infrastructure/addComponent'

export interface ITransform {
    position: Readonly<IVector2>
    size: Readonly<ISize2>
    anchor: Readonly<IVector2>
    scruff: IVector2

    body(): [number, number, number, number]

    moveTo(target: ITransform, step: number): void

    distanceTo(target: ITransform): number
}

/**
 * @deprecated TODO refactor
 */
export const transform: TComponent = {
    [COMPONENT_NAME_SYMBOL]: 'transform',

    ['$transform.position.x']: 0,
    ['$transform.position.y']: 0,
    ['$transform.size.w']: 1,
    ['$transform.size.h']: 1,
    ['$transform.anchor.x']: 0,
    ['$transform.anchor.y']: 0,

    get position() {
        return new Vector2(this['$transform.position.x'], this['$transform.position.y'])
    },

    set position(vector: IVector2) {
        this['$transform.position.x'] = vector.x
        this['$transform.position.y'] = vector.y
    },

    get size() {
        return new Size2(this['$transform.size.w'], this['$transform.size.h'])
    },

    set size(size: ISize2) {
        this['$transform.size.w'] = size.w
        this['$transform.size.h'] = size.h
    },

    get anchor() {
        return new Vector2(this['$transform.anchor.x'], this['$transform.anchor.y'])
    },

    set anchor(vector: IVector2) {
        this['$transform.anchor.x'] = vector.x
        this['$transform.anchor.y'] = vector.y
    },

    get scruff(): IVector2 {
        return new Vector2(
            this['$transform.position.x'] - this['$transform.anchor.x'],
            this['$transform.position.y'] - this['$transform.anchor.y']
        )
    },

    /**
     * Return [x, y, w, h] where x,y is the scruff (top left corner of the entity)
     */
    body(): [number, number, number, number] {
        return [
            this['$transform.position.x'] - this['$transform.anchor.x'],
            this['$transform.position.y'] - this['$transform.anchor.y'],
            this['$transform.size.w'],
            this['$transform.size.h'],
        ]
    },

    moveTo(target: ITransform, step: number) {
        this.position = this.position.moveTo(target.position, step)
    },

    distanceTo(target: ITransform): number {
        return this.position.distanceTo(target.position)
    }
}
