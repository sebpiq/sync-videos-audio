import { Message as WebSocketMessage } from '../shared/websocket-messages'

// ------------- Action Types ------------ //
const INCREMENT_RESYNC_TIME_DIFF = 'INCREMENT_RESYNC_TIME_DIFF'

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
interface LeaderSyncState {
    position: number
    localTime: number
}

export type FollowerState = {
    timeDiff: number
    leader: null | LeaderSyncState
    resyncTimeDiff: number
} | null

const initialState: FollowerState = null

// ---------------- Reducer -------------- //
export const followerReducer = (state = initialState, action: ActionTypes): FollowerState => {
    switch(action.type) {
        case 'WEBSOCKET_MESSAGE_FOLLOWER_CONNECTED':
            return {
                timeDiff: action.payload.timeDiff, 
                leader: null,
                resyncTimeDiff: 0
            }
        
        case 'WEBSOCKET_MESSAGE_TICK':
            return {
                ...state,
                leader: action.payload
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