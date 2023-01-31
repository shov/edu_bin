import {AScene} from './AScene'
import {TInput} from './InputManager'

export abstract class AEntity {
    protected _scene!: AScene


    public init (scene: AScene, canvas: HTMLCanvasElement) {
        this._scene = scene
    }

    public update(dt: number, input: TInput) {

    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {

    }
}
