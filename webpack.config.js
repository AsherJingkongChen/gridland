import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';

export default (_env, argv) => {
  return {
    stats:
      argv.mode === 'development'
        ? 'minimal'
        : undefined,
    entry: './src/index.ts',
    output: {
      path: resolve(
        dirname(fileURLToPath(import.meta.url)),
        'dist'
      ),
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
                presets: ['solid']
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
        patterns: [{ from: './asset/', to: './asset/' }]
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
