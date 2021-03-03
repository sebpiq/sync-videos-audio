import { setAppState, getAppState } from '../redux'
import config from '../config'
import PlaybackNodeWorklet, {
    PlaybackNodeWorkletType,
} from './PlaybackNode/PlaybackNodeWorklet'

const loadSound = async (
    context: AudioContext,
    url: string
): Promise<AudioBuffer> => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.responseType = 'arraybuffer'
    request.send()

    return new Promise((resolve, reject) => {
        request.onload = function () {
            context.decodeAudioData(request.response, resolve, reject)
        }
    })
}

const createAudioContext = async (): Promise<AudioContext> => {
    const context = new AudioContext()
    await context.audioWorklet.addModule(
        `${config.jsRoot}/PlaybackNodeProcessor.js`
    )
    return context
}

const buildAudioGraph = async (audioContext: AudioContext, audioBuffer: AudioBuffer) => {
    audioContext.resume()
    const playbackNode = new PlaybackNodeWorklet(
        audioContext,
        audioBuffer
    ) as PlaybackNodeWorkletType
    playbackNode.connect(audioContext.destination)
    return playbackNode
}

const load = async (soundUrl: string): Promise<void> => {
    const context = await createAudioContext()
    const audioBuffer = await loadSound(context, soundUrl)
    setAppState({ audio: { ...getAppState().audio, context, audioBuffer } })
}

const start = async () => {
    const { context, audioBuffer } = getAppState().audio
    const playbackNode = await buildAudioGraph(context, audioBuffer)
    setAppState({ audio: { ...getAppState().audio, playbackNode } })
}

export default { load, start, createAudioContext, loadSound, buildAudioGraph }
