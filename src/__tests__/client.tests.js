import TwitchJS from '../';
import events from './__fixtures__/events.json';

const client = new TwitchJS.Client({
  options: { clientId: 'CLIENT_ID' },
});

describe('client', () => {
  describe('events', () => {
    events.forEach(e => {
      const { name, data, expected } = e;

      test(`should emit ${name}`, done => {
        client.on(name, (...args) => {
          expect(args).toMatchSnapshot();
          done();
        });

        client._onMessage({ data });
      });
    });
  });
});
