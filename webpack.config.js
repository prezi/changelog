var webpack = require('webpack');

module.exports = {
    entry: [
        __dirname + "/static-src/js/app.js"
    ],
    output: {
        path: __dirname + '/static/js',
        filename: "app.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['env', 'react']
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
    ]
};