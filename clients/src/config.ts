export default {
    webSocket: {
        url: location ? `ws://${location.host}/` : 'location not available in worker'
    },
    jsRoot: '/build',
    tickInterval: 1000,
    audio: {
        channelCount: 2,
        // Max drift between audio playback and video, before resyncing (in samples)
        maxDrift: 0.1
    }
}