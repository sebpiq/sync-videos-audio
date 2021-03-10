import { Saga, Task } from 'redux-saga'
import pEvent from 'p-event'
import { all, call, cancel, fork, select, take, takeEvery, takeLatest } from 'redux-saga/effects'
import websocket from '../websocket'
import timeDiff from '../time-diff'
import { addStartButton } from '../components/StartButton'
import {
    TimeDiffQueryMessage,
    TimeDiffResponseMessage,
    TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED,
    TYPE_WEBSOCKET_MESSAGE_TICK,
    TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_QUERY,
} from '../shared/websocket-messages'
import { Message } from '../shared/websocket-messages'
import { LEADER_ID } from '../shared/constants'
import audio from './audio'
import { RootState } from '../redux'
import { FollowerState, INCREMENT_RESYNC_TIME_DIFF } from '../redux/follower'
import DelayButtons from '../components/DelayButtons'
import { computeCurrentTime } from './PlaybackNode/utils'

function* setAppFirstConnectedSaga() {
    const startButton = addStartButton()
    yield pEvent(startButton, 'click')
    yield audio.start()
    DelayButtons(document.body)
    console.log('app first connected')
}

function* syncAudioSaga() {
    const audio: RootState["appState"]["audio"] = yield select((state: RootState) => state.appState.audio)
    const followerState: FollowerState = yield select((state: RootState) => state.follower)
    if (followerState) {
        // This is to account for the delay introduced by the ScriptProcessorNode when polyfill is used
        let scriptProcessorNodeOffset = 0
        if (audio.isPollyfilled) {
            scriptProcessorNodeOffset = 1000 * audio.pollyfillSampleCount / audio.context.sampleRate
        }
        const timeDiff = followerState.timeDiff + followerState.resyncTimeDiff
        const currentTime = computeCurrentTime(followerState.leaderSnapshot, timeDiff) + scriptProcessorNodeOffset
        // TODO: Do this calculation in the worklet processor for exactness (+ timestamp should be audio context time)
        audio.playbackNode.setCurrentTime(currentTime)
    }
}

function* sendBackTimeDiffResponseSaga(TimeDiffQueryMessage: TimeDiffQueryMessage) {
    const TimeDiffResponseMessage: TimeDiffResponseMessage = timeDiff.makeTimeDiffResponseMessage(
        TimeDiffQueryMessage
    )
    console.log(TimeDiffQueryMessage)
    websocket.send(LEADER_ID, TimeDiffResponseMessage)
}

function* sendBackEveryTimeDiffResponseSaga() {
    yield takeEveryWebsocketMessage(
        TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_QUERY,
        sendBackTimeDiffResponseSaga
    )
}

const takeEveryWebsocketMessage = (messageType: Message['type'], saga: Saga) =>
    takeEvery(messageType, saga)

function* rootSaga() {
    const timeDiffTask: Task = yield fork(sendBackEveryTimeDiffResponseSaga)
    yield take(TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED)
    yield cancel(timeDiffTask)
    yield setAppFirstConnectedSaga()
    yield take(TYPE_WEBSOCKET_MESSAGE_TICK)
    yield call(syncAudioSaga)
    yield all([
        takeLatest(TYPE_WEBSOCKET_MESSAGE_TICK, syncAudioSaga),
        takeLatest(INCREMENT_RESYNC_TIME_DIFF, syncAudioSaga),
    ])
}

export default rootSaga
