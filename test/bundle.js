/* global wallaby */
import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import RtlCssPlugin from '../src';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const workingFolder = typeof wallaby !== 'undefined' ? path.join(wallaby.localProjectDir, 'test') : __dirname;

export function fixture(fileName) {
  return path.join(workingFolder, 'fixtures', fileName);
}

export function bundle(options) {
  return new Promise((resolve, reject) => {
    const compiler = webpack({
      entry: fixture('index.js'),
      output: {
        filename: '[name].js'
      },
      resolveLoader: {
        modules: [path.resolve(workingFolder, '..', 'node_modules')]
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: 'css-loader'
            })
          }
        ]
      },
      plugins: [new ExtractTextPlugin('[name].css'), new RtlCssPlugin(options)]
    });

    const memoryFileSystem = new MemoryFS();
    compiler.outputFileSystem = memoryFileSystem;
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      } else if (stats.hasErrors()) {
        return reject(new Error(stats.toString()));
      } else {
        resolve(memoryFileSystem);
      }
    });
  });
}

export function filePath(name) {
  return path.join(process.cwd(), name);
}
