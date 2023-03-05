import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default (_env, _argv) => {
  return {
    stats: 'minimal',
    entry: './test/index.ts',
    output: {
      path: resolve(
        dirname(fileURLToPath(import.meta.url)),
        'test/dist'
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
      port: 4040
    },
    performance: { hints: false },
    devtool: 'source-map',
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
        template: './test/index.html',
        hash: true,
        minify: false
      })
    ],
    experiments: {
      topLevelAwait: true
    }
  };
};
