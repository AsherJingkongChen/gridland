// const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  return {
    stats:
      argv.mode === 'development'
        ? 'minimal'
        : undefined,
    entry: './src/index.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    },
    devServer: {
      compress: true,
      static: false,
      client: {
        logging: 'warn',
        overlay: {
          errors: true,
          warnings: true
        },
        progress: true
      },
      port: 8080
    },
    performance: { hints: false },
    devtool:
      argv.mode === 'development'
        ? 'source-map'
        : undefined,
    optimization: {
      minimize: argv.mode === 'production',
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: { drop_console: true },
            output: {
              comments: false,
              beautify: false
            }
          }
        }),
        new HtmlMinimizerPlugin()
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [ 'solid' ]
              }
            },
            {
              loader: 'ts-loader'
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js']
    },
    plugins: [
      // Copy our static assets to the final build
      new CopyPlugin({
        patterns: [
          { from: './asset/', to: './asset/' }
        ]
      }),

      // Make an index.html from the template
      new HtmlWebpackPlugin({
        template: './src/index.html',
        hash: true,
        minify: argv.mode === 'production'
      }),

      new SpeedMeasurePlugin({
        disable: argv.mode === 'development'
      })
    ],
    experiments: {
      topLevelAwait: true
    }
  };
};
