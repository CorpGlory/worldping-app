const baseWebpackConfig = require('./webpack.base.conf');

const conf = baseWebpackConfig;
conf.mode = 'development';
conf.watch = true;
conf.watchOptions = {
  poll: 1000,
  ignored: ['node_modules']
};

module.exports = baseWebpackConfig;
