import { Snapshot } from '../shared/types'
import { Message as WebSocketMessage, TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED, TYPE_WEBSOCKET_MESSAGE_TICK } from '../shared/websocket-messages'

// ------------- Action Types ------------ //
export const INCREMENT_RESYNC_TIME_DIFF = 'INCREMENT_RESYNC_TIME_DIFF'

interface IncrementResyncTimeDiff {
    type: typeof INCREMENT_RESYNC_TIME_DIFF
    payload: number
}

export type ActionTypes = IncrementResyncTimeDiff | WebSocketMessage

// ------------- Action Creators ------------ //
export const incrementResyncTimeDiff = (timeDiff: number) => ({
    type: INCREMENT_RESYNC_TIME_DIFF,
    payload: timeDiff
})

// ----------------- State --------------- //
export type FollowerState = {
    // Time difference with leader clock [follower - leader]
    timeDiff: number
    leaderSnapshot: null | Snapshot
    resyncTimeDiff: number
} | null

const initialState: FollowerState = null

// ---------------- Reducer -------------- //
export const followerReducer = (state = initialState, action: ActionTypes): FollowerState => {
    switch(action.type) {
        case TYPE_WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED:
            return {
                timeDiff: action.payload.timeDiff, 
                leaderSnapshot: null,
                resyncTimeDiff: 0
            }
        
        case TYPE_WEBSOCKET_MESSAGE_TICK:
            return {
                ...state,
                leaderSnapshot: action.payload
            }

        case INCREMENT_RESYNC_TIME_DIFF:
            return {
                ...state,
                resyncTimeDiff: state.resyncTimeDiff + action.payload,
            }

        default:
            return state
    }
}