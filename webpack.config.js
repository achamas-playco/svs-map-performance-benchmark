const path = require('path');

console.clear();

module.exports = function (env, argv) {
  const environment = env && env.production ? 'production' : 'development';
  console.log('Building for ' + environment);
  return [
    {
      entry: path.resolve(__dirname, './src/index.tsx'),
      mode: environment,
      devtool: 'eval-source-map',
      module: {
        rules: [
          {
            test: /\.ts(x?)$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
      resolve: {
        extensions: ['.ts', '.tsx', '.js'],
      },
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
        libraryTarget: 'umd',
      },
      devServer: {
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        port: 3000,
      },
    },
  ];
};
