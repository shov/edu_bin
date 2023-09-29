import { Floor } from '../entities/Floor'
import { Player } from '../entities/Player'
import { AScene } from '../infrastructure/AScene'
import { Engine } from '../infrastructure/Engine'

export class MainScene extends AScene {

    public async init(engine: Engine, canvas: HTMLCanvasElement) {

        this.add('floor', new Floor())
        this.add('player', new Player())

        super.init(engine, canvas)
    }
}
