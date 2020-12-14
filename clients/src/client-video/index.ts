import pEvent from 'p-event'
import { addStartButton } from '../components/StartButton'
import config from '../config'
import ws from '../websocket'
import { initialize, setAppState } from '../redux'
import rootSaga from './sagas'
import { LEADER_ID, SERVER_ID } from "../shared/constants";

const main = async () => {
    initialize(rootSaga)
    setAppState({clientId: LEADER_ID})

    await ws.open(config.webSocket.url)
    await ws.send(SERVER_ID, { type: 'WEBSOCKET_MESSAGE_LEADER_CONNECT', payload: {} })
    
    const videoElement: HTMLVideoElement = document.querySelector('#video')
    await pEvent(videoElement, 'canplaythrough')
    console.log('can play through')

    const startButton = addStartButton()
    startButton.onclick = function() {
        videoElement.play()
        // state.refreshSyncState(videoElement.currentTime * 1000)
    }

    await pEvent(startButton, 'click')
    

    // const startTick = (videoElement: HTMLVideoElement) => {
    //     setInterval(() => {
    //         ws.send({type: 'tick', payload: {currentTime: videoElement.currentTime * 1000}})
    //     }, config.tickInterval)
    // }
    
    // startTick(videoElement)
}

main()
    .then(() => {
        console.log(`client started`)
    })
    .catch((error) => {
        console.error(error)
    })