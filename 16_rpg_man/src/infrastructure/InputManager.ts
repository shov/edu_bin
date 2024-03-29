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

    onKeyDown(code: KeyboardEvent['code'], cb: () => void): void,
    onKeyDown(cb: (e: KeyboardEvent) => void): void,

    unsubscribeKeyDown(code: KeyboardEvent['code'], cb?: () => void): void,
    unsubscribeKeyDown(cb: () => void): void,

    onKeyUp(code: KeyboardEvent['code'], cb: () => void): void,
    onKeyUp(cb: (e: KeyboardEvent) => void): void,

    unsubscribeKeyUp(code: KeyboardEvent['code'], cb?: () => void): void,
    unsubscribeKeyUp(cb: () => void): void,
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

    protected _subscriptionDictDown: { [code: string]: (() => void)[] } = {}
    protected _subscriptionDictUp: { [code: string]: (() => void)[] } = {}

    protected _generalSubscriptionListDict: { up: ((e: KeyboardEvent) => void)[], down: ((e: KeyboardEvent) => void)[] } = {
        down: [],
        up: [],
    }

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
        this._generalSubscriptionListDict.down.forEach(cb => cb(e))
            ; (this._subscriptionDictDown[e.code] || []).forEach(cb => cb())
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
        this._generalSubscriptionListDict.up.forEach(cb => cb(e))
            ; (this._subscriptionDictUp[e.code] || []).forEach(cb => cb())
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

    public onKeyDown(code: KeyboardEvent['code'], cb: () => void): void
    public onKeyDown(cb: (e: KeyboardEvent) => void): void
    public onKeyDown(...args: any[]): void {
        if (args.length > 1) {
            const code: string = args[0]
            const cb = args[1]
            this._subscriptionDictDown[code] ??= []
            this._subscriptionDictDown[code].push(cb)
            return
        }
        this._generalSubscriptionListDict.down.push(args[0])
    }

    public unsubscribeKeyDown(code: KeyboardEvent['code'], cb?: () => void): void
    public unsubscribeKeyDown(cb: () => void): void
    public unsubscribeKeyDown(...args: any[]): void {
        if (args.length > 1) {
            const code: string = args[0]
            const cb = args[1]
            if (!this._subscriptionDictDown[code]) return
            this._subscriptionDictDown[code] = this._subscriptionDictDown[code].filter(listener => listener !== cb)
            return
        }
        this._generalSubscriptionListDict.down = this._generalSubscriptionListDict.down.filter(cb => cb != args[0])
    }

    public onKeyUp(code: KeyboardEvent['code'], cb: () => void): void
    public onKeyUp(cb: (e: KeyboardEvent) => void): void
    public onKeyUp(...args: any[]): void {
        if (args.length > 1) {
            const code: string = args[0]
            const cb = args[1]
            this._subscriptionDictUp[code] ??= []
            this._subscriptionDictUp[code].push(cb)
            return
        }

        this._generalSubscriptionListDict.up.push(args[0])
    }

    public unsubscribeKeyUp(code: KeyboardEvent['code'], cb?: () => void): void
    public unsubscribeKeyUp(cb: () => void): void
    public unsubscribeKeyUp(...args: any[]): void {
        if (args.length > 1) {
            const code: string = args[0]
            const cb = args[1]
            if (!this._subscriptionDictUp[code]) return
            this._subscriptionDictUp[code] = this._subscriptionDictUp[code].filter(listener => listener !== cb)
        }
        
        this._generalSubscriptionListDict.down = this._generalSubscriptionListDict.up.filter(cb => cb != args[0])
    }
}
