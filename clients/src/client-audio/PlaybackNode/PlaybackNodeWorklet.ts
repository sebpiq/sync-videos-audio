import config from '../../config'
import { MediaStatus } from '../../shared/types'
import { PlaybackNodeMessageData } from './types'

export default class PlaybackNodeWorklet extends AudioWorkletNode {
    constructor(context: AudioContext, audioBuffer: AudioBuffer) {
        const channelCount = Math.min(
            audioBuffer.numberOfChannels,
            config.audio.channelCount
        )
        super(context, 'playback-node', {
            numberOfInputs: 0,
            numberOfOutputs: 1,
            outputChannelCount: [channelCount],
        })

        const node: PlaybackNodeWorkletType = Object.assign(this, Methods)
        node._constructor(audioBuffer, channelCount)
    }
}

// Hack because the polyfill creates a ScriptProcessorNode, so if we simply declare the class in a
// traditional way, `this` doesn't have the additional methods.
const Methods = {
    _constructor(audioBuffer: AudioBuffer, channelCount: number) {
        console.log(`Sample rate context ${this.context.sampleRate} | buffer ${audioBuffer.sampleRate}`)
        const audioArrays: Array<Float32Array> = []
        for (let ch = 0; ch < channelCount; ch++) {
           const audioArray = new Float32Array(audioBuffer.length)
           audioArrays.push(audioArray)
           audioBuffer.copyFromChannel(audioArray, ch, 0)
        }
        this._postMessage({ audioArrays })
    },

    setCurrentTime(timeMs: number) {
        this._postMessage({ 
            readPosition: this._msToFrames(timeMs) 
        })
    },

    sendManualResync(timeMs: number) {
        this._postMessage({
            manualResync: this._msToFrames(timeMs)
        })
    },

    play() {
        this._postMessage({ status: MediaStatus.PLAYING })
    },

    pause() {
        this._postMessage({ status: MediaStatus.NOT_PLAYING })
    },

    _msToFrames(timeMs: number) {
        return Math.round(
            (timeMs / 1000) * this.context.sampleRate
        )
    },

    _postMessage(messageData: PlaybackNodeMessageData) {
        this.port.postMessage(messageData)
    },
}

// Hack 2, since we dynamically bind the methods, we also have to create a special
// type for the `PlaybackNodeWorklet`
export type PlaybackNodeWorkletType = PlaybackNodeWorklet & typeof Methods
