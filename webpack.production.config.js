'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StatsPlugin = require('stats-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'app/main.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[hash].min.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new StatsPlugin('webpack.stats.json', {
      source: false,
      modules: false
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
	  loaders: [{
		  test: /\.js?$/,
		  exclude: /node_modules/,
		  loader: 'babel'
	  }, {
		  test: /\.json?$/,
		  loader: 'json'
	  }, {
		  test: /\.scss$/,
		  loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
	  }, {
		  test: /\.(png|jpg|gif)$/,
		  loader: 'file-loader?name=img/[name].[ext]'
	  }, {
		  test   : /\.(otf|ttf|eot|svg|woff(2)?)[.?=a-z0-9]*?$/,
		  loader : 'file-loader?name=font/[name].[ext]'
	  }, {
		  test: /\.html$/,
		  loader: 'html-loader?interpolate'
	  }]
  }
};
