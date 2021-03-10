import pEvent from 'p-event'
import { addStartButton } from '../components/StartButton'
import config from '../config'
import ws from '../websocket'
import { initialize, setAppState } from '../redux'
import rootSaga from './sagas'
import { BROADCAST_ID, LEADER_ID, SERVER_ID } from '../shared/constants'
import { TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT, TYPE_WEBSOCKET_MESSAGE_TICK } from '../shared/websocket-messages'

const main = async () => {
    initialize(rootSaga)
    setAppState({ clientId: LEADER_ID })

    await ws.open(config.webSocket.url)
    await ws.send(SERVER_ID, {
        type: TYPE_WEBSOCKET_MESSAGE_LEADER_CONNECT,
        payload: {},
    })

    const videoElement: HTMLVideoElement = document.querySelector('#video')
    // REF : https://stackoverflow.com/questions/10235919/the-canplay-canplaythrough-events-for-an-html5-video-are-not-called-on-firefox
    if (videoElement.readyState <= 3) {
        await pEvent(videoElement, 'canplaythrough')
    }
    console.log('can play through')

    const startButton = addStartButton()
    startButton.onclick = function () {
        videoElement.play()
        // state.refreshSyncState(videoElement.currentTime * 1000)
    }

    await pEvent(startButton, 'click')

    const startTick = (videoElement: HTMLVideoElement) => {
        setInterval(() => {
            ws.send(BROADCAST_ID, {type: TYPE_WEBSOCKET_MESSAGE_TICK, payload: {
                position: videoElement.currentTime * 1000,
                timestamp: Date.now()
            }})
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
