/**
 * @author: @JonnyBGod
 */

const helpers = require('./helpers');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge'); // used to merge webpack configs

const customConfig = require('../custom/webpack.common.js');

/**
 * Webpack Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');

/**
 * Webpack Constants
 */
const METADATA = Object.assign({
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer()
}, customConfig.metadata);

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {
  return webpackMerge.smart({

    resolve: {
      alias: {
        components: helpers.root('src/app/components'),
        shared: helpers.root('src/app/shared'),
        assets: helpers.root('src/assets')
      }
    },

    module: {

      /*
       * An array of automatically applied loaders.
       *
       * IMPORTANT: The loaders here are resolved relative to the resource which they are applied to.
       * This means they are not resolved relative to the configuration file.
       *
       * See: http://webpack.github.io/docs/configuration.html#module-loaders
       */
      rules: [
        { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'url-loader?limit=10000' }
      ]

    },

    plugins: [
      new NormalModuleReplacementPlugin(
        /routerModule/,
        helpers.root('src/app/app.routerModule.ts')
      ),
      /**
       * Plugin: DefinePlugin
       * Description: Define free variables.
       * Useful for having development builds with debug logging or adding global constants.
       *
       * Environment helpers
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
       */
      // NOTE: when adding more properties, make sure you include them in custom-typings.d.ts
      new DefinePlugin({
        'BASE_URL': JSON.stringify(METADATA.baseUrl),
        'RUN_DEMO': METADATA.runDemo
      }),

      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'head'
      }),

      new webpack.LoaderOptionsPlugin({
        options: {
          context: helpers.root(),
          output: {
              path: helpers.root('dist')
          }
        }
      })
    ],

    /*externals: [
      (function () {
        var IGNORES = [
          'electron', 'electron-debug'
        ];
        return function (context, request, callback) {
          if (IGNORES.indexOf(request) >= 0) {
            return callback(null, "require('" + request + "')");
          }
          return callback();
        };
      })()
    ]*/

  }, customConfig.config());
}
