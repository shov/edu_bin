import { Matrix } from "./Matrix";

export class TransformationMatrix extends Matrix {
  public get floatData(): Float32Array {
    return this.data;
  }

  constructor(a: number[]);
  constructor(a: Float32Array);
  constructor(a: Matrix);
  constructor(a: number[] | Float32Array | Matrix) {
    super(0, 3, 3);

    if (a instanceof Matrix) {
      if(a['width'] !== 3 || a['height'] !== 3) {
        throw new Error('TransformationMatrix must be 3x3');
      }

      this.data = new Float32Array(a['data']);
    } else {
      if (a.length !== 9) {
        throw new Error('TransformationMatrix must be 3x3');
      }
      this.data = new Float32Array(a);
    }
  }

  public static identity(): TransformationMatrix {
    return new TransformationMatrix([
      1, 0, 0, // first column (rows from top to bottom as from left to right)
      0, 1, 0, // second column
      0, 0, 1, // third column
    ]);
  }
  
  public clone(): TransformationMatrix {
    return new TransformationMatrix(this.data);
  }

  public transition(x: number, y: number): TransformationMatrix  {
    const m = this.clone();
    // the last column is mul product of the last row and the translation vector
    m.set(0, 2, m.get(0, 0) * x + m.get(0, 1) * y + m.get(0, 2));
    m.set(1, 2, m.get(1, 0) * x + m.get(1, 1) * y + m.get(1, 2));
    m.set(2, 2, m.get(2, 0) * x + m.get(2, 1) * y + m.get(2, 2));

    return m;
  }

  public scale(x: number, y: number): TransformationMatrix  {
    const m = this.clone();
    m.set(0, 0, m.get(0, 0) * x);
    m.set(1, 0, m.get(1, 0) * x);
    m.set(2, 0, m.get(2, 0) * x);

    m.set(0, 1, m.get(0, 1) * y);
    m.set(1, 1, m.get(1, 1) * y);
    m.set(2, 1, m.get(2, 1) * y);

    return m;
  }

  public rotate(angle: number): TransformationMatrix  {
    const m = this.clone();
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const m00 = m.get(0, 0);
    const m01 = m.get(0, 1);
    const m02 = m.get(0, 2);
    const m10 = m.get(1, 0);
    const m11 = m.get(1, 1);
    const m12 = m.get(1, 2);

    m.set(0, 0, c * m00 - s * m01);
    m.set(0, 1, s * m00 + c * m01);
    m.set(1, 0, c * m10 - s * m11);
    m.set(1, 1, s * m10 + c * m11);
    m.set(2, 0, c * m02 - s * m12);
    m.set(2, 1, s * m02 + c * m12);

    return m;
  }

}