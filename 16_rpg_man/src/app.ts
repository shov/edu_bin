import {Engine} from './infrastructure/Engine'
import {InputManager} from './infrastructure/InputManager'
import { LoadingScreen } from './scenes/LoadingScreen'

window.addEventListener('load', () => {

    const canvas = document.createElement('canvas')
    canvas.width=640
    canvas.height=480
    canvas.setAttribute('class', 'main-canvas')

    document.getElementById('root')!.appendChild(canvas)

    const inputManager = new InputManager()
    const loadingScreen = new LoadingScreen()
    const engine = new Engine()
    
    Promise.resolve(
        engine.start(canvas, canvas.getContext('2d')!, inputManager, loadingScreen)
    ).catch(e => (
        console.error(e)
    ))

})
