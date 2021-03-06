const merge = require('webpack-merge');
const CompressionPlugin = require('compression-webpack-plugin');

const common = require('./webpack.common.js');

const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new LicenseWebpackPlugin(),
        new CompressionPlugin({
            filename: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$|\.html$/,
            threshold: 10240,
            minRatio: 0
        })
    ]
});