var webpack = require("webpack");
var path = require("path");

var DEV = path.resolve(__dirname, "public/reactjsx");
var OUTPUT = path.resolve(__dirname, "public/javascripts");

var main = {
    entry: DEV + "/calendar.jsx",
    output: {
        path: OUTPUT,
        filename: "calendar.js"
    },
    module: {
        loaders: [{
            include: DEV,
            loader: "babel-loader",
        }]
    }
};

module.exports = main;