// REF : http://mohayonao.github.io/web-audio-api-shim/
const installAudioBufferCopyFromChannel = () => {
    if (AudioBuffer.prototype.hasOwnProperty('copyFromChannel')) {
        return
    }
    AudioBuffer.prototype.copyFromChannel = function (
        destination,
        channelNumber,
        startInChannel
    ) {
        var source = this.getChannelData(channelNumber | 0).subarray(
            startInChannel | 0
        )

        destination.set(
            source.subarray(0, Math.min(source.length, destination.length))
        )
    }
}

export default () => {
    installAudioBufferCopyFromChannel()
}
