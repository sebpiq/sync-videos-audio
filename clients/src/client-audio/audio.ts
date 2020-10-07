import state from "../state"
import config from "../config"

class PlaybackWorkletNode extends AudioWorkletNode {
    constructor(context: AudioContext, audioBuffer: AudioBuffer) {
        super(context, 'playback-node', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [1] })

        const anotherArray = new Float32Array(audioBuffer.length);
        audioBuffer.copyFromChannel(anotherArray,0,0);
        this.port.postMessage(anotherArray)
    }
}

const loadSound = async (context: AudioContext, url: string): Promise<AudioBuffer> => {
    const request = new XMLHttpRequest();
    request.open('GET', url)
    request.responseType = 'arraybuffer';
    request.send()

    return new Promise((resolve, reject) => {
        request.onload = function() {
            context.decodeAudioData(request.response, resolve, reject)
        }
    })
}

const load = async (soundUrl: string): Promise<void> => {
    const context = new AudioContext()
    const audioBuffer = await loadSound(context, soundUrl)
    await context.audioWorklet.addModule(`${config.jsRoot}/worklet-playback-node.js`)
    state.set({audio: {...state.get().audio, context, audioBuffer}})
}

const start = async () => {
    const {context, audioBuffer} = state.get().audio
    context.resume()
    const playbackNode = new PlaybackWorkletNode(context, audioBuffer)
    playbackNode.connect(context.destination)
    state.set({audio: {...state.get().audio, playbackNode}})
}

export default {load, start}