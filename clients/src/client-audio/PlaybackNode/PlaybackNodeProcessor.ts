import config from '../../config'
import { MediaStatus } from '../../shared/types'
import { PlaybackNodeMessageData } from './types'
import { applyManualResync } from './utils'

class PlaybackNodeProcessor extends AudioWorkletProcessor {
    private playing: boolean = false
    private audioArrays: Array<Float32Array> = null
    private zerosArray: Float32Array = null
    private readPosition: number = 0
    private channelCount: number | null = null
    private manualResync: number = 0

    constructor() {
        super()
        this.port.onmessage = (event) => {
            const messageData: PlaybackNodeMessageData = event.data

            if ('audioArrays' in messageData) {
                this.audioArrays = messageData.audioArrays
                this.channelCount = messageData.audioArrays.length
                console.log(
                    `[PlaybackNodeProcessor] audioArrays | channels ${this.channelCount} | length ${this.audioArrays[0].length}`
                )
            }

            if ('manualResync' in messageData) {
                this.manualResync = messageData.manualResync
                console.log(
                    `[PlaybackNodeProcessor] manualResync ${this.manualResync}`
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

            if ('status' in messageData) {
                // Make sure to initialize read position when (re)starting to play
                if (!this.playing && 'readPosition' in messageData) {
                    this.readPosition = messageData.readPosition
                }
                this.playing = (messageData.status === MediaStatus.PLAYING)
            }
        }
    }

    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ) {
        if (this.zerosArray === null) {
            this.zerosArray = new Float32Array(outputs[0][0].length)
        }

        // Returning zeros if not playing or no data yet
        if (!this.playing || !this.audioArrays) {
            const output = outputs[0]
            for (let channel = 0; channel < this.channelCount; channel++) {
                output[channel].set(this.zerosArray)
            }
            return true
        }

        // Returning the sound at current position
        const output = outputs[0]
        const outputLength = output[0].length
        const readPosition = applyManualResync(this.readPosition, this.manualResync)
        for (let channel = 0; channel < this.channelCount; channel++) {
            output[channel].set(
                this.audioArrays[channel].subarray(
                    readPosition,
                    readPosition + outputLength
                )
            )
        }
        this.readPosition += outputLength
        return true
    }
}

registerProcessor('playback-node', PlaybackNodeProcessor)
