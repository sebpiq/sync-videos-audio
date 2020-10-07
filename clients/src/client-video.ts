import config from './config'
import state from './state'
import ws from './websocket'

const main = async () => {
    await ws.open(config.webSocket.url)

    const videoElement: HTMLVideoElement = document.querySelector('#video')
    const startButton: HTMLButtonElement = document.querySelector('#start')
    const pauseButton: HTMLButtonElement = document.querySelector('#pause')
    
    startButton.onclick = function() {
        videoElement.play()
    }
    
    pauseButton.onclick = function() {
        videoElement.pause()
    }
    
    const startTick = (videoElement: HTMLVideoElement) => {
        const webSocket = state.get().webSocket
        setInterval(() => {
            ws.send({type: 'tick', payload: {currentTime: videoElement.currentTime}})
        }, 1000)
    }
    
    startTick(videoElement)
}

main()
    .then(() => {
        console.log(`client started`)
    })
    .catch((error) => {
        console.error(error)
    })