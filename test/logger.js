const hookStd = require('hook-std');
const tmi = require('../src/index.js');
const log = require('../src/logger.js');
const _ = require('../src/utils.js');

describe('client()', () => {
  it('should default to the stock logger', () => {
    const client = new tmi.client();

    client.log.should.be.ok();
  });

  it('should allow a custom logger', () => {
    const client = new tmi.client({
      logger: console,
    });

    client.log.should.be.exactly(console);
  });
});

describe('log()', () => {
  it('should log to the console', () => {
    let out = '';

    const unhook = hookStd.stdout({ silent: true }, output => {
      out += output;
    });

    log.setLevel('info');
    log.info('foobar');

    unhook();

    const expected = out.trim();
    expected.should.containEql('info: foobar');
  });
});

describe('_.formatDate()', () => {
  it('should format 8am', () => {
    _.formatDate(new Date('2015-01-01 8:00')).should.eql('08:00');
  });

  it('should format 8pm', () => {
    _.formatDate(new Date('2015-01-01 20:00')).should.eql('20:00');
  });

  it('should format 8.30pm', () => {
    _.formatDate(new Date('2015-01-01 20:30')).should.eql('20:30');
  });
});
