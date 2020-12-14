const webpackBase = require('./webpack.config')

module.exports = {
    ...webpackBase,
    output: {
        ...webpackBase.output,
        filename: '[name].js',
    },
    mode: 'production',
}
