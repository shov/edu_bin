function mixin(mixIn, rules = null) {
  return function (Base) {
    Object.getOwnPropertyNames(mixIn).forEach(name => {
      if (rules || typeof Base.prototype[name] === 'undefined') {
        Object.defineProperty(Base.prototype, name, Object.getOwnPropertyDescriptor(mixIn, name))
      }
    })
  }
}

key = Symbol('position')
const Mix = {
  _x: 0,
  _y: 0,

  get x() {
    return this._x
  },

  set x(value) {
    this._x = value * 2
  },

  get y() {
    return this._y
  },

  set y(value) {
    return this._y = value * 2
  }
}


class A {
}

mixin(Mix)(A)
const y = new A()
const z = new A()

console.log('-')
