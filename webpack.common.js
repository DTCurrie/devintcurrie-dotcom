const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const webpack = require('webpack');

module.exports = {
    entry: {
        polyfills: './src/polyfills.ts',
        styles: './src/styles/styles.ts',
        main: './src/main.ts',
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
        new CleanWebpackPlugin([ 'dist' ]),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].css"
        }),
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ])
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                enforce: 'pre',
                use: [
                    'ts-loader',
                    'tslint-loader'
                ]
            },
            {
                test: /\.mp3$/,
                loader: 'file-loader',
                options: {
                    name(file) {
                        if (process.env.NODE_ENV === 'development') {
                            return 'assets/[name].[ext]'
                        }

                        return 'assets/[hash].[ext]'
                    },
                    useRelativePath: process.env.NODE_ENV === "production"
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                } ]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },
            {
                test: /(?<!\.component)\.scss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.component\.scss$/,
                use: [
                    'css-to-string-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        plugins: [ new TsconfigPathsPlugin() ]
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist')
    },
    stats: { children: false }
};