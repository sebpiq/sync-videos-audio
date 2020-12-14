const webpackBase = require('./webpack.config')

module.exports = {
    ...webpackBase,
    watch: true,
    devtool: 'source-map',
    output: {
        ...webpackBase.output,
        filename: '[name].js',
    },
    mode: 'development',
}
