import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Pollerloop } from '../../dist/index';
import test from 'ava';
import Bluebird from 'bluebird';
chai.use(chaiAsPromised);
const { assert } = chai;
const { fake } = sinon;
const createTik = () => {
    let time;
    return () => {
        if (time) {
            const lastTime = time;
            time = Date.now();
            return time - lastTime;
        }
        else {
            time = Date.now();
            return 0;
        }
    };
};
// test 1
test('test 1', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stop();
    };
    const cb = fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    await pollerloop.start(cb);
    await pollerloop.polling;
    assert(cb.callCount === 1);
    assert(cb.args[0][0] === undefined);
});
test('test exception', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            if (i === 2) {
                const err = new Error('haha');
                stop(err);
                throw err;
            }
            await timer1;
        }
        stop();
    };
    const cb = fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    await pollerloop.start(cb);
    await assert.isRejected(pollerloop.polling, { message: 'haha' });
    assert(cb.args[0][0].message === 'haha');
});
test('test manual stop', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stop();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    Bluebird.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.stop();
    });
    await pollerloop.start(cb);
    await pollerloop.polling;
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
test('test 2', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            t.log(tik());
            const timer1 = delay(300);
            await timer1;
            if (!shouldBeRunning)
                break;
            t.log(tik());
            const timer2 = delay(700);
            await timer2;
        }
        stop();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    await pollerloop.start(cb);
    await pollerloop.polling;
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
test('test 3', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            const timer1 = delay(800);
            t.log(tik());
            const timer2 = delay(300);
            await timer2;
            if (!shouldBeRunning)
                break;
            t.log(tik());
            const timer3 = delay(700);
            await timer3;
            if (!shouldBeRunning)
                break;
            t.log(tik());
            await timer1;
        }
        stop();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    await pollerloop.start(cb);
    await pollerloop.polling;
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
test('test 4', async (t) => {
    const tik = createTik();
    const poll = async (stop, shouldBeRunning, delay) => {
        for (let i = 1; i <= 3 && shouldBeRunning; i += 1) {
            const timer1 = delay(1000);
            t.log(tik());
            const timer2 = delay(300);
            await timer2;
            if (!shouldBeRunning)
                break;
            t.log(tik());
            const timer3 = delay(200);
            await timer3;
            if (!shouldBeRunning)
                break;
            t.log(tik());
            await timer1;
        }
        stop();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(poll, setTimeout, clearTimeout);
    await pollerloop.start(cb);
    await pollerloop.polling;
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
//# sourceMappingURL=test.js.map