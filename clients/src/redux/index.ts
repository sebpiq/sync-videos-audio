import { AnyAction, combineReducers, Store } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware, { Saga } from 'redux-saga'
import { Message } from '../shared/websocket-messages'
import {
    reducer as appStateReducer,
    set as setAppStateAction,
    State as AppState,
} from './appState'
import { audioReducer, AudioState, setAudio } from './audio'
import { followerReducer, FollowerState } from './follower'
import { navigationReducer, NavigationState } from './navigation'
import { dispatchWebsocketMessageAction } from './websocket'

const rootReducer = combineReducers({
    appState: appStateReducer,
    follower: followerReducer,
    navigation: navigationReducer,
    audio: audioReducer,
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

export const getAudioState = (): Readonly<AudioState> => exported.store.getState().audio

export const getFollowerState = (): Readonly<FollowerState> => exported.store.getState().follower

export const getNavigationState = (): Readonly<NavigationState> => exported.store.getState().navigation

export const setAppState = (values: Partial<AppState>) =>
    exported.store.dispatch(setAppStateAction(values))

export const setAudioState = (values: Partial<AudioState>) =>
    exported.store.dispatch(setAudio(values))

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
