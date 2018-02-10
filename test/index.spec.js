import {expect} from 'chai';
import {bundle, filePath} from './bundle';

describe('RtlCss Webpack Plugin', () => {
  const bundlePath = filePath('main.js');
  const cssBundlePath = filePath('main.css');
  const rtlCssBundlePath = filePath('main.rtl.css');

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
    const rtlCssBundlePath = filePath('foo.rtl.css');
    expect(fs.existsSync(rtlCssBundlePath)).to.be.true;
  });

  it('should set filename according to options as string', async () => {
    const fs = await bundle('foo.rtl.css');
    const rtlCssBundlePath = filePath('foo.rtl.css');
    expect(fs.existsSync(rtlCssBundlePath)).to.be.true;
  });

  it('should support hash', async () => {
    const fs = await bundle('foo.[hash].rtl.css');
    const hashedFileName = fs
      .readdirSync(process.cwd())
      .filter(s => s.startsWith('foo'))
      .pop();
    const rtlCssBundlePath = filePath(hashedFileName);
    expect(rtlCssBundlePath).not.to.equal('foo.[hash].rtl.css');
    expect(rtlCssBundlePath).to.match(/foo\..+\.rtl\.css/);
  });
});
