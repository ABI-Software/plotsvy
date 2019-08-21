var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: "none",
  entry: {
    "build": "./js/plotsvy.js",
    "build.min": "./js/plotsvy.js",
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: "[name].js",
    library: 'plotsvy',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      { test: /\.(html)$/, use: [{ loader: 'html-loader' }]},
      { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
      { test: /\.(jpe?g|gif|png)$/i,
        loader:"file-loader",
        query:{
          name:'[name].[ext]',
          outputPath:'css/images/' }
      },
      { test: /\.(vs|fs)$/i,
        loaders: [
          'raw-loader'
        ]
      },
      {
        test: /node_modules/,
        loader: 'ify-loader'
      }      
    ]
  },
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  plugins: [
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      uglifyOptions: {
        compress: true
      }
    }),
    new BundleAnalyzerPlugin(),
  ]
};