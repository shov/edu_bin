/**
 * values packed as column major
 * so first 3 values are the first column of the matrix
 * the very first value is the first column, first row
 * i, j coords, where i is the column and j is the row
 * 
 */
export class Matrix {
  protected data: Float32Array;
  protected width: number;
  protected height: number;

  constructor(fill = 0, width = 3, height = 3) {
    this.width = width; // width is the number of columns (i)
    this.height = height; // height is the number of rows (j)
    this.data = new Float32Array(width * height);
    this.data.fill(fill);
  }

  public static identity(): Matrix {
    return new Matrix(0, 3, 3);
  }

  public clone() {
    const m = new Matrix(0, this.width, this.height);
    m.data = new Float32Array(this.data);
    return m;
  }

  public set(j: number, i: number, value: number) {
    this.data[i * this.height + j] = value;
  }

  public get(j: number, i: number) {
    return this.data[i * this.height + j];
  }

  public mul(m: Matrix): Matrix {
    if (this.width !== m.height) {
      throw new Error('Cannot multiply matrices of different sizes!');
    }

    const result = new Matrix(0, m.width, this.height);

    for (let i = 0; i < result.height; i++) {
      for (let j = 0; j < result.width; j++) {
        let sum = 0;
        for (let k = 0; k < this.width; k++) {
          sum += this.get(k, i) * m.get(j, k);
        }
        result.set(j, i, sum);
      }
    }

    return result;
  }

  public transpose(): Matrix {
    const result = new Matrix(0, this.height, this.width);

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        result.set(i, j, this.get(j, i));
      }
    }

    return result;
  }
}