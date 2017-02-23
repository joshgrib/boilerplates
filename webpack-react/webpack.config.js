/*
    This is the configuration file for webpack
*/
const path = require('path');

//This handles script tag insertions for bundles
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
})

const DashboardPlugin = require('webpack-dashboard/plugin');
const DashboardPluginConfig = new DashboardPlugin();

module.exports = {
  entry: './client/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
          { test: /\.css$/, loader: 'style-loader!css-loader', exclude: /node_modules/ },
          { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
          { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    plugins: [
        HtmlWebpackPluginConfig,
        DashboardPluginConfig
    ]
}
