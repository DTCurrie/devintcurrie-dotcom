const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    plugins: [ new LicenseWebpackPlugin() ]
});