class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  "+"(v) {
    return this.add(v);
  }

  toString() {
    return `Vector(${this.x}, ${this.y})`;
  }
}

const a = new Vector(1, 2);
const b = new Vector(2, 3);

console.log(a + b);
