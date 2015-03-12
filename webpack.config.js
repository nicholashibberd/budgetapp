var webpack = require('webpack');
module.exports = {
  entry: './src/client/assets/coffee/main.coffee',
  output: {
    path: __dirname + '/public/javascripts/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader'},
      { test: /\.js$/, loader: 'jsx-loader?harmony'}
    ]
  },
  resolve: {
    extensions: ['', '.js', '.coffee']
  }
}
