const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require('webpack');

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        app: './src/app/app.ts'
    },
    optimization: {
        usedExports: true,
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HashedModuleIdsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    stats: { children: false }
};