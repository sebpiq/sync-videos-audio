import {openWebSocket} from './websocket'
import State from './shared/State'

const main = async () => {
    const state = new State({
        webSocket: null
    })
    
    const webSocket = await openWebSocket()
    state.set('webSocket', webSocket)

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
        setInterval(() => {
            console.log(videoElement.currentTime)
        }, 1000)
    }
    
    startTick(videoElement)
}

main()
    .then(() => {
        console.log(`websocket open`)
    })
    .catch((error) => {
        console.error(error)
    })