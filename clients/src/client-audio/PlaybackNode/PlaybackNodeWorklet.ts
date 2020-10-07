import config from "../../config";
import { PlaybackNodeMessageData } from "./types";

export default class PlaybackNodeWorklet extends AudioWorkletNode {
    constructor(context: AudioContext, audioBuffer: AudioBuffer) {
        super(context, 'playback-node', { numberOfInputs: 0, numberOfOutputs: 1, outputChannelCount: [config.audio.channelCount] })
        const anotherArray = new Float32Array(audioBuffer.length);
        audioBuffer.copyFromChannel(anotherArray,0,0)

        const self: PlaybackNodeWorkletType = Object.assign(this, Methods)
        // Object.entries(Methods).forEach(([methodName, func]) => (this as any)[methodName] = func)
        self._constructor(anotherArray)
        return self
    }
}

// Hack because the polyfill creates a ScriptProcessorNode, so if we simply declare the class in a
// traditional way, `this` doesn't have the additional methods.
const Methods = {
    _constructor(anotherArray: Float32Array) {
        this._postMessage({audioArrays: [anotherArray]})
    },

    setCurrentTime(time: number) {
        const readPosition = Math.round(time * this.context.sampleRate)
        this._postMessage({readPosition})
    },

    _postMessage(messageData: PlaybackNodeMessageData) {
        this.port.postMessage(messageData)
    }
}

// Hack 2, since we dynamically bind the methods, we also have to create a special
// type for the `PlaybackNodeWorklet`
export type PlaybackNodeWorkletType = PlaybackNodeWorklet & typeof Methods