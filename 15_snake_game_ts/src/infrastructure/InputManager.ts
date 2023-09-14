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

    onKeyPress(code: KeyboardEvent['code'], cb: () => void): void,
    unsubscribeKeyPress(code: KeyboardEvent['code'], cb?: () => void): void,
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

    protected _subscriptionDict: { [code: string]: (() => void)[] } = {}

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
                if (this.horizontal > 0) this.horizontal = 0
                this._axisCurrHorizontalMove = this._axisTable.hde
                break
            case 'ArrowRight':
            case 'KeyD':
                this.right = true
                if (this.horizontal < 0) this.horizontal = 0
                this._axisCurrHorizontalMove = this._axisTable.hie
                break
            case 'ArrowUp':
            case 'KeyW':
                this.up = true
                if (this.vertical < 0) this.vertical = 0
                this._axisCurrVerticalMove = this._axisTable.vde
                break
            case 'ArrowDown':
            case 'KeyS':
                this.down = true
                if (this.vertical > 0) this.vertical = 0
                this._axisCurrVerticalMove = this._axisTable.vie
                break
        }

        ;(this._subscriptionDict[e.code] || []).forEach(cb => cb())
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
                    this._axisCurrHorizontalMove = this._axisTable.hiz
                }
                break
            case 'ArrowRight':
            case 'KeyD':
                this.right = false
                if (!this.left) {
                    this._axisCurrHorizontalMove = this._axisTable.hdz
                }
                break
            case 'ArrowUp':
            case 'KeyW':
                this.up = false
                if (!this.down) {
                    this._axisCurrVerticalMove = this._axisTable.viz
                }
                break
            case 'ArrowDown':
            case 'KeyS':
                this.down = false
                if (!this.up) {
                    this._axisCurrVerticalMove = this._axisTable.vdz
                }
                break
        }
    }

    axisSensitivity = 1 / 10

    protected _axisTable = {
        hie: (dt: number) => {
            const v = this.horizontal + dt * this.axisSensitivity
            return v >= 1 ? 1 : v
        },
        hiz: (dt: number) => {
            const v = this.horizontal + dt * this.axisSensitivity
            return v >= 0 ? 0 : v
        },
        hde: (dt: number) => {
            const v = this.horizontal - dt * this.axisSensitivity
            return v <= -1 ? -1 : v
        },
        hdz: (dt: number) => {
            const v = this.horizontal - dt * this.axisSensitivity
            return v <= 0 ? 0 : v
        },

        vie: (dt: number) => {
            const v = this.vertical + dt * this.axisSensitivity
            return v >= 1 ? 1 : v
        },
        viz: (dt: number) => {
            const v = this.vertical + dt * this.axisSensitivity
            return v >= 0 ? 0 : v
        },
        vde: (dt: number) => {
            const v = this.vertical - dt * this.axisSensitivity
            return v <= -1 ? -1 : v
        },
        vdz: (dt: number) => {
            const v = this.vertical - dt * this.axisSensitivity
            return v <= 0 ? 0 : v
        },
    }

    protected _axisCurrHorizontalMove: (dt: number) => number = this._axisTable.hiz
    protected _axisCurrVerticalMove: (dt: number) => number = this._axisTable.viz

    public update(dt: number) {
        this.horizontal = this._axisCurrHorizontalMove(dt)
        this.vertical = this._axisCurrVerticalMove(dt)
    }

    public onKeyPress(code: KeyboardEvent['code'], cb: () => void): void {
        this._subscriptionDict[code] ??= []
        this._subscriptionDict[code].push(cb)
    }

    public unsubscribeKeyPress(code: KeyboardEvent['code'], cb?: () => void): void {
        if (!this._subscriptionDict[code]) return
        this._subscriptionDict[code] = this._subscriptionDict[code].filter(listener => listener !== cb)
    }
}
