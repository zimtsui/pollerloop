import Bluebird from 'bluebird';
import test from 'ava';
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const { assert } = chai;
import Pollerloop from '../..';
import { Polling } from '../..';


test.beforeEach((t: any) => {
    t.context.tik = (() => {
        let time: any;
        return () => {
            if (time) {
                const lastTime = time;
                time = Date.now();
                return time - lastTime;
            } else {
                time = Date.now();
                return 0;
            }
        };
    })();
});

test('test 1', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await pollerloop.start(cb);
    assert.isUndefined(cb.args[0][0]);
});

test('test exception', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);

            if (i === 2) {
                const err = new Error('haha');
                stopping(err);
                throw err;
            }

            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await assert.isRejected(pollerloop.start(cb), { message: 'haha' });
    assert.strictEqual(cb.args[0][0].message, 'haha');
});

test('test manual stop', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    Bluebird.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.stop();
    });
    await pollerloop.start(cb);
    assert.isUndefined(cb.args[0][0]);
});

test('test 2', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(300);
            await timer1;
            if (!isRunning()) break;

            t.log(tik());
            const timer2 = delay(700);
            await timer2;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await pollerloop.start(cb);
    assert.isUndefined(cb.args[0][0]);
});

test('test 3', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(800);

            t.log(tik());
            const timer2 = delay(300);
            await timer2;
            if (!isRunning()) break;

            t.log(tik());
            const timer3 = delay(700);
            await timer3;
            if (!isRunning()) break;

            t.log(tik());
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await pollerloop.start(cb);
    assert.isUndefined(cb.args[0][0]);
});

test('test 4', async t => {
    const { tik } = <any>t.context;
    const polling: Polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(1000);

            t.log(tik());
            const timer2 = delay(300);
            await timer2;
            if (!isRunning()) break;

            t.log(tik());
            const timer3 = delay(200);
            await timer3;
            if (!isRunning()) break;

            t.log(tik());
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await pollerloop.start(cb);
    assert.isUndefined(cb.args[0][0]);
});
