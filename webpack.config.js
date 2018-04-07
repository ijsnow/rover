const path = require('path');

module.exports = {
  entry: {
    background: './src/background/index.ts',
    content: './src/content/index.ts',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        use: 'tslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
