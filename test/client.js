const tmi = require('../src/index.js');

describe('client()', () => {
  it('should return a new instance of itself', () => {
    const client = tmi.client();
    client.should.be.an.instanceOf(tmi.client);
  });

  it("should use the 'info' log when debug is set", () => {
    const client = new tmi.client({ options: { debug: true } });
    client.should.be.ok();
  });

  it('should normalize channel names', () => {
    const client = new tmi.client({ channels: ['avalonstar', '#dayvemsee'] });
    client.opts.channels.should.eql(['#avalonstar', '#dayvemsee']);
  });

  it('should warn when random is specified (deprecated)', () => {
    const logger = {
      setLevel() {},
      warn(message) {
        message.should.be.ok();
      },
    };
    tmi.client({
      logger,
      connection: { random: 'main' },
    });
  });
});

describe('client getters', () => {
  it('should get options', () => {
    const opts = { options: { debug: true } };
    const client = new tmi.client(opts);
    client.getOptions().should.eql(opts);
  });

  it('should get channels', () => {
    const client = new tmi.client();
    client.getChannels().should.eql([]);
  });
});
