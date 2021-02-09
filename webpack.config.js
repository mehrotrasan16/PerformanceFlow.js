module.exports = {
    entry: "./app.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
        ]
    },
    watchOptions: {
        ignored: "**/.*"
    },
    externals: {
        "jquery": "jQuery",
        "requirejs":"require"
    },
    mode: "development"
}