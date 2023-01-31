import {AEntity} from './AEntity'
import {Engine} from './Engine'
import {TInput} from './InputManager'
import {ILockedOnScreen} from './mixins/lockedOnScreen'
import {IPosition} from './mixins/position'
import {IBoxCollider} from './mixins/boxCollieder'

export abstract class AScene {
    protected _engine!: Engine
    protected _entityMap: { [name: string]: AEntity } = {}
    protected _wallList!: Record<'top' | 'right' | 'bottom' | 'left', IBoxCollider>

    public get entityList(): AEntity[] {
        return Object.values(this._entityMap)
    }

    public init(engine: Engine, canvas: HTMLCanvasElement) {
        this._engine = engine
        this.entityList.forEach(entity => {
            entity.init(this, canvas)
        })

        const c = 1000
        const rawWallList: Record<'top' | 'right' | 'bottom' | 'left', TVertices4> = {
            top: [{x: -c, y: -c}, {x: canvas.width + c, y: -c}, {x: canvas.width + c, y: 0}, {x: -c, y: 0}],
            right: [{x: canvas.width, y: -c}, {x: canvas.width + c, y: -c}, {x: canvas.width + c, y: canvas.height + c}, {
                x: canvas.width,
                y: canvas.height + c
            }],
            bottom: [{x: -c, y: canvas.height}, {x: canvas.width + c, y: canvas.height}, {
                x: canvas.width + c,
                y: canvas.height + c
            }, {x: -c, y: canvas.height + c}],
            left: [{x: -c, y: -c}, {x: 0, y: -c}, {x: 0, y: canvas.height + c}, {x: -c, y: canvas.height + c}],
        }

        this._wallList = (Object
            .keys(rawWallList) as (keyof typeof rawWallList)[])
            .reduce((acc: any, key: keyof typeof rawWallList) => {
                acc[key] = {
                    vertices(): [TPoint, TPoint, TPoint, TPoint] {
                        return rawWallList[key]
                    },
                    hasCollisionWith(t): boolean {
                        return false
                    }
                } as IBoxCollider
                return acc
            }, {} as Record<'top' | 'right' | 'bottom' | 'left', IBoxCollider>)
    }

    public update(dt: number, input: TInput) {
        for (const entity of this.entityList) {
            entity.update(dt, input)
            if (!(entity as unknown as ILockedOnScreen).isLockedOnScreen) {
                return
            }

            if ('function' === typeof (entity as unknown as IBoxCollider).hasCollisionWith) {
                if ((entity as unknown as IBoxCollider).hasCollisionWith(this._wallList.top)) {
                    (entity as unknown as IBoxCollider).y = 0 + (entity as unknown as IBoxCollider)?.anchor?.y || 0
                }
                if ((entity as unknown as IBoxCollider).hasCollisionWith(this._wallList.bottom)) {
                    (entity as unknown as IBoxCollider).y
                        = this._engine.canvas.height
                        - (entity as unknown as IBoxCollider).h
                        + (entity as unknown as IBoxCollider)?.anchor?.y || 0
                }
                if ((entity as unknown as IBoxCollider).hasCollisionWith(this._wallList.left)) {
                    (entity as unknown as IBoxCollider).x = 0 + (entity as unknown as IBoxCollider)?.anchor?.x || 0
                }
                if ((entity as unknown as IBoxCollider).hasCollisionWith(this._wallList.right)) {
                    (entity as unknown as IBoxCollider).x
                        = this._engine.canvas.width
                        - (entity as unknown as IBoxCollider).w
                        + (entity as unknown as IBoxCollider)?.anchor?.x || 0
                }
            }
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
    }

    public remove(name: string) {
        delete this._entityMap[name]
    }

    public get<EntityType extends AEntity = AEntity>(name: string): EntityType | undefined {
        return this._entityMap[name] as EntityType
    }
}
