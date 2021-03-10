import {
    TimeDiffQueryMessage,
    TimeDiffResponseMessage,
    TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE,
} from './shared/websocket-messages'

const makeTimeDiffResponseMessage = (
    TimeDiffQueryMessage: TimeDiffQueryMessage
): TimeDiffResponseMessage => ({
    type: TYPE_WEBSOCKET_MESSAGE_TIME_DIFF_RESPONSE,
    payload: {
        leaderTimestamp: TimeDiffQueryMessage.payload.leaderTimestamp,
        followerTimestamp: Date.now(),
    },
})

const exported = { makeTimeDiffResponseMessage }
export default exported
