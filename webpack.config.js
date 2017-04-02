const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const packageJson = require('./package.json');

const serverPublic = path.join(__dirname, 'server', 'public');

module.exports = {
    entry: [
        'babel-polyfill',
        './dlxlib/index.js',
        './solving/index.js',
        './client/index.js'
    ],
    output: {
        path: serverPublic,
        filename: 'bundle.js',
    },
    plugins: [
        new CopyWebpackPlugin([
            { context: './client', from: '*.html' },
            { context: './client', from: '*.css' }
        ]),
        new HtmlWebpackPlugin({
            template: './client/index.html',
            version: packageJson.version
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.glsl$/,
                use: 'webpack-glsl-loader'
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        contentBase: serverPublic
    }
};
