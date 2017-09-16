const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: [
        __dirname + '/static-src/js/app.jsx'
    ],
    output: {
        path: __dirname + '/static',
        filename: '[name].js',
        publicPath: '/static/'
    },
    devtool: 'eval-source-map',
    module: {
        loaders: [
            {
                enforce: 'pre',
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                options: {
                    presets: [['env', {targets: {browsers: 'last 2 versions'}}], 'react'],
                    plugins: ['transform-decorators-legacy', 'transform-object-rest-spread', 'lodash']
                },
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            }, {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader!sass-loader'
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('[name].css'),
        new HtmlWebpackPlugin({
            title: 'Changelog',
            hash: true
        })
    ]
};
