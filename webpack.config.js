var ExtractTextPlugin = require('extract-text-webpack-plugin');


var env = process.env.NODE_ENV == 'prod' ? 'prod' : 'dev';


module.exports = {
  context: __dirname + "/web/static/js",

  entry: './app.js',

  output: {
    filename: 'app.js',
    path: __dirname + "/web/static/build"
  },

  resolve: {
      extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /(\.js$|\.jsx$)/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
    ]
  },

  sassLoader: {
    outputStyle: (env == 'prod' ? 'compressed' : 'expanded')
  },

  plugins: [
    new ExtractTextPlugin("app.css")
  ]
};