const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    front: "./src/front/app.ts"
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist/front")

  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/front/index.html', to: 'index.html' },
        { from: 'src/front/style.scss', to: 'style.css' },
      ],
    }),
  ],
};
