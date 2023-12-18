export class Vector2 {
  protected data: Float32Array;
  get x(): number {
    return this.data[0];
  }

  set x(value: number) {
    this.data[0] = value;
  }

  get y(): number {
    return this.data[1];
  }

  set y(value: number) {
    this.data[1] = value;
  }

  constructor(x: number = 0, y: number = 0) {
    this.data = new Float32Array([x, y]);
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public add(n: number): Vector2;
  public add(v: Vector2): Vector2;
  public add(v: Vector2 | number): Vector2 {
    if ('number' === typeof v) {
      return new Vector2(this.x + v, this.y + v);
    } else {
      return new Vector2(this.x + v.x, this.y + v.y);
    }
  }

  public sub(n: number): Vector2;
  public sub(v: Vector2): Vector2;
  public sub(v: Vector2 | number): Vector2 {
    if ('number' === typeof v) {
      return new Vector2(this.x - v, this.y - v);
    } else {
      return new Vector2(this.x - v.x, this.y - v.y);
    }
  }

  public mul(n: number): Vector2;
  public mul(v: Vector2): Vector2;
  public mul(v: Vector2 | number): Vector2 {
    if ('number' === typeof v) {
      return new Vector2(this.x * v, this.y * v);
    } else {
      return new Vector2(this.x * v.x, this.y * v.y);
    }
  }

  public div(n: number): Vector2;
  public div(v: Vector2): Vector2;
  public div(v: Vector2 | number): Vector2 {
    if ('number' === typeof v) {
      return new Vector2(this.x / v, this.y / v);
    } else {
      return new Vector2(this.x / v.x, this.y / v.y);
    }
  }

  public scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  public dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  public get length(): number {
    return Math.sqrt(this.dot(this));
  }

  public normalize(): Vector2 {
    return this.scale(1 / this.length);
  }

  public static get zero(): Vector2 {
    return new Vector2();
  }

  public static get one(): Vector2 {
    return new Vector2(1, 1);
  }

  public static get up(): Vector2 {
    return new Vector2(0, 1);
  }

  public static get down(): Vector2 {
    return new Vector2(0, -1);
  }

  public static get left(): Vector2 {
    return new Vector2(-1, 0);
  }
}