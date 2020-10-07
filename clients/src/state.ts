import { createStore } from "redux"
import { PlaybackNodeWorkletType } from "./client-audio/PlaybackNode/PlaybackNodeWorklet"

// ------------- Action Types ------------ //
const SET_VALUES =
    'SET_VALUES'

interface SetValue {
    type: typeof SET_VALUES
    payload: Partial<State>
}

type ActionTypes = SetValue

// ----------------- State --------------- //
interface State {
    webSocket: WebSocket | null
    audio: {
        context: AudioContext
        playbackNode: PlaybackNodeWorkletType
        audioBuffer: AudioBuffer
    } | null
}

const initialState: State = {
    webSocket: null,
    audio: null
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

export default { set, get }