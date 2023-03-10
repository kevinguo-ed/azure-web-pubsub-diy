const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: "./client/src/app.js",
  output: {
    filename: "[name].[chunkhash].js",
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
  },
  resolve: {
    extensions: [".ts", ".js"],
    fallback: {
      "events": require.resolve("events/")
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./client/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './client/assets', to: 'assets/' },
        { from: './client/dist', to: 'dist/' }
      ]
    })
  ]
};