export class Matrix extends Array<Array<number>> {

  public static readonly IDENTITY = new Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ])

  public static readonly ZERO = new Matrix(0, 0)

  public readonly height: number
  public readonly width: number

  constructor(h: number, w: number)
  constructor(h: number, w: number, fill: number)
  constructor(values: number[][])
  constructor(h: number | number[][], w?: number, fill?: number) {
    super('number' === typeof h ? h : h.length)
    this.height = 'number' === typeof h ? h : h.length
    this.width = 'number' === typeof w ? w : (h as number[][]).length === 0 ? 0 : (h as number[][])[0].length

    if (!Array.isArray(h)) {
      this.forEach((_, y) => {
        this[y] = new Array(w).fill(fill || 0)
      })
      return
    }

    h.forEach((line, i) => this[i] = [...line])
  }

  public add(m: Matrix): Matrix {
    if (this.height !== m.height || this.width !== m.width) {
      throw new Error('Matrix dimensions must match')
    }
    return new Matrix(this.reduce<number[][]>((acc, line, y) => {
      for (let [x, v] of line.entries()) {
        acc[y][x] = v + m[y][x]
      }
      return acc
    },
      new Array(this.height)
        .fill(null)
        .map(_ => new Array(this.width)
          .fill(0)
        )
    ))
  }

  public sub(m: Matrix): Matrix {
    if (this.height != m.height || this.width !== m.width) {
      throw new Error('Matrix dimentions must match')
    }
    return new Matrix(this.reduce((acc, line, y) => {
      for (let [x, v] of line.entries()) {
        acc[y][x] = v - m[y][x]
      }
      return acc
    },
      new Array(this.height)
        .fill(null)
        .map(_ => new Array(this.width)
          .fill(0)
        )
    ))
  }

  public mul(m: Matrix): Matrix
  public mul(n: number): Matrix
  public mul(m: Matrix | number): Matrix {
    if ('number' === typeof m) {
      return new Matrix(this.reduce((acc, line, y) => {
        for (let [x, v] of line.entries()) {
          acc[y][x] = v * m
        }
        return acc
      },
        new Array(this.height)
          .fill(null)
          .map(_ => new Array(this.width)
            .fill(0)
          )
      ))
    }

    // Matrix multiply
    // check dimensions, A width must be equal to B height
    if (this.width !== m.height) {
      throw new Error('Matrix dimensions must match')
    }

    // if matrix A size is (n x m) as width x height notation 
    // and matrix B size is (p x n) as width x height notation 
    // then matrix AB size is (p x m), result matrix has width from B and height from A
    // so each A line is multiplied by each B column
    return new Matrix(this.reduce((acc, line, ay) => {
      for (let bx = 0; bx < m.width; bx++) {
        for (let [ax, v] of line.entries()) {
          acc[ay][bx] += v * m[ax][bx]
        }
      }
      return acc
    },
      new Array(this.height)
        .fill(null)
        .map(_ => new Array(m.width)
          .fill(0)
        )
    ))

  }

  public div(m: Matrix): Matrix
  public div(n: number): Matrix
  public div(m: Matrix | number): Matrix {
    if ('number' === typeof m) {
      if (m === 0) throw new Error('Division by zero')
      return new Matrix(this.reduce((acc, line, y) => {
        for (let [x, v] of line.entries()) {
          acc[y][x] = v / m
        }
        return acc
      },
        new Array(this.height)
          .fill(null)
          .map(_ => new Array(this.width)
            .fill(0)
          )
      ))
    }

    // Matrix divide
    // check dimensions, A width must be equal to B height
    if (this.width !== m.height) {
      throw new Error('Matrix dimensions must match to divide')
    }

    // check m has non-zero determinant
    if (m.determinant() === 0) {
      throw new Error('Matrix determinant is zero, cannot divide')
    }

    // divide matrix A by matrix B
    // A / B = A * B^-1
    try {
      return this.mul(m.inverse())
    } catch (e) {
      (e as Error).message += ', cannot divide'
      throw e
    }
  }

  public transpose(): Matrix {
    return new Matrix(this.reduce<number[][]>((acc, line, y) => {
      for (let [x, v] of line.entries()) {
        acc[x][y] = v
      }
      return acc
    },
      new Array(this.width)
        .fill(null)
        .map(_ => new Array(this.height)
          .fill(0)
        )
    ))
  }

  public determinant(): number {
    // check if matrix is square
    if (this.width !== this.height) {
      throw new Error('Matrix must be square to calculate determinant')
    }

    // determinant of 1x1 matrix is the value of this matrix
    if (this.width === 1) {
      return this[0][0]
    }
    // determinant of 2x2 matrix is ad - bc
    // [a, b]
    // [c, d]
    if (this.width === 2) {
      return this[0][0] * this[1][1] - this[0][1] * this[1][0]
    }
    // determinant of 3x3 matrix is a(ei - fh) - b(di - fg) + c(dh - eg)
    if (this.width === 3) {
      const [a, b, c] = this[0]
      const [d, e, f] = this[1]
      const [g, h, i] = this[2]
      return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g)
    }

    throw new Error('Determinant of matrix with size greater than 3x3 is not supported yet')
    /**
     * For Larger Matrices (n x n):
     *
     *  For matrices larger than 3x3, calculating the determinant can be more complex. You can use various techniques such as cofactor expansion, row reduction, or diagonalization, depending on the properties of the matrix. Here's a general approach:
     *
     *  Cofactor Expansion (Laplace Expansion): This method involves expanding the determinant along a row or column using cofactors (determinants of smaller matrices).
     *
     *  Choose a row or column to expand along.
     *  For each element in the chosen row or column, calculate its cofactor (the determinant of the matrix obtained by removing the row and column containing that element), multiply it by the element, and sum all these products.
     *  Row Reduction (Gaussian Elimination): Transform the matrix into an upper triangular form or a lower triangular form (where all elements above or below the main diagonal are zeros), and then calculate the determinant as the product of the diagonal elements.
     *
     *  Eigenvalues: If you know the eigenvalues of the matrix, you can calculate the determinant as the product of the eigenvalues.
     */

  }
  public det(): number {
    return this.determinant()
  }

  public cutCross(y: number, x: number): Matrix {
    // check if the point is inside the matrix
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) {
      throw new Error('Point is outside the matrix')
    }

    // if matrix is 1x1, throw error
    if (this.width === 1 && this.height === 1) {
      throw new Error('Matrix is too small to cut cross')
    }

    return new Matrix(this.reduce<number[][]>((acc, line, ay) => {
      if (ay === y) return acc
      for (let [ax, v] of line.entries()) {
        if (ax === x) continue
        acc[ay < y ? ay : ay - 1][ax < x ? ax : ax - 1] = v
      }
      return acc;
    },
      new Array(this.height - 1)
        .fill(null)
        .map(_ => new Array(this.width - 1)
          .fill(0)
        )
    ))
  }


  public cofactor(): Matrix {
    // check if matrix is square
    if (this.width !== this.height) {
      throw new Error('Matrix must be square to calculate cofactor')
    }

    // cofactor of 1x1 matrix is the value of this matrix
    if (this.width === 1) {
      return new Matrix([[this[0][0]]])
    }

    // if matrix wider than 4x4, cofactor is not supported yet
    if (this.width > 4) {
      throw new Error('Cofactor of matrix with size greater than 4x4 is not supported yet')
    }

    // go through each element of matrix and calculate its cofactor
    return new Matrix(this.reduce<number[][]>((acc, line, y) => {
      for (let [x, v] of line.entries()) {
        // calculate cofactor of this element
        // cofactor is the determinant of matrix obtained by removing the row and column containing that element
        // so we need to remove line y and column x from matrix
        const cofactor = this.cutCross(y, x).determinant()
        // cofactor is multiplied by -1 if sum of x and y is odd
        acc[y][x] = cofactor * ((x + y) % 2 ? -1 : 1)
      }
      return acc
    },
      new Array(this.height)
        .fill(null)
        .map(_ => new Array(this.width)
          .fill(0)
        )
    ))
  }

  public adjugate(): Matrix {
    // check if matrix is square
    if (this.width !== this.height) {
      throw new Error('Matrix must be square to calculate adjugate')
    }

    return this.cofactor().transpose()
  }

  public inverse(): Matrix {
    // check if matrix is square
    if (this.width !== this.height) {
      throw new Error('Matrix must be square to calculate inverse')
    }

    // inverse of 1x1 matrix is the value of this matrix
    if (this.width === 1) {
      return new Matrix([[1 / this[0][0]]])
    }

    // if matrix wider than 4x4, inverse is not supported yet
    if (this.width > 4) {
      throw new Error('Inverse of matrix with size greater than 4x4 is not supported yet')
    }

    // inverse of matrix is adjugate of matrix divided by determinant of matrix
    return this.adjugate().div(this.determinant())
  }
}