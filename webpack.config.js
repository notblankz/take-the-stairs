import path from 'path';

export default {
  entry: './public/js/qrScanner.js', // Entry point of your application
  output: {
    path: path.resolve('./public/js'), // Output directory (same as the src directory)
    filename: 'qrScanner.min.js', // Output bundle file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Process .js files
        exclude: /node_modules/, // Exclude node_modules from processing
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'], // Use Babel to transpile ES6+ to ES5
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'], // Resolve .js files
  },
  mode: 'development', // Set mode to development for easier debugging
};
