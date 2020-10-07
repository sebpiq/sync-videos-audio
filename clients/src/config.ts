export default {
    webSocket: {
        url: 'ws://localhost:3000/'
    },
    jsRoot: '/build',
    audio: {
        channelCount: 2,
        // Max drift between audio playback and video, before resyncing (in samples)
        maxDrift: 0.1
    }
}