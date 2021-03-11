import { setAppState, getAppState, setAudioState, getAudioState } from '../redux'
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

const buildAudioGraph = async (
    audioContext: AudioContext,
    audioBuffer: AudioBuffer
) => {
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
    setAudioState({
        context,
        audioBuffer,
        playbackNode: null,
        isPollyfilled: (window as any).polyfilledAudioWorkletNode,
        pollyfillSampleCount: (window as any).polyfilledAudioWorkletNodeSampleCount,
        isStarted: false,
    })
}

const start = async () => {
    const { context, audioBuffer } = getAudioState()
    const playbackNode = await buildAudioGraph(context, audioBuffer)
    setAudioState({
        ...getAudioState(),
        playbackNode,
        // It seems polyfilling happens only when first node created
        isPollyfilled: (window as any).polyfilledAudioWorkletNode,
        pollyfillSampleCount: (window as any).polyfilledAudioWorkletNodeSampleCount,
    })
}

export default { load, start, createAudioContext, loadSound, buildAudioGraph }
