/* global wallaby */
import path from 'path';
import {expect} from 'chai';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';
import RtlCssPlugin from '../src';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const workingFolder = typeof wallaby !== 'undefined' ? path.join(wallaby.localProjectDir, 'test') : __dirname;
function fixture(fileName) {
  return path.join(workingFolder, 'fixtures', fileName);
}

const bundle = options =>
  new Promise((resolve, reject) => {
    const compiler = webpack({
      entry: fixture('index.js'),
      output: {
        filename: '[name].js'
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
      }

      if (stats.hasErrors()) {
        console.log(stats.toString());
        return reject(new Error(stats.toString()));
      }

      resolve(memoryFileSystem);
    });
  });

describe('RtlCss Webpack Plugin', () => {
  const bundlePath = path.join(process.cwd(), 'main.js');
  const cssBundlePath = path.join(process.cwd(), 'main.css');
  const rtlCssBundlePath = path.join(process.cwd(), 'main.rtl.css');

  it('should create a second bundle', async () => {
    const fs = await bundle();
    expect(fs.existsSync(bundlePath)).to.be.true;
    expect(fs.existsSync(cssBundlePath)).to.be.true;
    expect(fs.existsSync(rtlCssBundlePath)).to.be.true;
  });

  it('should contain the correct content', async () => {
    const fs = await bundle();
    const contentCss = fs.readFileSync(cssBundlePath, 'utf-8');
    const contentRrlCss = fs.readFileSync(rtlCssBundlePath, 'utf-8');

    expect(contentCss).to.contain('float: left');
    expect(contentRrlCss).to.contain('float: right');
  });

  it('should set filename according to options as object', async () => {
    const fs = await bundle({filename: 'foo.rtl.css'});
    const rtlCssBundlePath = path.join(process.cwd(), 'foo.rtl.css');
    const contentCss = fs.readFileSync(cssBundlePath, 'utf-8');
    const contentRrlCss = fs.readFileSync(rtlCssBundlePath, 'utf-8');

    expect(contentCss).to.contain('float: left');
    expect(contentRrlCss).to.contain('float: right');
  });

  it('should set filename according to options as string', async () => {
    const fs = await bundle('foo.rtl.css');
    const rtlCssBundlePath = path.join(process.cwd(), 'foo.rtl.css');
    const contentCss = fs.readFileSync(cssBundlePath, 'utf-8');
    const contentRrlCss = fs.readFileSync(rtlCssBundlePath, 'utf-8');

    expect(contentCss).to.contain('float: left');
    expect(contentRrlCss).to.contain('float: right');
  });

  it('should support hash', async () => {
    const fs = await bundle('foo.[hash].rtl.css');
    const rtlCssBundlePath = path.join(
      process.cwd(),
      fs
        .readdirSync(process.cwd())
        .filter(s => s.startsWith('foo'))
        .pop()
    );
    const contentCss = fs.readFileSync(cssBundlePath, 'utf-8');
    const contentRrlCss = fs.readFileSync(rtlCssBundlePath, 'utf-8');

    expect(contentCss).to.contain('float: left');
    expect(contentRrlCss).to.contain('float: right');
    expect(rtlCssBundlePath).not.to.equal('foo.[hash].rtl.css');
    expect(rtlCssBundlePath).to.match(/foo\..+\.rtl\.css/);
  });
});
