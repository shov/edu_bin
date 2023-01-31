export interface IRect {
    w: number,
    h: number,
    anchor: Readonly<TPoint>,

    scruff(position: TPoint): TPoint,

    body(position: TPoint): [number, number, number, number],
}

export const rect = {
    _w: 0 as number,
    _h: 0 as number,
    _anchor: {x: 0, y: 0},

    scruff(position: TPoint): TPoint {
        return {
            x: position.x - this._anchor.x,
            y: position.y - this._anchor.y,
        }
    },

    body(position: TPoint): [number, number, number, number] {
        return [
            position.x - this._anchor.x,
            position.y - this._anchor.y,
            this._w,
            this._h,
        ]
    },

    get w(): number {
        return this._w
    },

    set w(value) {
        this._w = value
    },

    get h(): number {
        return this._h
    },

    set h(value) {
        this._h = value
    },

    get anchor(): TPoint {
        return this._anchor
    },

    set anchor(value) {
        this._anchor = value
    },
}
