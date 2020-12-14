import { Store } from "redux"
import { applyMiddleware, createStore } from "redux"
import createSagaMiddleware, { Saga } from 'redux-saga'
import { Message } from "../shared/websocket-messages"
import {reducer as stateReducer, set as setAppStateAction, State as AppState} from './appState'
import { dispatchWebsocketMessageAction } from "./websocket"

export const initialize = (rootSaga: Saga) => {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(
        stateReducer,
        applyMiddleware(sagaMiddleware)
    )
    sagaMiddleware.run(rootSaga)
    exported.store = store
    return store
}

export const getAppState = (): Readonly<AppState> => exported.store.getState()

export const setAppState = (values: Partial<AppState>) => 
    exported.store.dispatch(setAppStateAction(values))

export const dispatchWebsocketMessage = (message: Message) => 
    exported.store.dispatch(dispatchWebsocketMessageAction(message))

export const subscribe = (listener: () => void) => {
    exported.store.subscribe(listener)
}

const exported = {
    store: null as null | Store<AppState, any>,
    initialize
}

export default exported