import * as pEvent from 'p-event'
import DelayButtons from '../components/DelayButtons'
import { addStartButton } from '../components/StartButton'
import config from '../config'
import { TickMessage } from '../shared/websocket-messages'
import state from '../state'
import ws from '../websocket'
import audio from './audio'

const main = async () => {
    await ws.open(config.webSocket.url)
    await audio.load('/media/audio.mp3')
    
    const startButton = addStartButton()
    await pEvent(startButton, 'click')
    await audio.start()
    
    const message: TickMessage = await pEvent(ws.events, 'tick')
    state.refreshSyncState(message.payload.currentTime)
    state.get().audio.playbackNode.setCurrentTime(message.payload.currentTime)
    
    DelayButtons(document.body)
    state.subscribe(() => {
        const stateValues = state.get()
        const {delayMs: delaySeconds, readPositionMs, timestampMs: timestamp} = stateValues.syncState
        // TODO: Do this calculation in the worklet processor for exactness (+ timestamp should be context time)
        const currentTime = readPositionMs + (Date.now() - timestamp) + delaySeconds
        console.log(delaySeconds, readPositionMs, timestamp, currentTime)
        stateValues.audio.playbackNode.setCurrentTime(currentTime)
    })
}

main()
    .then(() => {
        console.log(`client started`)
    })