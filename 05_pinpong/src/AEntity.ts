import {AScene} from './AScene'

export abstract class AEntity {
    protected _scene!: AScene



    public init (canvas: HTMLCanvasElement) {

    }

    public update(dt: number) {

    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {

    }
}
