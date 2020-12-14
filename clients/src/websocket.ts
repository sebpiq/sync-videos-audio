import { Message, packMeta, unpackMeta } from './shared/websocket-messages'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { getAppState, setAppState, dispatchWebsocketMessage } from './redux'
import { ClientId } from './shared/types'

const open = async (url: string): Promise<ReconnectingWebSocket> => {
    const webSocket = new ReconnectingWebSocket(url)
    return new Promise((resolve, reject) => {
        webSocket.onopen = () => {
            setAppState({ webSocket })
            resolve(webSocket)
        }
        webSocket.onerror = (error) => reject(error)
        webSocket.onmessage = (msg) => {
            const [, , messageStr] = unpackMeta(msg.data)
            const message: Message = JSON.parse(messageStr)
            dispatchWebsocketMessage(message)
        }
    })
}

const send = async (recipientId: ClientId, message: Message) => {
    const messageStr = JSON.stringify(message)
    getAppState().webSocket.send(
        packMeta(recipientId, message.type, messageStr)
    )
}

export default { open, send }
