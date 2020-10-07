import state from "./state"

interface TickMessage {
    type: 'tick'
    payload: any
}

type Message = TickMessage

const open = async (url: string): Promise<WebSocket> => {
    const webSocket = new WebSocket(url)
    return new Promise((resolve, reject) => {
        webSocket.onopen = () => {
            state.set({webSocket})
            resolve(webSocket)
        }
        webSocket.onerror = (error) => reject(error)
        webSocket.onmessage = (msg) => {
            console.log(`webSocket msg : ${msg.data}`)
        }
    })
}

const send = async (message: Message) => {
    state.get().webSocket.send(JSON.stringify(message))
}

export default { open, send }