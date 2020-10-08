export default {
    webSocket: {
        url: location ? `ws://${location.host}/` : 'location not available in worker'
    },
    jsRoot: '/build',
    audio: {
        channelCount: 2,
        // Max drift between audio playback and video, before resyncing (in samples)
        maxDrift: 0.1
    }
}