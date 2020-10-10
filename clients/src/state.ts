import ReconnectingWebSocket from "reconnecting-websocket"
import { createStore } from "redux"
import { PlaybackNodeWorkletType } from "./client-audio/PlaybackNode/PlaybackNodeWorklet"

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

// ----------------- State --------------- //
interface State {
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
    webSocket: null,
    audio: null,
    syncState: null,
}

// ---------------- Reducer -------------- //
const reducer = (
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

const store = createStore(reducer)

// ----------------- API --------------- //
const set = (values: Partial<State>): ActionTypes => store.dispatch({
    type: SET_VALUES,
    payload: values
})

const get = (): Readonly<State> => store.getState()

const subscribe = (listener: () => void) => {
    store.subscribe(listener)
}

const refreshSyncState = (readPositionMs: number): ActionTypes => store.dispatch({
    type: REFRESH_SYNC_STATE,
    payload: readPositionMs
})

const incrementSyncStateDelay = (delayIncrementMs: number): ActionTypes => store.dispatch({
    type: INCREMENT_SYNC_STATE_DELAY,
    payload: delayIncrementMs
})

export default { set, get, refreshSyncState, incrementSyncStateDelay, subscribe }