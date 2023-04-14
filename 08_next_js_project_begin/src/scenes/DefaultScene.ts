import {AScene} from '../infrastructure/AScene'
import {Engine} from '../infrastructure/Engine'
import {GameController} from '../entities/GameController'
import {PlayerSpaceShip} from '../entities/PlayerSpaceShip'

export class DefaultScene extends AScene {

    public init(engine: Engine, canvas: HTMLCanvasElement) {

        this.add('gameController', new GameController())
        this.add('player', new PlayerSpaceShip())

        super.init(engine, canvas)
    }
}
