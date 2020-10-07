import config from '../config'
import { TickMessage } from '../shared/websocket-messages'
import state from '../state'
import ws from '../websocket'
import audio from './audio'

const startClicked = async () => {
    const startButton: HTMLButtonElement = document.querySelector('#start')
    return new Promise((resolve) => {
        startButton.onclick = resolve
    })
}

const main = async () => {
    await ws.open(config.webSocket.url)
    await audio.load('/media/audio.wav')
    await startClicked()
    await audio.start()
    // ws.listen("tick", (message: TickMessage) =>{
    //     state.get().audio.playbackNode
    // })

    // const audioBuffer = state.get().audio.audioBuffer
    // const context = new AudioContext()
    // const audioBufferNode = context.createBufferSource()
    // audioBufferNode.buffer = audioBuffer
    // audioBufferNode.connect(context.destination)
    // audioBufferNode.start()


}

main()
    .then(() => {
        console.log(`client started`)
    })
    .catch((error) => {
        console.error(error)
    })