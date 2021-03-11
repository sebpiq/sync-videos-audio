import jss from 'jss'
import preset from 'jss-preset-default'
jss.setup(preset())
import config from '../config'
import ws from '../websocket'
import audio from './audio'
import { dispatch, getAppState, getAudioState, getFollowerState, getNavigationState, initialize, subscribe } from '../redux'
import rootSaga from './sagas'
import { LEADER_ID } from '../shared/constants'
import FollowerStats from '../components/FollowerStats'
import doPolyfilling from './polyfills'
import { WEBSOCKET_MESSAGE_FOLLOWER_CONNECT } from '../shared/websocket-messages'
import Connecting from '../components/Connecting'
import StartButton from '../components/StartButton'
import { startAudio } from '../redux/audio'
import ResyncButtons from './components/ResyncButtons'
doPolyfilling()

;(window as any).forcePolyfillingAudioWorkletNode = true

const main = async () => {
    let connectingElement = Connecting(document.body)
    let startButton: HTMLElement
    let resyncButtons: HTMLElement


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
        const navigationState = getNavigationState()
        const audioState = getAudioState()
        
        if (!initialized) {
            if (followerState && followerState.initialized) {
                // FollowerStats(document.body)
                startButton = StartButton(document.body)
                startButton.addEventListener('click', () => {
                    dispatch(startAudio())
                    startButton.remove()
                    connectingElement = Connecting(document.body)
                })
                connectingElement.remove()
                initialized = true
            }
            return
        }

        if (!audioState.isStarted) {
            return
        }

        if (connectingElement) {
            connectingElement.remove()
            connectingElement = null
        }

        if (!resyncButtons) {
            resyncButtons = ResyncButtons(document.body)
        }
    })
}

main().then(() => {
    console.log(`client started`)
})
