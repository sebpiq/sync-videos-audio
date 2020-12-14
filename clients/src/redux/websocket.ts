import { Message } from '../shared/websocket-messages'

// ------------- Action Types ------------ //
interface WebsocketMessage {
    type: Message['type']
    payload: Message['payload']
}

type ActionTypes = WebsocketMessage

// ------------- Action Creators ------------ //
export const dispatchWebsocketMessageAction = (message: Message): ActionTypes =>
    message
