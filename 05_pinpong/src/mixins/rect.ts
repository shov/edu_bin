export interface IRect {
    w: number,
    h: number,
    anchor: Readonly<TVector2>,

    scruff(position: TVector2): TVector2,

    body(position: TVector2): [number, number, number, number],
}

export const rect = {
    _w: 0 as number,
    _h: 0 as number,
    _anchor: {x: 0, y: 0},

    scruff(position: TVector2): TVector2 {
        return {
            x: position.x - this._anchor.x,
            y: position.y - this._anchor.y,
        }
    },

    body(position: TVector2): [number, number, number, number] {
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

    get anchor(): TVector2 {
        return this._anchor
    },

    set anchor(value) {
        this._anchor = value
    },
}
