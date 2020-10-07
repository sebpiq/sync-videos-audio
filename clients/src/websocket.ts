import { Message } from "./shared/websocket-messages"
import state from "./state"

type MessageListener = (message: Message) => void

const messageListeners = {
    'tick': [] as Array<MessageListener>
}

const open = async (url: string): Promise<WebSocket> => {
    const webSocket = new WebSocket(url)
    return new Promise((resolve, reject) => {
        webSocket.onopen = () => {
            state.set({webSocket})
            resolve(webSocket)
        }
        webSocket.onerror = (error) => reject(error)
        webSocket.onmessage = (msg) => {
            const message: Message = JSON.parse(msg.data)
            messageListeners[message.type].forEach(listener => listener(message))
        }
    })
}

const send = async (message: Message) => {
    state.get().webSocket.send(JSON.stringify(message))
}

const listen = async <M extends Message>(messageType: M["type"], callback: (message: M) => void) => {
    messageListeners[messageType].push(callback)
}

export default { open, send, listen }