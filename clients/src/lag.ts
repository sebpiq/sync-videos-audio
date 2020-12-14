import { LagQueryMessage, LagResponseMessage } from './shared/websocket-messages'

// TODO : test timeout
const LAG_RESPONSE_TIMEOUT = 1000



const makeLagResponseMessage = (lagQueryMessage: LagQueryMessage): LagResponseMessage => ({
    type: 'WEBSOCKET_MESSAGE_LAG_RESPONSE', 
    payload: {
        leaderTimestamp: lagQueryMessage.payload.leaderTimestamp,
        followerTimestamp: Date.now()
    }
})

const exported = { makeLagResponseMessage }
export default exported