import pEvent from 'p-event'
import DelayButtons from '../components/DelayButtons'
import { addStartButton } from '../components/StartButton'
import config from '../config'
import { FollowerConnectedMessage, LagQueryMessage, LagResponseMessage, TickMessage } from '../shared/websocket-messages'
import ws from '../websocket'
import audio from './audio'
import {initialize} from '../redux'
import rootSaga from './sagas'

const main = async () => {
    initialize(rootSaga)
    await ws.open(config.webSocket.url)
    await audio.load('/media/audio.mp3')
    await ws.send({ type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT', payload: {} })

    // const startButton = addStartButton()
    // await pEvent(startButton, 'click')
    // await audio.start()
    
    // const message = await pEvent(ws.events, 'tick') as TickMessage
    // state.refreshSyncState(message.payload.currentTime)
    // state.get().audio.playbackNode.setCurrentTime(message.payload.currentTime)
    
    // DelayButtons(document.body)
    // state.subscribe(() => {
    //     const stateValues = state.get()
    //     const {delayMs: delaySeconds, readPositionMs, timestampMs: timestamp} = stateValues.syncState
    //     // TODO: Do this calculation in the worklet processor for exactness (+ timestamp should be context time)
    //     const currentTime = readPositionMs + (Date.now() - timestamp) + delaySeconds
    //     console.log(delaySeconds, readPositionMs, timestamp, currentTime)
    //     stateValues.audio.playbackNode.setCurrentTime(currentTime)
    // })
}

main()
    .then(() => {
        console.log(`client started`)
    })