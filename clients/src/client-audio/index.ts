import config from '../config'
import ws from '../websocket'
import audio from './audio'
import { getAppState, initialize } from '../redux'
import rootSaga from './sagas'
import { LEADER_ID } from '../shared/constants'
import FollowerStats from '../components/FollowerStats'

;(window as any).forcePolyfillingAudioWorkletNode = true

const main = async () => {
    initialize(rootSaga)
    await ws.open(config.webSocket.url)
    await audio.load('/media/audio.mp3')
    await ws.send(LEADER_ID, {
        type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT',
        payload: { clientId: getAppState().clientId },
    })

    FollowerStats(document.body)

    // const message = await pEvent(ws.events, 'tick') as TickMessage
    // state.refreshSyncState(message.payload.currentTime)
    // state.get().audio.playbackNode.setCurrentTime(message.payload.currentTime)
}

main().then(() => {
    console.log(`client started`)
})
