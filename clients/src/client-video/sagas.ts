import { Saga } from 'redux-saga'
import { all, call, delay, race, take, takeEvery } from 'redux-saga/effects'
import websocket from '../websocket'
import {default as outliers} from 'outliers'
import mean from 'lodash.mean'
import { FollowerConnectMessage, Message } from '../shared/websocket-messages'
import config from '../config'
import { ClientId } from '../shared/types'

const DELAY_BETWEEN_QUERIES = 100

function* sendLagQuerySaga (leaderTimestamp: number, followerId: ClientId) {
    yield call(websocket.send, followerId, {type: 'WEBSOCKET_MESSAGE_LAG_QUERY', payload: {leaderTimestamp}})
    const {lagResponse, timeout} = yield race({
        lagResponse: take('WEBSOCKET_MESSAGE_LAG_RESPONSE' as Message["type"]),
        timeout: delay(config.lag.queryTimeout)
    })
    if (timeout) {
        console.error('lag query timeout')
        return null
    }
    return lagResponse
}

function* newFollowerSaga(action: FollowerConnectMessage) {
    const lags: Array<number> = []

    for (let i = 0; i < config.lag.queryCount; i++) {
        yield delay(DELAY_BETWEEN_QUERIES)
        const leaderTimestamp = Date.now()
        const lagResponse = yield call(sendLagQuerySaga, leaderTimestamp, action.payload.clientId)
        if (!lagResponse || lagResponse.payload.leaderTimestamp !== leaderTimestamp) {
            console.error(`lag response error`)
            continue
        }
        const roundtripTime = Date.now() - leaderTimestamp
        const lag = (lagResponse.payload.followerTimestamp - roundtripTime / 2) - leaderTimestamp
        lags.push(lag)
    }

    const lagTime = mean(lags.filter(outliers()))

    yield call(websocket.send, action.payload.clientId, { type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED', payload: { lagTime } })
} 

const takeEveryWebsocketMessage = (messageType: Message["type"], saga: Saga) => 
    takeEvery(messageType, saga)

function* rootSaga() {
    yield all([
        takeEveryWebsocketMessage('WEBSOCKET_MESSAGE_FOLLOWER_CONNECT', newFollowerSaga)
    ])
}

export default rootSaga