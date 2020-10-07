const path = require('path')

module.exports = {
    mode: 'none',
    entry: {
        'client-video': './src/client-video.ts',
        'client-audio': './src/client-audio/index.ts',
        'worklet-playback-node': './src/client-audio/worklet-playback-node.ts'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: path.resolve(__dirname, '..', 'html', 'build'),
    },
}