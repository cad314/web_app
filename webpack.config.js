var webpack = require("webpack");
var path = require("path");

var DEV = path.resolve(__dirname, "react_jsx");
var OUTPUT = path.resolve(__dirname, "./public/javascripts");

var main = {
    entry: {
        calendar: DEV + "/calendar.jsx",
        navbar: DEV + "/navbar.jsx"
    },
    output: {
        path: OUTPUT,
        filename: "[name].js"
    },

    module: {
        loaders: [{
            include: DEV,
            test   :/\.jsx?$/,
            exclude:/(node_modules|bower_components)/,
            loader: "babel-loader",
            query  :{
                presets:['react','es2015']
            }
        }]
    }
};

module.exports = main;