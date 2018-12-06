const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const webpack = require('webpack');

const packageJson = require('./package.json');
const vendorDependencies = Object.keys(packageJson[ 'dependencies' ]);

const babelLoader = {
    loader: 'babel-loader',
    options: {
        cacheDirectory: true,
        presets: [ '@babel/preset-env' ]
    }
};

const webpackConfig = {
    context: __dirname,
    entry: {
        polyfills: './src/polyfills.ts',
        styles: './src/styles.ts',
        main: './src/main.ts'
    },
    optimization: {
        concatenateModules: true,
        usedExports: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            name: true,
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'initial',
                    minChunks: 2
                }
            }
        }
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new CleanWebpackPlugin([ 'dist' ]),
        new CopyWebpackPlugin([ { from: 'src/assets', to: 'assets' } ]),
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        }),
        new HtmlWebpackPlugin({
            filename: 'site.html',
            template: './src/site.html'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].css"
        })
    ],
    module: {
        rules: [
            {
                test: /(?<!\.module)\.ts$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    { loader: 'cache-loader' },
                    {
                        loader: 'thread-loader',
                        options: {
                            workers: require('os').cpus().length - 1,
                        },
                    },
                    babelLoader,
                    {
                        loader: 'ts-loader',
                        options: {
                            happyPackMode: true
                        }
                    },
                    'tslint-loader'
                ]
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    babelLoader
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src'),
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
                include: path.resolve(__dirname, 'src'),
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            },
            {
                test: /(?<!\.component)\.scss$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    { loader: 'sass-loader', options: { workerParallelJobs: 2 } }
                ]
            },
            {
                test: /\.component\.scss$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'css-to-string-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                    { loader: 'sass-loader', options: { workerParallelJobs: 2 } }
                ]
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js' ],
        plugins: [ new TsconfigPathsPlugin() ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash].js',
        chunkFilename: '[name].chunk.[hash].js'
    },
    stats: {
        children: false,
        warningsFilter: /(license-webpack-plugin|thread-loader)/
    }
};

if (vendorDependencies && vendorDependencies.length) {
    webpackConfig.entry[ 'vendor' ] = vendorDependencies;
}

module.exports = webpackConfig;