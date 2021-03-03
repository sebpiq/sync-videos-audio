import { Saga } from 'redux-saga'
import pEvent from 'p-event'
import { all, call, cancel, fork, select, take, takeEvery, takeLatest } from 'redux-saga/effects'
import websocket from '../websocket'
import timeDiff from '../time-diff'
import { addStartButton } from '../components/StartButton'
import {
    TimeDiffQueryMessage,
    TimeDiffResponseMessage,
} from '../shared/websocket-messages'
import { Message } from '../shared/websocket-messages'
import { LEADER_ID } from '../shared/constants'
import audio from './audio'
import { RootState } from '../redux'
import { FollowerState } from '../redux/follower'
import DelayButtons from '../components/DelayButtons'

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
        const positionLocalTime = followerState.leader.localTime + followerState.timeDiff
        const adjustment = (Date.now() - positionLocalTime) + followerState.resyncTimeDiff
        const currentTime = followerState.leader.position + adjustment
        console.log('TICK', adjustment)
        // TODO: Do this calculation in the worklet processor for exactness (+ timestamp should be context time)
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
        'WEBSOCKET_MESSAGE_TIME_DIFF_QUERY',
        sendBackTimeDiffResponseSaga
    )
}

const takeEveryWebsocketMessage = (messageType: Message['type'], saga: Saga) =>
    takeEvery(messageType, saga)

function* rootSaga() {
    const timeDiffTask = yield fork(sendBackEveryTimeDiffResponseSaga)
    yield take('WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED')
    yield cancel(timeDiffTask)
    yield setAppFirstConnectedSaga()
    yield take('WEBSOCKET_MESSAGE_TICK')
    yield call(syncAudioSaga)
    // yield all([
    //     takeLatest('WEBSOCKET_MESSAGE_TICK', syncAudioSaga)
    // ])
}

export default rootSaga
