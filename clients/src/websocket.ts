import { Message } from "./shared/websocket-messages"
import { EventEmitter } from 'events'
import ReconnectingWebSocket from 'reconnecting-websocket'
import state from "./state"
import { Emitter as pEventEmitter } from "p-event"

const eventEmitter = new EventEmitter()
const pEventEmitter = eventEmitter as pEventEmitter<Message["type"], [Message]>

const open = async (url: string): Promise<ReconnectingWebSocket> => {
    const webSocket = new ReconnectingWebSocket(url)
    return new Promise((resolve, reject) => {
        webSocket.onopen = () => {
            state.set({webSocket})
            resolve(webSocket)
        }
        webSocket.onerror = (error) => reject(error)
        webSocket.onmessage = (msg) => {
            const message: Message = JSON.parse(msg.data)
            eventEmitter.emit(message.type, message)
        }
    })
}

const send = async (message: Message) => {
    state.get().webSocket.send(JSON.stringify(message))
}

const listen = async <M extends Message>(messageType: M["type"], callback: (message: M) => void) => {
    eventEmitter.on(messageType, callback)
}

export default { open, send, listen, events: pEventEmitter }