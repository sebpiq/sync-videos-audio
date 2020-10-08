import config from '../config'
import { TickMessage } from '../shared/websocket-messages'
import state from '../state'
import ws from '../websocket'
import audio from './audio'

const addStartButton = () => {
    const button = document.createElement('button')
    button.innerText = 'START'
    document.body.appendChild(button)
    return button
}

const startClicked = async (startButton: HTMLButtonElement) => {
    return new Promise((resolve) => {
        startButton.onclick = resolve
    })
}

const main = async () => {
    await ws.open(config.webSocket.url)
    await audio.load('/media/Big_Buck_Bunny_small.mp3')
    const startButton = addStartButton()
    await startClicked(startButton)
    await audio.start()
    ws.listen("tick", (message: TickMessage) => {
        state.get().audio.playbackNode.setCurrentTime(message.payload.currentTime)
    })
}

main()
    .then(() => {
        console.log(`client started`)
    })