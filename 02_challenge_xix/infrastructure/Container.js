'use strict'

/**
 * @implements {IContainerRegistration}
 */
class ContainerRegistration {
  /**
   * @type {TContainerEntry}
   * @private
   */
  _entry

  constructor(entry) {
    this._entry = entry
  }

  dependencies(...depList) {
    this._entry.dependencyList = depList
    return this
  }

  instance() {
    this._entry.instance = this._entry.subject
    return this
  }

  singleton() {
    this._entry.singleton = true
    return this
  }
}

/**
 * @implements {IContainer}
 */
class Container {
  /**
   * @type {Record<string, TContainerEntry>}
   * @private
   */
  _storage = {}

  register(key, subject) {
    this._storage[key] = {
      subject,
      instance: undefined,
      singleton: false,
      dependencyList: [],
    }

    return new ContainerRegistration(this._storage[key])
  }

  get(key) {
    return this._resolve(key)
  }

  _resolve(key, resolvePath = '') {
    const entry = this._storage[key]

    if (!entry) {
      throw new Error(`Couldn't resolve key from the container ${resolvePath + key}`)
    }

    if (entry.instance) {
      return entry.instance
    }

    const depList = entry.dependencyList.map(depKey => this._resolve(depKey, `${resolvePath}${key}.`))
    try {
      const resolved = new (entry.subject)(...depList)

      if (entry.singleton) {
        entry.instance = resolved
      }

      return resolved
    } catch (e) {
      console.log(e.message)
    }
  }
}

module.exports = Container
