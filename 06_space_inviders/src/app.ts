import {DefaultScene} from './scenes/DefaultScene'
import {Engine} from './Engine'
import {InputManager} from './InputManager'

window.addEventListener('load', () => {

    const canvas = document.createElement('canvas')
    canvas.width=640
    canvas.height=480
    canvas.setAttribute('class', 'main-canvas')

    document.getElementById('root')!.appendChild(canvas)

    const inputManager = new InputManager()
    const defaultScene = new DefaultScene()
    const engine = new Engine()
    engine.start(canvas, canvas.getContext('2d')!, inputManager, defaultScene)

})
