import { Saga } from 'redux-saga'
import { all, call, delay, race, take, takeEvery } from 'redux-saga/effects'
import websocket from '../websocket'
import {default as outliers} from 'outliers'
import mean from 'lodash.mean'
import { Message } from '../shared/websocket-messages'
import config from '../config'

function* sendLagQuerySaga (leaderTimestamp: number) {
    yield call(websocket.send, {type: 'WEBSOCKET_MESSAGE_LAG_QUERY', payload: {leaderTimestamp}})
    const {lagResponse, timeout} = yield race({
        lagResponse: take('WEBSOCKET_MESSAGE_LAG_RESPONSE' as Message["type"]),
        timeout: delay(config.lag.queryTimeout)
    })
    return lagResponse
}

function* newFollowerSaga() {
    const lags: Array<number> = []

    for (let i = 0; i < config.lag.queryCount; i++) {
        const leaderTimestamp = Date.now()
        const lagResponse = yield call(sendLagQuerySaga, leaderTimestamp)
        const roundtripTime = Date.now() - leaderTimestamp
        if (lagResponse.payload.leaderTimestamp !== leaderTimestamp) {
            console.error(`lag response doesn't correspond with lag query`)
            continue
        }
        const lag = (lagResponse.payload.followerTimestamp - roundtripTime / 2) - leaderTimestamp
        lags.push(lag)
    }

    const lagTime = mean(lags.filter(outliers()))

    yield call(websocket.send, { type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED', payload: { lagTime } })
} 

const takeEveryWebsocketMessage = (messageType: Message["type"], saga: Saga) => 
    takeEvery(messageType, saga)

function* rootSaga() {
    yield all([
        takeEveryWebsocketMessage('WEBSOCKET_MESSAGE_FOLLOWER_CONNECT', newFollowerSaga)
    ])
}

export default rootSaga