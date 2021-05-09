const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const mode = env.development ? 'development' : 'production';
  const devtool = env.development ? 'inline-source-map' : undefined;

  return {
    mode,
    devtool,
    devServer: {
      contentBase: './dist',
    },
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'RSS aggregator',
        filename: 'index.html',
        template: 'index.html',
      }),
    ],
  };
};
