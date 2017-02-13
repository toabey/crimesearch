var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// input dir
const APP_DIR = path.resolve(__dirname, './');

// output dir
const BUILD_DIR = path.resolve(__dirname, './javascripts/dist');

module.exports = {
    devtool:"eval",
    entry: [
        'index.tsx'
    ],
    output: {
        path: BUILD_DIR,
        filename: 'app.js'
    },
    resolve: {
        // Look for modules in .ts(x) files first, then .js(x)
        extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
        // Add 'src' to our modulesDirectories, as all our app code will live in there, so Webpack should look in there for modules
        modulesDirectories: ['src', 'node_modules'],
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loaders: ['babel', 'ts-loader'] },
            {
                test: /\.jsx?$/,
                exclude: APP_DIR + '/node_modules',
                loader: 'babel'
            },
            {
                test: /\.(scss|css)$/,
                loader: ExtractTextPlugin.extract("style-loader","css-loader!sass-loader")
            },
            // loaders for font-awesome fonts
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff'
            },
            { test: /\.(ttf|eot|jpg|png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            }
        ]
    }
};
