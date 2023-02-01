export interface IPosition extends TVector2 {
    position: Readonly<TVector2>,
}

export const position = {
    _x: 0 as number,
    _y: 0 as number,

    get x(): number {
        return this._x
    },

    set x(value) {
        this._x = value
    },

    get y(): number {
        return this._y
    },

    set y(value) {
        this._y = value
    },

    get position(): TVector2 {
        return {x: this._x, y: this._y}
    },

    set position(value) {
        this._x = value.x
        this._y = value.y
    },
}
