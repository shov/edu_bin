export interface IVector3 {
  x: number;
  y: number;
  z: number;
  // Arithmetic
  add(v: IVector3): IVector3
  add(n: number): IVector3
  add(a: TVector3Array): IVector3
  sub(v: IVector3): IVector3
  sub(n: number): IVector3
  sub(a: TVector3Array): IVector3
  scale(n: number): IVector3
  mul(v: IVector3): IVector3
  mul(n: number): IVector3
  mul(a: TVector3Array): IVector3
  div(v: IVector3): IVector3
  div(n: number): IVector3
  div(a: TVector3Array): IVector3
  // Math
  length(): number
  normalize(): IVector3
  dot(v: IVector3): number
  distance(v: IVector3): number
  direction(v: IVector3): IVector3
  cross(v: IVector3): IVector3
  reflect(normal: IVector3): IVector3
  // Abstract
  clone(): IVector3
  toArray(): TVector3Array
  toString(): TVector3String
  
}

export type TVector3Array = [number, number, number]
export type TVector3String = `Vector3(${number}, ${number}, ${number})`

export class Vector3 implements IVector3 {
  static readonly ZERO = new Vector3(0, 0, 0)
  static readonly ONE = new Vector3(1, 1, 1)
  static readonly UP = new Vector3(0, 1, 0)
  static readonly DOWN = new Vector3(0, -1, 0)
  static readonly LEFT = new Vector3(-1, 0, 0)
  static readonly RIGHT = new Vector3(1, 0, 0)
  static readonly FORWARD = new Vector3(0, 0, 1)
  static readonly BACK = new Vector3(0, 0, -1)


  public x: number
  public y: number
  public z: number

  constructor(v: IVector3)
  constructor(x: number, y: number, z: number)
  constructor(a: TVector3Array)
  constructor(v: IVector3 | number | TVector3Array, y?: number, z?: number) {
    if(Array.isArray(v)) {
      this.x = v[0]
      this.y = v[1]
      this.z = v[2]
      return
    }
    
    if ('object' === typeof v) {
      this.x = v.x
      this.y = v.y
      this.z = v.z
      return
    }

    this.x = v
    this.y = y!
    this.z = z!
  }

  // Arithmetic

  public add(v: IVector3): IVector3
  public add(n: number): IVector3
  public add(a: TVector3Array): IVector3
  public add(v: IVector3 | number | TVector3Array): IVector3 {
    if (typeof v === 'number') {
      return new Vector3(this.x + v, this.y + v, this.z + v)
    }
    if (Array.isArray(v)) {
      return new Vector3(this.x + v[0], this.y + v[1], this.z + v[2])
    }
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  }

  public sub(v: IVector3): IVector3
  public sub(n: number): IVector3
  public sub(a: TVector3Array): IVector3
  public sub(v: IVector3 | number | TVector3Array): IVector3 {
    if (typeof v === 'number') {
      return new Vector3(this.x - v, this.y - v, this.z - v)
    }
    if (Array.isArray(v)) {
      return new Vector3(this.x - v[0], this.y - v[1], this.z - v[2])
    }
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  }

  public scale(n: number): IVector3 {
    return this.mul(n)
  }

  public mul(v: IVector3): IVector3
  public mul(n: number): IVector3
  public mul(a: TVector3Array): IVector3
  public mul(v: IVector3 | number | TVector3Array): IVector3 {
    if (typeof v === 'number') {
      return new Vector3(this.x * v, this.y * v, this.z * v)
    }
    if (Array.isArray(v)) {
      return new Vector3(this.x * v[0], this.y * v[1], this.z * v[2])
    }
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
  }

  public div(v: IVector3): IVector3
  public div(n: number): IVector3
  public div(a: TVector3Array): IVector3
  public div(v: IVector3 | number | TVector3Array): IVector3 {
    if (typeof v === 'number') {
      if(v === 0) throw new Error('Division by zero')
      return new Vector3(this.x / v, this.y / v, this.z / v)
    }
    if (Array.isArray(v)) {
      if(v[0] === 0 || v[1] === 0 || v[2] === 0) throw new Error('Division by zero')
      return new Vector3(this.x / v[0], this.y / v[1], this.z / v[2])
    }
    if(v.x === 0 || v.y === 0 || v.z === 0) throw new Error('Division by zero')
    return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
  }

  // Math

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
  }

  public normalize(): IVector3 {
    const length = this.length()
    return length === 0 ? new Vector3(0, 0, 0) : this.div(length)
  }

  // scalar product (dot product)
  // @url https://en.wikipedia.org/wiki/Dot_product
  public dot(v: IVector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }

  public distance(v: IVector3): number {
    const dX = this.x - v.x
    const dY = this.y - v.y
    return Math.sqrt(dX*dX + dY*dY)
  }

  public direction(v: IVector3): IVector3 {
    return v.sub(this).normalize()
  }

  // vector product (cross product)
  // it is a binary operation on two vectors in three-dimensional space
  // that results in another vector which is perpendicular to the plane
  public cross(v: IVector3): IVector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x)
  }

  public reflect(normal: IVector3): IVector3 {
    return this.sub(normal.scale(2 * this.dot(normal)))
  }


  // Abstract

  clone(): IVector3 {
    return new Vector3(this.x, this.y, this.z)
  }

  toArray(): TVector3Array {
    return [this.x, this.y, this.z]
  }

  toString(): TVector3String {
    return `Vector3(${this.x}, ${this.y}, ${this.z})`
  }

}