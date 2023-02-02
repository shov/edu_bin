import {AEntity} from '../AEntity'
import {TInput} from '../InputManager'
import {PlayerBar} from './PlayerBar'
import {Ball} from './Ball'

export class GameController extends AEntity {
    public score = 0
    public isGameOver: boolean = false

    public increaseScore() {
        this.score += 10

        if(this.score > 0 && 0 === this.score % 50) {
            this._scene.get<PlayerBar>('playerBar')?.moveUp(10)
            this._scene.get<PlayerBar>('playerBar')?.increaseSpeed(1.5)
        }

        if(this.score > 0 && 0 === this.score % 30) {
            this._scene.get<Ball>('ball')?.speedUp({x: 0.5, y: 0.5})
        }
    }

    public gameOver() {
        this._scene.remove('playerBar')
        this._scene.remove('ball')
        this.isGameOver = true
    }

    update(dt: number, input: TInput) {
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        ctx.fillStyle = 'black'
        ctx.font = '30px serif'
        ctx.fillText(`Score: ${this.score}`, canvas.width - 150, 25, 150)

        if(this.isGameOver) {
            ctx.fillStyle = 'red'
            ctx.font = '65px serif'
            ctx.fillText(`GAME OVER`, canvas.width / 2 - 200, canvas.height / 2 + 10)
        }
    }
}
