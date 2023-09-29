import {AScene} from './AScene'
import {InputManager} from './InputManager'

export class Engine {
    public readonly FRAME_RATE = 60

    public isDebugOn: boolean = false

    protected _lastFrameTime!: number

    protected _canvas!: HTMLCanvasElement
    public get canvas() {
        return this._canvas
    }

    protected _ctx!: CanvasRenderingContext2D
    public get ctx() {
        return this._ctx
    }

    protected _input!: InputManager
    public get input() {
        return this._input
    }

    protected _currentScene!: AScene

    public async start(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, input: InputManager, scene: AScene) {

        this._canvas = canvas
        this._ctx = ctx
        this._input = input
        this._currentScene = scene

        this._input.onKeyPress('KeyG', () => {
            this.isDebugOn = !this.isDebugOn
        })
        this._input.start()
        
        await Promise.resolve(scene.init(this, canvas))

        this._lastFrameTime = Date.now()
        requestAnimationFrame(time => this._gameLoop(time))
    }

    public changeScene() {
        // TODO
    }

    protected _gameLoop(time: number) {
        const delta = time - this._lastFrameTime
        this._lastFrameTime = time
        const fps = Math.floor(1000 / delta)
        const dt = Math.max(0, Number(Math.round(delta / (1000 / this.FRAME_RATE)).toFixed(2)))

        // input
        this._input.update(dt)

        // update
        this._currentScene.update(dt, this._input)

        // render
        this._currentScene.render(this._canvas, this._ctx, dt, delta, fps)

        // debug
        this._debug(dt, delta, fps)

        // next iteration
        requestAnimationFrame(time => this._gameLoop(time))
    }

    protected _debug(dt: number, delta: number, fps: number) {
        if (this.isDebugOn) {
            this._ctx.fillStyle = 'black'
            this._ctx.strokeStyle = 'white'
            this._ctx.fillRect(0, 0, 120, 85)
            this._ctx.font = '15px serif'
            this._ctx.strokeText(`∂ ${dt}`, 10, 15, 100)
            this._ctx.strokeText(`Δ: ${delta}`, 10, 30, 100)
            this._ctx.strokeText(`fps: ${fps}`, 10, 45, 100)
            this._ctx.strokeText(`obj.count: ${this._currentScene.entityList.length}`, 10, 60, 100)
            this._ctx.strokeText(`in H,V: ${this._input.horizontal.toFixed(2)},${this.input.vertical.toFixed(2)}`, 10, 75, 100)
        }
    }
}
