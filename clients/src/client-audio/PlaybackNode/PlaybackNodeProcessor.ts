import config from '../../config'
import { PlaybackNodeMessageData } from './types'

class PlaybackNodeProcessor extends AudioWorkletProcessor {
    private audioArrays: Array<Float32Array>
    private readPosition: number
    private channelCount: number | null

    constructor() {
        super()
        this.audioArrays = null
        this.channelCount = null
        this.readPosition = 0
        this.port.onmessage = (event) => {
            const messageData: PlaybackNodeMessageData = event.data

            if ('audioArrays' in messageData) {
                this.audioArrays = messageData.audioArrays
                this.channelCount = messageData.audioArrays.length
                console.log(
                    `[PlaybackNodeProcessor] audioArrays | channels ${this.channelCount} | length ${this.audioArrays[0].length}`
                )
            }

            if ('readPosition' in messageData) {
                if (
                    Math.abs(this.readPosition - messageData.readPosition) >
                    config.audio.maxDrift
                ) {
                    this.readPosition = messageData.readPosition
                    console.log(
                        `[PlaybackNodeProcessor] resyncing audio to ${messageData.readPosition}`
                    )
                }
            }
        }
    }

    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ) {
        if (!this.audioArrays) {
            return true
        }
        const output = outputs[0]
        const outputLength = output[0].length
        for (let channel = 0; channel < this.channelCount; channel++) {
            output[channel].set(
                this.audioArrays[channel].subarray(
                    this.readPosition,
                    this.readPosition + outputLength
                )
            )
        }
        this.readPosition += outputLength
        return true
    }
}

registerProcessor('playback-node', PlaybackNodeProcessor)
