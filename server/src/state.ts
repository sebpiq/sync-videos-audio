import WebSocket from 'ws'
import Koa from 'koa'
import http from 'http'
import { createStore } from 'redux'

// ------------- Action Types ------------ //
const SET_VALUES = 'SET_VALUES'

interface SetValue {
    type: typeof SET_VALUES
    payload: Partial<State>
}

type ActionTypes = SetValue

// ----------------- State --------------- //
interface State {
    httpServer: http.Server | null
    koaApp: Koa | null
    webSocketServer: WebSocket.Server | null
}

const initialState: State = {
    httpServer: null,
    koaApp: null,
    webSocketServer: null,
}

// ---------------- Reducer -------------- //
const reducer = (state = initialState, action: ActionTypes): State => {
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
const set = (values: Partial<State>): ActionTypes =>
    store.dispatch({
        type: SET_VALUES,
        payload: values,
    })

const get = (): Readonly<State> => store.getState()

export default { set, get }
