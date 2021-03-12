export default {
    webSocket: {
        url: typeof location !== 'undefined'
            ? `ws://${location.host}/`
            : 'location not available in worker',
    },
    jsRoot: '/build',
    tickInterval: 4000,
    audio: {
        channelCount: 2,
        // Max drift between audio playback and video, before resyncing (in samples)
        maxDrift: 10000,
        // Since we can't estimate audio latency, we add this systematically as an average guess (in milliseconds)
        arbitraryLatency: 200
    },
    timeDiff: {
        queryCount: 20,
        queryTimeout: 500,
    },
}
