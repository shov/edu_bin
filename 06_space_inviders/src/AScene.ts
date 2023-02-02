import {AEntity} from './AEntity'
import {Engine} from './Engine'
import {TInput} from './InputManager'

export abstract class AScene {
    protected _engine!: Engine
    protected _entityMap: { [name: string]: AEntity } = {}
    protected _tagDict: { [tag: string]: string[] } = {} // tag -> nameList

    public get entityList(): AEntity[] {
        return Object.values(this._entityMap)
    }

    public init(engine: Engine, canvas: HTMLCanvasElement) {
        this._engine = engine
        this.entityList.forEach(entity => {
            entity.init(this, canvas)
        })


    }

    public update(dt: number, input: TInput) {
        for (const entity of this.entityList) {
            entity.update(dt, input)
        }
    }

    public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        // Default clear scene before all the entities rendered
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (const entity of this.entityList) {
            entity.render(canvas, ctx, dt, delta, fps)
        }
    }

    public add(name: string, entity: AEntity) {
        this._entityMap[name] = entity
        entity.tagList.forEach(tag => {
            this._tagDict[tag] ??= []
            this._tagDict[tag].push(name)
        })
    }

    public remove(name: string) {
        if(!this._entityMap[name]) return
        this._entityMap[name].tagList.forEach(tag => {
            this._tagDict[tag] = this._tagDict[tag].filter(entityName => entityName !== name)
        })
        delete this._entityMap[name]
    }

    public get<EntityType extends AEntity = AEntity>(name: string): EntityType | undefined {
        return this._entityMap[name] as EntityType
    }

    public findByTag<EntityType extends AEntity = AEntity>(tag: string): EntityType[] {
        return (this._tagDict[tag] || []).map(name => this.get(name)!)
    }
}
