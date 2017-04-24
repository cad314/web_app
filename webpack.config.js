var webpack = require("webpack");
var path = require("path");

var DEV = path.resolve(__dirname, "react_jsx");
var OUTPUT = path.resolve(__dirname, "./public/javascripts");

var main = {
    entry: {
        calendar: DEV + "/calendar.jsx"
    },
    output: {
        path: OUTPUT,
        filename: "[name].js"
    },
    module: {
        loaders: [{
            include: DEV,
            loader: "babel-loader"
        }]
    }
};

module.exports = main;