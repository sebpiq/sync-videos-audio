const path = require('path')

module.exports = {
    mode: 'none',
    entry: {
        'client-video': './src/client-video/index.ts',
        'client-audio': './src/client-audio/index.ts',
        'PlaybackNodeProcessor': './src/client-audio/PlaybackNode/PlaybackNodeProcessor.ts'
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