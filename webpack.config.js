module.exports = {
  context: __dirname + '/app',
  entry: './entry2',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'bundle.js'
  }
};