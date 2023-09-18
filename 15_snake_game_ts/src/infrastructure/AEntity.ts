import {AScene} from './AScene'
import {TInput} from './InputManager'

export interface IComponentMadeOF {
    componentList: string[]
}

export interface IEntity {
    scene: AScene,
    tagList: string[]
    name: string

    init(scene: AScene): void

    update(dt: number, input: TInput): void

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void

    destroy(): void
}

export abstract class AEntity implements IEntity {
    public scene!: AScene

    public tagList: string[] = []

    constructor(public name: string = 'unnamed' + crypto.randomUUID()) {
    }

    public init(scene: AScene): void | Promise<void> {
        this.scene = scene
    }

    public update(dt: number, input: TInput): void {

    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void {

    }

    public destroy(): void {
        this.scene.remove(this.name)
    }
}
