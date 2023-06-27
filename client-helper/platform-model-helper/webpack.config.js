const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
	mode: "production",
	entry: './src/',
	output: {
		filename: 'platfromBundle.js',
		path: path.resolve(__dirname, 'dist'),
		libraryTarget: "umd",
		globalObject: "this",
		library: "platfrom"
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Alfred Test'
		}),
		new ESLintPlugin()
	],
};
