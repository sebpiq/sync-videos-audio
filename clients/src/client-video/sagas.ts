import { Saga } from 'redux-saga'
import { all, call, delay, race, take, takeEvery } from 'redux-saga/effects'
import websocket from '../websocket'
import { default as outliers } from 'outliers'
import mean from 'lodash.mean'
import { FollowerConnectMessage, Message, TimeDiffResponseMessage } from '../shared/websocket-messages'
import config from '../config'
import { ClientId } from '../shared/types'

const DELAY_BETWEEN_QUERIES = 100

function* sendTimeDiffQuerySaga(leaderTimestamp: number, followerId: ClientId) {
    yield call(websocket.send, followerId, {
        type: 'WEBSOCKET_MESSAGE_TIME_DIFF_QUERY',
        payload: { leaderTimestamp },
    })
    const { timeDiffResponse, timeout } = yield race({
        timeDiffResponse: take('WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE' as Message['type']),
        timeout: delay(config.timeDiff.queryTimeout),
    })
    if (timeout) {
        console.error('timeDiff query timeout')
        return null
    }
    return timeDiffResponse
}

function* newFollowerSaga(action: FollowerConnectMessage) {
    const timeDiffs: Array<number> = []

    for (let i = 0; i < config.timeDiff.queryCount; i++) {
        yield delay(DELAY_BETWEEN_QUERIES)
        const leaderTimestamp = Date.now()
        const timeDiffResponse: TimeDiffResponseMessage | null = yield call(
            sendTimeDiffQuerySaga,
            leaderTimestamp,
            action.payload.clientId
        )
        if (
            !timeDiffResponse ||
            timeDiffResponse.payload.leaderTimestamp !== leaderTimestamp
        ) {
            console.error(`timeDiff response error`)
            continue
        }
        const roundtripTime = Date.now() - leaderTimestamp
        const followerTimestamp = timeDiffResponse.payload.followerTimestamp - roundtripTime / 2
        // This time diff direclty gives the offset that should be applied to follower if it wants
        // to get it sync with leader
        timeDiffs.push(followerTimestamp - leaderTimestamp)
        console.log(followerTimestamp - leaderTimestamp)
    }

    const timeDiff = mean(timeDiffs.filter(outliers()))

    yield call(websocket.send, action.payload.clientId, {
        type: 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED',
        payload: { timeDiff },
    })
}

const takeEveryWebsocketMessage = (messageType: Message['type'], saga: Saga) =>
    takeEvery(messageType, saga)

function* rootSaga() {
    yield all([
        takeEveryWebsocketMessage(
            'WEBSOCKET_MESSAGE_FOLLOWER_CONNECT',
            newFollowerSaga
        ),
    ])
}

export default rootSaga
