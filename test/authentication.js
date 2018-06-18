const WebSocketServer = require('ws').Server;
const tmi = require('../src/index.js');

const noop = function() {};

const tests = [
  ':tmi.twitch.tv NOTICE #schmoopiie :Login unsuccessful.',
  ':tmi.twitch.tv NOTICE #schmoopiie :Error logging in.',
  ':tmi.twitch.tv NOTICE #schmoopiie :Invalid NICK.',
];

describe('handling authentication', () => {
  beforeEach(function() {
    // Initialize websocket server
    this.server = new WebSocketServer({ port: 7000 });
    this.client = new tmi.client({
      logger: {
        error: noop,
        info: noop,
      },
      connection: {
        server: 'localhost',
        port: 7000,
        timeout: 1,
      },
    });
  });

  afterEach(function() {
    // Shut down websocket server
    this.server.close();
    this.client = null;
  });

  tests.forEach(test => {
    it(`should handle ${test}`, function(cb) {
      const client = this.client;
      const server = this.server;

      const parts = test.split(':');
      const message = parts[parts.length - 1].trim();

      server.on('connection', ws => {
        ws.on('message', msg => {
          if (!msg.indexOf('USER')) {
            ws.send(test);
          }
        });
      });

      client.on('disconnected', reason => {
        reason.should.eql(message);
        cb();
      });

      client.connect();
    });
  });
});
