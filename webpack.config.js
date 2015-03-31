var bourbon = require('node-bourbon').includePaths;

module.exports = {
  entry: './src/client/assets/coffee/main.coffee',
  output: {
    path: __dirname + '/public/javascripts/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: 'coffee-loader'},
      { test: /\.js$/, loader: 'jsx-loader?harmony'},
      { test: /\.scss$/, loader: "style!css!sass?includePaths[]=" + bourbon }
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.coffee', '.scss']
  }
}
