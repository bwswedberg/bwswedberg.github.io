'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	devtool: 'eval-source-map',
	entry: [
		'webpack-hot-middleware/client?reload=true',
		path.join(__dirname, 'app/main.js')
	],
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'app/index.tpl.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		}),
		new ExtractTextPlugin('main.css', {allChunks: true})
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
			loader: 'file-loader?name=images/[name].[ext]'
		}, {
			test   : /\.(otf|ttf|eot|svg|woff(2)?)[.?=a-z0-9]*?$/,
			loader : 'file-loader?name=fonts/[name].[ext]'
		}, {
			test: /\.html$/,
			loader: 'html-loader?interpolate'
		}]
	}
};
