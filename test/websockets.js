const WebSocketServer = require('ws').Server;
const tmi = require('../src/index.js');

describe('websockets', () => {
  before(function() {
    // Initialize websocket server
    this.server = new WebSocketServer({ port: 7000 });
    this.client = new tmi.client({
      connection: {
        server: 'localhost',
        port: 7000,
      },
    });
  });

  it('should handle join & part commands', function(cb) {
    const client = this.client;
    const server = this.server;

    server.on('connection', ws => {
      ws.on('message', message => {
        // Ensure that the message starts with USER
        if (message.indexOf('USER')) {
          return;
        }
        const user = client.getUsername();
        ws.send(`:${user}! JOIN #local7000`);
        ws.send(`:${user}! PART #local7000`);
      });
    });

    client.on('join', () => {
      client.channels.should.eql(['#local7000']);
    });

    client.on('part', () => {
      client.channels.should.eql([]);
      client.disconnect();
      cb();
    });

    client.connect();
  });

  after(function() {
    // Shut down websocket server
    this.server.close();
  });
});

describe('server crashed, with reconnect: false (default)', () => {
  before(function() {
    // Initialize websocket server
    this.server = new WebSocketServer({ port: 7000 });
    this.client = new tmi.client({
      connection: {
        server: 'localhost',
        port: 7000,
      },
    });
  });

  it('should gracefully handle the error', function(cb) {
    this.timeout(15000);
    const client = this.client;
    const server = this.server;

    server.on('connection', () => {
      // Uh-oh, the server dies
      server.close();
    });

    client.on('disconnected', () => {
      'Test that we reached this point'.should.be.ok();
      cb();
    });

    client.connect();
  });
});

describe('server crashed, with reconnect: true', () => {
  before(function() {
    // Initialize websocket server
    this.server = new WebSocketServer({ port: 7000 });
    this.client = new tmi.client({
      connection: {
        server: 'localhost',
        port: 7000,
        reconnect: true,
      },
    });
  });

  it('should attempt to reconnect', function(cb) {
    this.timeout(15000);
    const client = this.client;
    const server = this.server;

    server.on('connection', () => {
      // Uh-oh, the server dies
      server.close();
    });

    client.on('disconnected', () => {
      setTimeout(() => {
        'Test that we reached this point'.should.be.ok();
        cb();
      }, client.reconnectTimer);
    });

    client.connect();
  });
});
