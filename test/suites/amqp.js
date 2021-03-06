const assert = require('assert');
const AMQPTransport = require('@microfleet/transport-amqp');
const { inspectPromise } = require('@makeomatic/deploy');

describe('AMQP suite', function testSuite() {
  const Mservice = require('../../src');

  it('when service does not include `amqp` plugin, it emits an error or throws', function test() {
    const service = new Mservice({ plugins: [] });
    assert.throws(() => service.amqp);
  });

  it('able to connect to amqp when plugin is included', function test() {
    this.service = new Mservice({
      plugins: ['validator', 'opentracing', 'amqp'],
      amqp: global.SERVICES.amqp,
    });
    return this.service.connect()
      .reflect()
      .then(inspectPromise())
      .spread((amqp) => {
        assert.ok(amqp instanceof AMQPTransport);
        assert.doesNotThrow(() => this.service.amqp);
      });
  });

  it('able to close connection to amqp', function test() {
    return this.service.close()
      .reflect()
      .then((result) => {
        assert.ok(result.isFulfilled());
        assert.throws(() => this.service.amqp);
      });
  });
});
