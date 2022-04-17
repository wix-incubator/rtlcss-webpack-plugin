import { expect } from 'chai';
import { LoaderOptionsPlugin } from 'webpack';
import { bundle, filePath, fixture } from './bundle';
import { join } from 'path';

describe('RtlCss Webpack Plugin', () => {
  it('should contain the correct content', async () => {
    const fs = await bundle();
    expect(fs.readFileSync(filePath('bundle.css'), 'utf-8')).to.equal(
      '.a {\n  float: left;\n}\n\n',
    );
    expect(fs.readFileSync(filePath('bundle.rtl.css'), 'utf-8')).to.equal(
      '.a {\n  float: right;\n}\n\n',
    );
  });

  it('should create bundle per chunk', async () => {
    const addChunk = (x) => ({
      ...x,
      entry: { ...x.entry, bundle2: fixture('index2.js') },
    });
    const fs = await bundle(undefined, addChunk);
    expect(fs.readFileSync(filePath('bundle.rtl.css'), 'utf-8')).to.equal(
      '.a {\n  float: right;\n}\n\n',
    );
    expect(fs.readFileSync(filePath('bundle2.rtl.css'), 'utf-8')).to.equal(
      '.b {\n  float: right;\n}\n\n',
    );
  });

  it('should contain the correct content when minimized', async () => {
    const minimize = (x) => ({
      ...x,
      plugins: x.plugins.concat(new LoaderOptionsPlugin({ minimize: true })),
    });
    const fs = await bundle(undefined, minimize);
    expect(fs.readFileSync(filePath('bundle.css'), 'utf-8')).to.equal(
      '.a {\n  float: left;\n}\n\n',
    );
    expect(fs.readFileSync(filePath('bundle.rtl.css'), 'utf-8')).to.equal(
      '.a {\n  float: right;\n}\n\n',
    );
  });

  it('should set filename according to options as object', async () => {
    const fs = await bundle({ filename: 'foo.rtl.css' });
    // eslint-disable-next-line no-unused-expressions
    expect(fs.existsSync(filePath('foo.rtl.css'))).to.be.true;
  });

  it('should set filename according to options as string', async () => {
    const fs = await bundle('foo.rtl.css');
    // eslint-disable-next-line no-unused-expressions
    expect(fs.existsSync(filePath('foo.rtl.css'))).to.be.true;
  });

  it('should support [hash]', async () => {
    const fs = await bundle('foo.[hash].rtl.css');
    const hashedFileName = fs
      .readdirSync(join(process.cwd(), 'dist'))
      .find((s) => s.startsWith('foo'));
    expect(hashedFileName).not.to.equal('foo.[hash].rtl.css');
    expect(hashedFileName).to.match(/foo\.\w+\.rtl\.css/);
  });

  it('should support [name]', async () => {
    const addChunk = (x) => ({
      ...x,
      entry: { ...x.entry, bundle2: fixture('index2.js') },
    });
    const fs = await bundle('[name]-rtl.css', addChunk);
    expect(fs.readFileSync(filePath('bundle-rtl.css'), 'utf-8')).to.equal(
      '.a {\n  float: right;\n}\n\n',
    );
    expect(fs.readFileSync(filePath('bundle2-rtl.css'), 'utf-8')).to.equal(
      '.b {\n  float: right;\n}\n\n',
    );
  });
});
