const baseWebpackConfig = require('./webpack.base.conf');

const conf = baseWebpackConfig;
conf.mode = 'production';

module.exports = baseWebpackConfig;
