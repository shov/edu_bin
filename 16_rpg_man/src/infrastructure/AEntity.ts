import { AResource } from './AResource'
import { AScene } from './AScene'
import { TInput } from './InputManager'
import { COMPONENT_CONSTRUCTOR_DICT, COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT } from './addComponent'

export interface IComponentMadeOF {
    componentList: string[]
}

export interface IEntity {
    scene: AScene,
    tagList: string[]
    name: string

    load(scene: AScene): Promise<void>

    init(scene: AScene): void

    update(dt: number, input: TInput): void

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number): void

    destroy(): void
}

export abstract class AEntity implements IEntity {
    public scene!: AScene

    public tagList: string[] = []

    protected resourceList: AResource[] = []

    constructor(public name: string = 'unnamed' + crypto.randomUUID()) {
        // run mixed components constructors
        ; (this.constructor.prototype.componentList || []).forEach((componentName: string) => {
            const componentConstructor = this.constructor.prototype?.[COMPONENT_CONSTRUCTOR_DICT]?.[componentName]
            if ('function' === typeof componentConstructor) {
                const options = this.constructor.prototype?.[COMPONENT_CONSTRUCTOR_LAST_OPTIONS_DICT]?.[componentName]
                componentConstructor.call(this, options || {})
                if (void 0 !== options) {
                    delete this.constructor.prototype[COMPONENT_CONSTRUCTOR_DICT][componentName]
                }
            }
        })
    }

    public async load(scene: AScene): Promise<void> {
        await Promise.all(this.resourceList.map(r => r.load(scene)))
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
