export type TInput = {
    left: boolean,
    right: boolean,
    up: boolean,
    down: boolean,
    horizontal: number,
    vertical: number,
    space: boolean,

    key?: string,
    code?: string,

    altKey: boolean,
    ctrlKey: boolean,
    metaKey: boolean,
    shiftKey: boolean,
}

// TODO add mouse

export class InputManager implements TInput {

    up: boolean = false
    left: boolean = false
    right: boolean = false
    down: boolean = false
    space: boolean = false
    horizontal: number = 0
    vertical: number = 0

    key?: string = void 0
    code?: string = void 0
    altKey: boolean = false
    ctrlKey: boolean = false
    metaKey: boolean = false
    shiftKey: boolean = false

    protected _started: boolean = false

    public start() {
        if (this._started) return
        document.addEventListener('keydown', this._keyDownListener)
        document.addEventListener('keyup', this._keyUpListener)
        this._started = true
    }

    public stop() {
        if (!this._started) return
        document.removeEventListener('keydown', this._keyDownListener)
        document.removeEventListener('keyup', this._keyUpListener)
        this._started = false
    }

    protected _keyDownListener = (e: KeyboardEvent) => {
        this.key = e.key
        this.code = e.code
        this.altKey = e.altKey
        this.ctrlKey = e.ctrlKey
        this.metaKey = e.metaKey
        this.shiftKey = e.shiftKey

        switch (e.code) {
            case 'Space':
                this.space = true
                break
            case 'ArrowLeft':
            case 'KeyA':
                this.left = true
                this.horizontal = -1
                break
            case 'ArrowRight':
            case 'KeyD':
                this.right = true
                this.horizontal = 1
                break
            case 'ArrowUp':
            case 'KeyW':
                this.up = true
                this.vertical = 1
                break
            case 'ArrowDown':
            case 'KeyS':
                this.down = true
                this.vertical = -1
                break
        }
    }

    protected _keyUpListener = (e: KeyboardEvent) => {
        this.key = e.key
        this.code = e.code
        this.altKey = e.altKey
        this.ctrlKey = e.ctrlKey
        this.metaKey = e.metaKey
        this.shiftKey = e.shiftKey

        switch (e.code) {
            case 'Space':
                this.space = false
                break
            case 'ArrowLeft':
            case 'KeyA':
                this.left = false
                if (!this.right) {
                    this.horizontal = 0
                }
                break
            case 'ArrowRight':
            case 'KeyD':
                this.right = false
                if (!this.left) {
                    this.horizontal = 0
                }
                break
            case 'ArrowUp':
            case 'KeyW':
                this.up = false
                if (!this.down) {
                    this.vertical = 0
                }
                break
            case 'ArrowDown':
            case 'KeyS':
                this.down = false
                if (!this.up) {
                    this.vertical = 0
                }
                break
        }
    }
}
