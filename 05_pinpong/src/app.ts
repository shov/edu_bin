
type TPoint = {x: number, y: number}
type TEntity = {
    anchor: TPoint,

}

window.addEventListener('load', () => {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('class', 'main-canvas')
    document.getElementById('root')!.appendChild(canvas)

    window.addEventListener('resize', () => {
        console.dir(window.innerWidth)
        console.dir(window.innerHeight)
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        console.log(canvas.height)
        console.log(canvas.width)

        const context = canvas.getContext('2d')!

        context.fillStyle = `#${
            (Math.abs(canvas.width) % 255).toString(16)
        }${
            (Math.abs(canvas.height) % 255).toString(16)
        }${
            (Math.abs(canvas.width - canvas.height) % 255).toString(16)
        }`

        context.rect(0, 0, canvas.width, canvas.height)
        context.fill()
    })
})
