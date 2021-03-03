import { AnyAction, combineReducers, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware, { Saga } from 'redux-saga'
import { Message } from '../shared/websocket-messages'
import {
    reducer as appStateReducer,
    set as setAppStateAction,
    State as AppState,
} from './appState'
import { followerReducer, FollowerState } from './follower'
import { dispatchWebsocketMessageAction } from './websocket'

const rootReducer = combineReducers({
    appState: appStateReducer,
    follower: followerReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const initialize = (rootSaga: Saga) => {
    const sagaMiddleware = createSagaMiddleware()
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
    sagaMiddleware.run(rootSaga)
    exported.store = store
    return store
}

export const getAppState = (): Readonly<AppState> => exported.store.getState().appState

export const getFollowerState = (): Readonly<FollowerState> => exported.store.getState().follower

export const setAppState = (values: Partial<AppState>) =>
    exported.store.dispatch(setAppStateAction(values))

export const dispatchWebsocketMessage = (message: Message) =>
    exported.store.dispatch(dispatchWebsocketMessageAction(message))

export const dispatch = (action: AnyAction) =>
    exported.store.dispatch(action)

export const subscribe = (listener: () => void) => {
    exported.store.subscribe(listener)
}

const exported = {
    store: null as null | Store<RootState, any>,
    initialize,
}

export default exported
