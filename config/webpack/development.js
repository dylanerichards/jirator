process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const environment = require('./environment')
const webpack = require('webpack')

environment.plugins.append(
  'LiveReload',
  new webpack.HotModuleReplacementPlugin()
)

module.exports = environment.toWebpackConfig() 