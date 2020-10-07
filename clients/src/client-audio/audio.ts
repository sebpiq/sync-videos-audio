import state from "../state"
import config from "../config"
import PlaybackNodeWorklet, { PlaybackNodeWorkletType } from "./PlaybackNode/PlaybackNodeWorklet";

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
    await context.audioWorklet.addModule(`${config.jsRoot}/PlaybackNodeProcessor.js`)
    state.set({audio: {...state.get().audio, context, audioBuffer}})
}

const start = async () => {
    const {context, audioBuffer} = state.get().audio
    context.resume()
    const playbackNode = (new PlaybackNodeWorklet(context, audioBuffer)) as PlaybackNodeWorkletType
    playbackNode.connect(context.destination)
    state.set({audio: {...state.get().audio, playbackNode}})
}

export default {load, start}