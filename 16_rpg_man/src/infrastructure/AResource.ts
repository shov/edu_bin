import { AScene } from "./AScene"

export interface IResource {
  readonly name: string,
  readonly value?: any,
  load(...args: any[]): Promise<void>
}

export abstract class AResource implements IResource {
  get name() {
    return this._name
  }

  get value() {
    return this._value
  }

  protected _name!: string
  protected _value?: any

  constructor(name: string) {
    this._name = name
  }

  async load(scene: AScene) {
    throw new Error('Must be implemented!')
  }

}