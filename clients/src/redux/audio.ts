import { PlaybackNodeWorkletType } from '../client-audio/PlaybackNode/PlaybackNodeWorklet'

// ------------- Action Types ------------ //
const AUDIO_SET_VALUES = 'AUDIO_SET_VALUES'
export const AUDIO_START = 'AUDIO_START'
export const AUDIO_STARTED = 'AUDIO_STARTED'

interface SetValue {
    type: typeof AUDIO_SET_VALUES
    payload: Partial<AudioState>
}

interface StartAudio {
    type: typeof AUDIO_START
}

interface AudioStarted {
    type: typeof AUDIO_STARTED
}

type ActionTypes = SetValue | StartAudio | AudioStarted

// ------------- Action Creators ------------ //
export const setAudio = (values: Partial<AudioState>): ActionTypes => ({
    type: AUDIO_SET_VALUES,
    payload: values,
})

export const startAudio = (): ActionTypes => ({
    type: AUDIO_START,
})

export const setAudioStarted = (): ActionTypes => ({
    type: AUDIO_STARTED,
})

// ----------------- State --------------- //
export interface AudioState {
    isStarted: boolean
    context: AudioContext
    playbackNode: PlaybackNodeWorkletType
    audioBuffer: AudioBuffer | null
    isPollyfilled: boolean,
    pollyfillSampleCount: number,
}
export type State = AudioState | null

const initialState: State = null

// ---------------- Reducer -------------- //
export const audioReducer = (state = initialState, action: ActionTypes): State => {
    switch (action.type) {
        case AUDIO_SET_VALUES:
            return {
                ...state,
                ...action.payload,
            }
        case AUDIO_STARTED:
            return {
                ...state,
                isStarted: true,
            }
        default:
            return state
    }
}