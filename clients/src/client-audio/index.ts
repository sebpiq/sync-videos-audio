import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())
import config from '../config'
import ws from '../websocket'
import audio from './audio'
import { getAppState, getFollowerState, initialize, subscribe } from '../redux'
import rootSaga from './sagas'
import { LEADER_ID } from '../shared/constants'
import FollowerStats from '../components/FollowerStats'
import doPolyfilling from './polyfills'
import { WEBSOCKET_MESSAGE_FOLLOWER_CONNECT } from '../shared/websocket-messages'
import Connecting from '../components/Connecting'
doPolyfilling()

;(window as any).forcePolyfillingAudioWorkletNode = true

const main = async () => {
    const connectingElement = Connecting(document.body)
    initialize(rootSaga)
    await ws.open(config.webSocket.url)
    await audio.load('/media/audio.mp3')
    await ws.send(LEADER_ID, {
        type: WEBSOCKET_MESSAGE_FOLLOWER_CONNECT,
        payload: { clientId: getAppState().clientId },
    })

    let initialized = false
    subscribe(() => {
        const followerState = getFollowerState()
        if (!initialized && followerState && followerState.initialized) {
            FollowerStats(document.body)
            connectingElement.remove()
            initialized = true
        }
    })
}

main().then(() => {
    console.log(`client started`)
})
