const webpackBase = require( './webpack.config')

module.exports = {
    ...webpackBase,
    output: {
        filename: '[name].[contentHash].bundle.js'
    },
    mode: 'production'
}