import {AEntity, IComponentMadeOF} from '../infrastructure/AEntity'
import {TInput} from '../infrastructure/InputManager'
import {Enemy} from './Enemy'
import {Vector2} from '../infrastructure/Vector2'
import {AScene} from '../infrastructure/AScene'

export interface GameController extends IComponentMadeOF {

}

export class GameController extends AEntity {
    public score = 0
    public isGameOver: boolean = false

    init(scene: AScene) {
        super.init(scene)

        const eSize = new Enemy(Vector2.zero()).size
        const width = this.scene.frameSize.w
        const enemyInRow = 20
        const rest = width - eSize.w * enemyInRow
        const gapW = rest / (enemyInRow + 1)

        const startY = 0 - eSize.h

        const step = 10
        const time = 1000

        const spawnEverySteps = Math.ceil((gapW + eSize.h) / step)
        let enemyArray: string[][] = []

        let stepsBehind = 0
        let interval = setInterval(() => {
            if (this.isGameOver) {
                clearInterval(interval)
            }

            // Roll down
            const reEnemyArray: string[][] = []
            let row
            let edgeRow = true
            while (row = enemyArray.pop()) {
                const reRow: string[] = []
                let name
                while (name = row.pop()) {
                    const enemy = this.scene.get<Enemy>(name)
                    if (!enemy) continue

                    enemy.position = enemy.position.add(Vector2.down().mul(step))
                    if(edgeRow) {
                        enemy.firstRowFire()
                    }
                    reRow.push(name)
                }
                if (reRow.length > 0) {
                    reEnemyArray.unshift(reRow)
                    edgeRow = false
                }
            }
            enemyArray = reEnemyArray

            // Spawn new
            if (stepsBehind % spawnEverySteps === 0) {
                enemyArray.unshift([])
                const row = enemyArray[0]
                const randCount = Math.ceil(20 - Math.random() * 20)
                const leftGap = (this.scene.frameSize.w - randCount * eSize.w - (randCount - 1) * gapW) / 2
                for (let i = 0; i < randCount; i++) {
                    const enemy = new Enemy(new Vector2(leftGap + (i * (eSize.w + gapW)), startY))
                    this.scene.add(enemy)
                    enemy.init(this.scene)
                    row.push(enemy.name)
                }
            }

            stepsBehind++
        }, time)
    }


    public addScore(enemy: Enemy) {
        this.score += enemy.score

        if (this.score > 0 && 0 === this.score % 50) {
            // this.scene.get<PlayerBar>('playerBar')?.moveUp(10)
            // this.scene.get<PlayerBar>('playerBar')?.increaseSpeed(1.5)
        }

        if (this.score > 0 && 0 === this.score % 30) {
            //this.scene.get<Ball>('ball')?.speedUp({x: 0.5, y: 0.5})
        }
    }

    public gameOver() {
        this.isGameOver = true
    }

    update(dt: number, input: TInput) {
        if (this.isGameOver) {
            this.scene.entityList.filter(e => e.name !== this.name).forEach(e => this.scene.remove(e.name))
        }
    }

    render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dt: number, delta: number, fps: number) {
        if (!this.isGameOver) {
            ctx.fillStyle = 'black'
            ctx.font = '10 serif'
            ctx.fillText(`score: ${this.score}`, 15, this.scene.frameSize.h - 9)
        }

        if (this.isGameOver) {
            ctx.fillStyle = 'red'
            ctx.font = '65px serif'
            ctx.fillText(`GAME OVER`, this.scene.frameSize.w / 2 - 200, this.scene.frameSize.h / 2 + 10)
        }
    }
}
