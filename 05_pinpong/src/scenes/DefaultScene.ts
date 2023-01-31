import {AScene} from '../AScene'
import {PlayerBar} from '../entities/PlayerBar'
import {Ball} from '../entities/Ball'
import {Engine} from '../Engine'

export class DefaultScene extends AScene {

    public init(engine: Engine, canvas: HTMLCanvasElement) {

        this.add('playerBar', new PlayerBar())
        this.add('ball', new Ball())

        super.init(engine, canvas)
    }
}
