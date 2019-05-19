const path = require('path');

const resolve = {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: [
        path.resolve(__dirname, 'node_modules'),
    ]
};
const module_loader = {
    rules: [{
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
    }]
};

const wxgameConfig = {
    mode: "development",
    devtool: "sourcemap",
    // context: path.join(__dirname, 'src'),
    resolve,
    target: 'web',
    module: module_loader,
    entry: {
        "index": "./src/index",
    },
    output: {
        path: path.join(__dirname, 'wxgame'),
        filename: 'bundle.js',

    },
    plugins: [
    ]
};

module.exports = [wxgameConfig];