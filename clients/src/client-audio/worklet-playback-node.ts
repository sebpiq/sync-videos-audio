class PlaybackNodeProcessor extends AudioWorkletProcessor {
    private buffer: Float32Array
    private readPosition: number

    constructor() {
        super();
        this.buffer = null
        this.readPosition = 0
        this.port.onmessage = (event) => {
            // Handling data from the node.
            this.buffer = event.data
        };
    }
  
    process(
        inputs: Float32Array[][],
        outputs: Float32Array[][],
        parameters: Record<string, Float32Array>
    ) {
        if (!this.buffer) {
            return true
        }
        const output = outputs[0];
        const outputChannel0 = output[0];

        const block = this.buffer.subarray(this.readPosition, this.readPosition + outputChannel0.length)
        outputChannel0.set(block)
        this.readPosition += outputChannel0.length
        return true
    }
}
  
registerProcessor('playback-node', PlaybackNodeProcessor);