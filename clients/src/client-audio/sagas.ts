import { Saga } from 'redux-saga'
import { all, takeEvery } from 'redux-saga/effects'
import websocket from '../websocket'
import lag from '../lag'
import { LagQueryMessage, LagResponseMessage } from '../shared/websocket-messages'
import { Message } from '../shared/websocket-messages'
import { LEADER_ID } from '../shared/constants'

function* sendBackLagResponseSaga(lagQueryMessage: LagQueryMessage) {
    const lagResponseMessage: LagResponseMessage = lag.makeLagResponseMessage(lagQueryMessage)
    websocket.send(LEADER_ID, lagResponseMessage)
}

function* bla(lagQueryMessage: LagQueryMessage) {
    console.log('CONNECTED', lagQueryMessage)
}

const takeEveryWebsocketMessage = (messageType: Message["type"], saga: Saga) => 
    takeEvery(messageType, saga)

function* rootSaga() {
    yield all([
        takeEveryWebsocketMessage('WEBSOCKET_MESSAGE_LAG_QUERY', sendBackLagResponseSaga),
        takeEveryWebsocketMessage('WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED', bla)
    ])
}

export default rootSaga;