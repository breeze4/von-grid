const webpack = require("webpack");
const path = require('path');

const paths = function (baseDir) {
  return {
    src: path.join(baseDir, 'src'),
    build: path.join(baseDir, 'build')
  }
};

const PATHS = paths(__dirname);

const config = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: PATHS.src,
  output: {
    path: PATHS.build,
    filename: 'von-grid.js',
    library: 'vonGrid',
    libraryTarget: 'umd'
  },
  externals: ['three', 'three-orbit-controls']
};

module.exports = config;
