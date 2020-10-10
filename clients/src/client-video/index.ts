import * as pEvent from 'p-event'
import { addStartButton } from '../components/StartButton'
import config from '../config'
import state from '../state'
import ws from '../websocket'

const main = async () => {
    await ws.open(config.webSocket.url)
    const videoElement: HTMLVideoElement = document.querySelector('#video')
    await pEvent(videoElement, 'canplaythrough')
    console.log('can play through')

    const startButton = addStartButton()
    startButton.onclick = function() {
        videoElement.play()
        state.refreshSyncState(videoElement.currentTime * 1000)
    }

    await pEvent(startButton, 'click')
        
    const startTick = (videoElement: HTMLVideoElement) => {
        setInterval(() => {
            ws.send({type: 'tick', payload: {currentTime: videoElement.currentTime * 1000}})
        }, config.tickInterval)
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