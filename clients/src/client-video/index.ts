import pEvent from 'p-event'
import config from '../config'
import ws from '../websocket'
import { initialize, setAppState } from '../redux'
import rootSaga from './sagas'
import { BROADCAST_ID, LEADER_ID, SERVER_ID } from '../shared/constants'
import {
    WEBSOCKET_MESSAGE_LEADER_CONNECT,
    WEBSOCKET_MESSAGE_TICK,
} from '../shared/websocket-messages'
import { MediaStatus } from '../shared/types'

const getCurrentTime = (videoElement: HTMLVideoElement) => videoElement.currentTime * 1000

const makeSendTick = (videoElement: HTMLVideoElement) =>
    () => 
        ws.send(BROADCAST_ID, {
            type: WEBSOCKET_MESSAGE_TICK,
            payload: {
                mediaStatus: !videoElement.paused ? MediaStatus.PLAYING : MediaStatus.NOT_PLAYING,
                position: getCurrentTime(videoElement),
                timestamp: Date.now(),
            },
        })

const main = async () => {
    initialize(rootSaga)
    setAppState({ clientId: LEADER_ID })

    await ws.open(config.webSocket.url)
    await ws.send(SERVER_ID, {
        type: WEBSOCKET_MESSAGE_LEADER_CONNECT,
        payload: {},
    })

    const videoElement: HTMLVideoElement = document.querySelector('#video')
    const sendTick = makeSendTick(videoElement)
    // REF : https://stackoverflow.com/questions/10235919/the-canplay-canplaythrough-events-for-an-html5-video-are-not-called-on-firefox
    if (videoElement.readyState <= 3) {
        await pEvent(videoElement, 'canplaythrough')
    }

    console.log('can play through')

    videoElement.addEventListener('play', sendTick)
    videoElement.addEventListener('pause', sendTick)
    videoElement.addEventListener('playing', sendTick)
    videoElement.addEventListener('waiting', sendTick)
    videoElement.addEventListener('ended', sendTick)

    const startTick = () =>
        setInterval(() => sendTick, config.tickInterval)
    startTick()
}

main()
    .then(() => {
        console.log(`client started`)
    })
    .catch((error) => {
        console.error(error)
    })
