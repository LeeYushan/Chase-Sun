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

const gameConfig = {
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
        path: path.join(__dirname, 'out'),
        filename: 'dist/bundle.js',

    },
    plugins: [
    ]
};



const editorConfig = {
    mode: "development",
    devtool: "sourcemap",
    // context: path.join(__dirname, 'editor'),
    resolve,
    target: "electron-renderer",
    module: module_loader,
    entry: {
        "editor": "./editor/index",
    },
    output: {
        path: path.join(__dirname, 'out'),
        filename: 'dist/editor.js',

    },
    plugins: [
    ]
};

module.exports = [gameConfig, editorConfig];