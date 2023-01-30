import {AEntity} from './AEntity'

export abstract class AScene {
    protected _entityMap: { [name: string]: AEntity } = {}

    public get entityList(): AEntity[] {
        return Object.values(this._entityMap)
    }

    public add(name: string, entity: AEntity) {
        entity.
        this._entityMap[name] = entity
    }

    public remove(name: string) {
        delete this._entityMap[name]
    }

    public get<EntityType extends AEntity = AEntity>(name: string): EntityType | undefined {
        return this._entityMap[name] as EntityType
    }
}
