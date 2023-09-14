import { BoardMap } from '../entities/BoardMap'
import { GameController } from '../entities/GameController'
import { GameOverLayer } from '../entities/GameOverLayer'
import { Snake } from '../entities/Snake'
import {AScene} from '../infrastructure/AScene'
import {Engine} from '../infrastructure/Engine'

export class DefaultScene extends AScene {

    public init(engine: Engine, canvas: HTMLCanvasElement) {

        this.add('gameController', new GameController())
        this.add('snake', new Snake())
        this.add('boardMap', new BoardMap())
        this.add('gameOverLayer', new GameOverLayer())

        super.init(engine, canvas)
    }
}
