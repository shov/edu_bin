import {AEntity, IComponentMadeOF, IEntity} from './AEntity'
import {Engine} from './Engine'
import {TInput} from './InputManager'
import {IBoxCollider} from '../components/boxCollieder'
import {Collider} from './Collider'
import {ISize2, Size2} from './Size2'
import { ImageLoader } from './ImageLoader'

export abstract class AScene {
    protected _engine!: Engine
    protected _entityMap: { [name: string]: IEntity } = {}
    protected _tagDict: { [tag: string]: string[] } = {} // tag -> nameList
    protected _collisionBodyMap: { [name: string]: IBoxCollider } = {}

    public readonly imageLoader: ImageLoader = new ImageLoader() // todo asset or resource loader

    public get entityList(): IEntity[] {
        return Object.values(this._entityMap)
    }

    public get collisionBodyList(): IBoxCollider[] {
        return Object.values(this._collisionBodyMap)
    }

    public frameSize: ISize2 = new Size2(0, 0)

    public init(engine: Engine, canvas: HTMLCanvasElement): void | Promise<void> {
        this.frameSize = new Size2(canvas.width, canvas.height)
        this._engine = engine

        return Promise.resolve(Promise.all(this.entityList.map(entity => entity.init(this)))).then()
    }

    public update(dt: number, input: TInput) {
        // Collisions
        const {coupleList, tagMap} = new Collider(this.collisionBodyList)
            .process()

        coupleList.forEach(([a, b]) => {
            a.callCollision(b)
            b.callCollision(a)
        })

        ;[...tagMap.keys()].forEach(b => {
            const oneTagBranch: Record<string, IBoxCollider[]> = tagMap.get(b)!

            Object.keys(oneTagBranch).forEach(tag => {
                b.callTagCollision(tag, oneTagBranch[tag])
            })
        })

        // Update
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

    public add(name: string, entity: AEntity): void
    public add(entity: AEntity): void
    public add(...args: any[]) {
        let name: string
        let entity: IEntity
        if (args.length > 1 && 'string' === typeof args[0]) {
            name = args[0]
            entity = args[1]
            entity.name = name
        } else {
            entity = args[0]
            name = entity.name
        }
        this._entityMap[name] = entity

        // Tags
        entity.tagList.forEach(tag => {
            this._tagDict[tag] ??= []
            this._tagDict[tag].push(name)
        })

        // Collisions
        if ((entity as unknown as IComponentMadeOF)?.componentList?.includes('boxCollider')) {
            this._collisionBodyMap[name] = entity as IBoxCollider
        }
    }

    public remove(name: string) {
        if (!this._entityMap[name]) return
        this._entityMap[name].tagList.forEach(tag => {
            this._tagDict[tag] = this._tagDict[tag].filter(entityName => entityName !== name)
        })
        delete this._entityMap[name]
        delete this._collisionBodyMap[name]
    }

    public get<EntityType extends AEntity = AEntity>(name: string): EntityType | undefined {
        return this._entityMap[name] as EntityType
    }

    public findByTag<EntityType extends AEntity = AEntity>(tag: string): EntityType[] {
        return (this._tagDict[tag] || []).map(name => this.get(name)!)
    }
}
