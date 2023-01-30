import {AScene} from './AScene'

export class Engine {
    public readonly FRAME_RATE = 60

    protected _lastFrameTime!: number

    // TODO set them and init
    protected _canvas!: HTMLCanvasElement
    protected _ctx!: CanvasRenderingContext2D

    protected _currentScene!: AScene

    public init() {
        // TODO must set default scene

        this._lastFrameTime = Date.now()
        requestAnimationFrame(time => this._gameLoop(time))
    }

    protected _gameLoop(time: number) {
        const delta = time - this._lastFrameTime
        this._lastFrameTime = time
        const fps = Math.floor(1000 / delta)
        const dt = Math.max(0, Number(Math.round(delta / (1000 / this.FRAME_RATE)).toFixed(2)))

        // update
        for(const entity of this._currentScene.entityList) {
            entity.update(dt)
        }

        // render
        for(const entity of this._currentScene.entityList) {
            entity.render(this._canvas, this._ctx, dt, delta, fps)
        }

        // next iteration
        requestAnimationFrame(time => this._gameLoop(time))
    }
}
