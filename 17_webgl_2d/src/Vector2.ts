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
}