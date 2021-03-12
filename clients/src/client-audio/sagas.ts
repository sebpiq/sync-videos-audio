import { Saga, Task } from 'redux-saga'
import { all, call, cancel, fork, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects'
import websocket from '../websocket'
import timeDiff from '../time-diff'
import {
    TimeDiffQueryMessage,
    TimeDiffResponseMessage,
    WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED,
    WEBSOCKET_MESSAGE_TICK,
    WEBSOCKET_MESSAGE_TIME_DIFF_QUERY,
} from '../shared/websocket-messages'
import { Message } from '../shared/websocket-messages'
import { LEADER_ID } from '../shared/constants'
import audio from './audio'
import { RootState } from '../redux'
import { FollowerState, FOLLOWER_INCREMENT_RESYNC_TIME_DIFF } from '../redux/follower'
import { computeCurrentTime } from './PlaybackNode/utils'
import { MediaStatus } from '../shared/types'
import { AudioState, AUDIO_START, setAudioStarted } from '../redux/audio'
import config from '../config'

function* syncAudioSaga() {
    const audio: AudioState = yield select((state: RootState) => state.audio)
    const followerState: FollowerState = yield select((state: RootState) => state.follower)
    if (followerState) {
        // Sync playing state
        if (followerState.leaderMediaStatus === MediaStatus.NOT_PLAYING) {
            audio.playbackNode.pause()
        } else {
            audio.playbackNode.play()
        }

        // This is to account for the delay introduced by the ScriptProcessorNode when polyfill is used
        let scriptProcessorNodeOffset = 0
        if (audio.isPollyfilled) {
            scriptProcessorNodeOffset = 1000 * audio.pollyfillSampleCount / audio.context.sampleRate
        }
        const currentTime = computeCurrentTime(followerState.leaderSnapshot, followerState.timeDiff) 
            + scriptProcessorNodeOffset
            + (audio.context.baseLatency || 0) * 1000
            + config.audio.arbitraryLatency
        // TODO: Do this calculation in the worklet processor for exactness (+ timestamp should be audio context time)
        audio.playbackNode.setCurrentTime(currentTime)
    }
}

function* sendManualResyncSaga() {
    const followerState: RootState["follower"] = yield select((state: RootState) => state.follower)
    const audio: AudioState = yield select((state: RootState) => state.audio)
    audio.playbackNode.sendManualResync(followerState.resyncTimeDiff)
}

function* sendBackTimeDiffResponseSaga(TimeDiffQueryMessage: TimeDiffQueryMessage) {
    const TimeDiffResponseMessage: TimeDiffResponseMessage = timeDiff.makeTimeDiffResponseMessage(
        TimeDiffQueryMessage
    )
    websocket.send(LEADER_ID, TimeDiffResponseMessage)
}

function* sendBackEveryTimeDiffResponseSaga() {
    yield takeEveryWebsocketMessage(
        WEBSOCKET_MESSAGE_TIME_DIFF_QUERY,
        sendBackTimeDiffResponseSaga
    )
}

const takeEveryWebsocketMessage = (messageType: Message['type'], saga: Saga) =>
    takeEvery(messageType, saga)

function* rootSaga() {
    // Do the connection / sync with the leader
    const timeDiffTask: Task = yield fork(sendBackEveryTimeDiffResponseSaga)
    yield take(WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED)
    yield cancel(timeDiffTask)

    // Start audio
    yield take(AUDIO_START)
    yield audio.start()
    yield put(setAudioStarted())

    // Wait for tick to synchronise audio
    yield take(WEBSOCKET_MESSAGE_TICK)
    yield call(syncAudioSaga)
    yield all([
        takeLatest(WEBSOCKET_MESSAGE_TICK, syncAudioSaga),
        takeLatest(FOLLOWER_INCREMENT_RESYNC_TIME_DIFF, sendManualResyncSaga),
    ])
}

export default rootSaga
