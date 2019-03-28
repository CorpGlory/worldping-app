const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractTextPluginLight = new ExtractTextPlugin('./css/worldping.light.css');
const ExtractTextPluginDark = new ExtractTextPlugin('./css/worldping.dark.css');

const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  target: 'node',
  context: resolve('src'),
  devtool: 'inline-source-map',
  entry: {
    './module': ['./module.js', './sass/worldping.dark.scss', './sass/worldping.light.scss'],

    'components/config/config': './components/config/config.js',

    'components/endpoint/endpoint_config': './components/endpoint/endpoint_config.js',
    'components/endpoint/endpoint_details': './components/endpoint/endpoint_details.js',
    'components/endpoint/endpoint_list': './components/endpoint/endpoint_list.js',

    'components/probe/probe_create': './components/probe/probe_create.js',
    'components/probe/probe_details': './components/probe/probe_details.js',
    'components/probe/probe_list': './components/probe/probe_list.js',

    'directives/all': './directives/all.js',

    'filters/all': './filters/all.js',

    'panels/call-to-action/module': './panels/call-to-action/module.js',
    'panels/endpoint-list/module': './panels/endpoint-list/module.js',
    'panels/nav-panel/module': './panels/nav-panel/module.js',
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    libraryTarget: 'amd'
  },
  externals: [
    // remove the line below if you don't want to use buildin versions
    'jquery', 'lodash', 'moment', 'angular',
    function(context, request, callback) {
      var prefix = 'grafana/';
      if (request.indexOf(prefix) === 0) {
        return callback(null, request.substr(prefix.length));
      }
      callback();
    }
  ],
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CopyWebpackPlugin([
      { from: '../README.md' },
      { from: '**/plugin.json' },
      { from: 'panels/**/*.html' },

      { from: 'img/*' },
      { from: 'dashboards/*' },
      { from: 'fonts/**' },

      { from: 'components/endpoint/partials/*' },
      { from: 'components/probe/partials/*' },

      { from: 'directives/partials/*' },
    ]),
    new CleanWebpackPlugin(['dist'], {
      root: resolve('.')
    }),
    new ngAnnotatePlugin(),
    ExtractTextPluginLight,
    ExtractTextPluginDark
  ],
  resolve: {
    extensions: ['.js', '.html', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            presets: [require.resolve('babel-preset-es2015')],
            plugins: [
              require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
              require.resolve('babel-plugin-transform-es2015-for-of')
            ],
          }
        }
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: 'raw-loader'
        },
      },
      {
        test: /\.(png|svg)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            publicPath: 'public/plugins/raintank-worldping-app'
          },
        },
      },
      {
        test: /\.light\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPluginLight.extract({
          use: [
            'css-loader',
            'resolve-url-loader',
            'sass-loader'
          ]
        })
      },
      {
        test: /\.dark\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPluginDark.extract({
          use: [
            'css-loader',
            'resolve-url-loader',
            'sass-loader'
          ]
        })
      }
    ]
  }
}
