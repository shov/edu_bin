(async () => {
    console.log('Hello World')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Goodbye World')
})()