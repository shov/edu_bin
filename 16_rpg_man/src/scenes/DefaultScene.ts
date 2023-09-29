import { Player } from '../entities/Player'
import { AScene } from '../infrastructure/AScene'
import { Engine } from '../infrastructure/Engine'

export class DefaultScene extends AScene {

    public async init(engine: Engine, canvas: HTMLCanvasElement) {

        this.add('player', new Player())

        super.init(engine, canvas)
    }
}
