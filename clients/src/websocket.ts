import { Message } from "./shared/websocket-messages"
import ReconnectingWebSocket from 'reconnecting-websocket'
import {getAppState, setAppState, dispatchWebsocketMessage} from "./redux"

const open = async (url: string): Promise<ReconnectingWebSocket> => {
    const webSocket = new ReconnectingWebSocket(url)
    return new Promise((resolve, reject) => {
        webSocket.onopen = () => {
            setAppState({webSocket})
            resolve(webSocket)
        }
        webSocket.onerror = (error) => reject(error)
        webSocket.onmessage = (msg) => {
            const message: Message = JSON.parse(msg.data)
            dispatchWebsocketMessage(message)
        }
    })
}

const send = async (message: Message) => {
    getAppState().webSocket.send(JSON.stringify(message))
}

export default { open, send }