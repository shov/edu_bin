export interface ISize2 {
    w: number
    h: number

    add(size: ISize2): ISize2

    add(scalar: number): ISize2

    mul(size: ISize2): ISize2

    mul(scalar: number): ISize2

    clone(): ISize2
}

export class Size2 implements ISize2 {
    w: number = 0
    h: number = 0

    constructor(a: number)
    constructor(w: number, h: number)
    constructor(size: ISize2)
    constructor(...args: [number] | [number, number] | [ISize2]) {
        if ('number' === typeof args[0]) {
            this.w = args[0]
            this.h = 'number' === typeof args[1] ? args[1] : args[0]
        } else {
            this.w = args[0].w
            this.h = args[0].h
        }
    }

    add(subj: ISize2 | number): ISize2 {
        if ('number' === typeof subj) {
            this.w += subj
            this.h += subj
            return this
        }

        this.w += subj.w
        this.h += subj.h
        return this
    }

    mul(subj: ISize2 | number): ISize2 {
        if ('number' === typeof subj) {
            this.w *= subj
            this.h *= subj
            return this
        }

        this.w *= subj.w
        this.h *= subj.h
        return this
    }

    clone(): ISize2 {
        return new Size2(this)
    }
}
