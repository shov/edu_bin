const path = require('path');

module.exports = {

  target: 'electron-renderer',
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    front: "./src/main/main.ts"
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist/main")

  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};
