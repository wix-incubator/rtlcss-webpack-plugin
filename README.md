# RtlCss Webpack Plugin [![Build Status](https://img.shields.io/travis/wix/rtlcss-webpack-plugin/master.svg?style=flat-square)](https://travis-ci.org/wix/rtlcss-webpack-plugin) [![npm version](https://img.shields.io/npm/v/rtlcss-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/rtlcss-webpack-plugin) [![npm downloads](https://img.shields.io/npm/dm/rtlcss-webpack-plugin.svg?style=flat-square)](https://www.npmjs.com/package/rtlcss-webpack-plugin)

Webpack plugin to use in addition to [extract-text-webpack-plugin](https://github.com/webpack/extract-text-webpack-plugin) to create a second css bundle, processed to be rtl.

This uses [rtlcss](https://github.com/MohammadYounes/rtlcss) under the hood, please refer to its documentation for supported properties.

This is almost entirely based on work done in [webpack-rtl-plugin](https://github.com/romainberger/webpack-rtl-plugin)

## Installation

```shell
$ npm install rtlcss-webpack-plugin
```

## Usage

Add the plugin to your webpack configuration:

```js
import RtlCssPlugin from 'rtlcss-webpack-plugin';

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
      }
    ]
  },
  plugins: [new ExtractTextPlugin('style.css'), new RtlCssPlugin('style.rtl.css')]
};
```

This will create the normal `style.css` and an additional `style.rtl.css`.

## Options

```
new RtlCssPlugin('[name].rtl.css');
```

```
new RtlCssPlugin({filename: '[name].rtl.css'});
```

* `filename` Name of the result file. May contain [name], [id] and [hash]
