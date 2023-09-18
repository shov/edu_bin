import {DefaultScene} from './scenes/DefaultScene'
import {Engine} from './infrastructure/Engine'
import {InputManager} from './infrastructure/InputManager'

window.addEventListener('load', () => {

    const canvas = document.createElement('canvas')
    canvas.width=640
    canvas.height=480
    canvas.setAttribute('class', 'main-canvas')

    document.getElementById('root')!.appendChild(canvas)

    const inputManager = new InputManager()
    const defaultScene = new DefaultScene()
    const engine = new Engine()
    
    Promise.resolve(
        engine.start(canvas, canvas.getContext('2d')!, inputManager, defaultScene)
    ).catch(e => (
        console.error(e)
    ))

})
