export interface IVector2 extends TPoint2 {
    x: number
    y: number

    add(vector: IVector2): IVector2

    add(scalar: number): IVector2

    sub(vector: IVector2): IVector2

    sub(scalar: number): IVector2

    mul(vector: IVector2): IVector2

    mul(scalar: number): IVector2

    moveTo(target: IVector2, step: number): IVector2

    clone(): IVector2

    equal(other: IVector2): boolean

    distanceTo(target: Vector2): number
}

export class Vector2 implements IVector2 {
    x: number = 0
    y: number = 0

    constructor(x: number, y: number)
    constructor(point: TPoint2 | IVector2)
    constructor(...args: [number, number] | [TPoint2]) {
        if ('number' === typeof args[0]) {
            this.x = args[0]
            this.y = args[1]!
        } else {
            this.x = args[0].x
            this.y = args[0].y
        }
    }

    add(subj: IVector2 | number): IVector2 {
        if ('number' === typeof subj) {
            return new Vector2(this.x + subj, this.y + subj)
        }
        return new Vector2(this.x + subj.x, this.y + subj.y)
    }

    sub(subj: IVector2 | number): IVector2 {
        if ('number' === typeof subj) {
            return new Vector2(this.x - subj, this.y - subj)
        }

        return new Vector2(this.x - subj.x, this.y - subj.y)
    }

    mul(subj: IVector2 | number): IVector2 {
        if ('number' === typeof subj) {
           return new Vector2(this.x * subj, this.y * subj)
        }

        return new Vector2(this.x * subj.x, this.y * subj.y)
    }

    moveTo(target: IVector2, step: number): IVector2 {
        return Vector2.moveTo(this, target, step)
    }

    distanceTo(target: Vector2): number {
        return Vector2.distance(this, target)
    }

    clone(): IVector2 {
        return new Vector2(this)
    }

    equal(other: IVector2): boolean {
        return this.x === other.x && this.y === other.y
    }

    static up(): IVector2 {
        return new Vector2(0, -1)
    }

    static down(): IVector2 {
        return new Vector2(0, 1)
    }

    static left(): IVector2 {
        return new Vector2(-1, 0)
    }

    static right(): IVector2 {
        return new Vector2(1, 0)
    }

    static zero(): IVector2 {
        return new Vector2(0, 0)
    }

    static moveTo(subject: IVector2, target: IVector2, step: number): IVector2 {
        const direction = Vector2.normalize(target.sub(subject))
        return subject.add(direction.mul(step))
    }

    static distance(a: IVector2, b: IVector2): number {
        return Vector2.len(b.sub(a))
    }

    static len(a: IVector2): number {
        return Math.sqrt(a.x ** 2 + a.y ** 2)
    }

    static normalize(a: IVector2): IVector2 {
        const length = Vector2.len(a)
        return new Vector2(a.x / length, a.y / length)
    }
}
