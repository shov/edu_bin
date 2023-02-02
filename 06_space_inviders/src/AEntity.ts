import {AScene} from './AScene'
import {TInput} from './InputManager'

export interface IEntity {
    componentList: string[],
    scene: AScene,
    tagList: string[]

    init(scene: AScene, canvas: HTMLCanvasElement): void

    update(dt: number, input: TInput): void

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void
}

export abstract class AEntity implements IEntity {
    public componentList: string[] = []

    public scene!: AScene

    public tagList: string[] = []

    public init(scene: AScene, canvas: HTMLCanvasElement): void {
        this.scene = scene
    }

    public update(dt: number, input: TInput): void {

    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {

    }
}
