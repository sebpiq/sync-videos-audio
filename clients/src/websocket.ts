export const openWebSocket = async () => {
    const websocket = new WebSocket('ws://localhost:3000/')
    return new Promise((resolve, reject) => {
        websocket.onopen = () => resolve(websocket)
        websocket.onerror = (error) => reject(error)
        websocket.onmessage = (msg) => {
            console.log(`websocket msg : ${msg.data}`)
        }
    })
}