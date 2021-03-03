import { v4 as uuidv4 } from 'uuid'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { PlaybackNodeWorkletType } from '../client-audio/PlaybackNode/PlaybackNodeWorklet'
import { ClientId } from '../shared/types'

// ------------- Action Types ------------ //
const SET_VALUES = 'SET_VALUES'

interface SetValue {
    type: typeof SET_VALUES
    payload: Partial<State>
}

type ActionTypes = SetValue

// ------------- Action Creators ------------ //
export const set = (values: Partial<State>): ActionTypes => ({
    type: SET_VALUES,
    payload: values,
})

// ----------------- State --------------- //
export interface State {
    clientId: ClientId
    webSocket: ReconnectingWebSocket | null
    audio: {
        context: AudioContext
        playbackNode: PlaybackNodeWorkletType
        audioBuffer: AudioBuffer
    } | null
}

const initialState: State = {
    clientId: uuidv4(),
    webSocket: null,
    audio: null,
}

// ---------------- Reducer -------------- //
export const reducer = (state = initialState, action: ActionTypes): State => {
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