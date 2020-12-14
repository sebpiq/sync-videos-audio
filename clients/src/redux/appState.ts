import { v4 as uuidv4 } from 'uuid'
import ReconnectingWebSocket from "reconnecting-websocket"
import { PlaybackNodeWorkletType } from "../client-audio/PlaybackNode/PlaybackNodeWorklet"
import { ClientId } from '../shared/types'

// ------------- Action Types ------------ //
const SET_VALUES =
    'SET_VALUES'
const REFRESH_SYNC_STATE =
    'REFRESH_SYNC_STATE'
const INCREMENT_SYNC_STATE_DELAY =
    'INCREMENT_SYNC_STATE_DELAY'

interface SetValue {
    type: typeof SET_VALUES
    payload: Partial<State>
}

interface RefreshSyncState {
    type: typeof REFRESH_SYNC_STATE
    payload: number
}

interface SetSyncStateDelay {
    type: typeof INCREMENT_SYNC_STATE_DELAY
    payload: number
}

type ActionTypes = SetValue | RefreshSyncState | SetSyncStateDelay

// ------------- Action Creators ------------ //
export const set = (values: Partial<State>): ActionTypes => ({
    type: SET_VALUES,
    payload: values
})

// const refreshSyncState = (readPositionMs: number): ActionTypes => store.store.dispatch({
//     type: REFRESH_SYNC_STATE,
//     payload: readPositionMs
// })

// const incrementSyncStateDelay = (delayIncrementMs: number): ActionTypes => store.store.dispatch({
//     type: INCREMENT_SYNC_STATE_DELAY,
//     payload: delayIncrementMs
// })

// ----------------- State --------------- //
export interface State {
    clientId: ClientId
    webSocket: ReconnectingWebSocket | null
    audio: {
        context: AudioContext
        playbackNode: PlaybackNodeWorkletType
        audioBuffer: AudioBuffer
    } | null
    syncState: {
        timestampMs: number
        readPositionMs: number
        delayMs: number
    } | null
}

const initialState: State = {
    clientId: uuidv4(),
    webSocket: null,
    audio: null,
    syncState: null,
}

// ---------------- Reducer -------------- //
export const reducer = (
    state = initialState,
    action: ActionTypes
): State => {
    switch (action.type) {
        case SET_VALUES:
            return {
                ...state,
                ...action.payload,
            }
        case REFRESH_SYNC_STATE:
            return {
                ...state,
                syncState: {
                    ...state.syncState,
                    timestampMs: Date.now(),
                    readPositionMs: action.payload,
                },
            }
        case INCREMENT_SYNC_STATE_DELAY:
            return {
                ...state,
                syncState: {
                    ...state.syncState,
                    delayMs: (state.syncState.delayMs || 0) + action.payload,
                },
            }
        default:
            return state
    }
}