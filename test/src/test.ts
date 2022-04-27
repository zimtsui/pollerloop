import sinon = require('sinon');
import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import {
    Pollerloop,
    Loop,
    Cancelled,
} from '../..';
import test from 'ava';
import Bluebird = require('bluebird');
import { TimeEngine } from 'timeout';

chai.use(chaiAsPromised);
const { assert } = chai;
const { fake } = sinon;
const engine = new TimeEngine();


const createTik = () => {
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
};


// test 1
test('test 1', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(1000);
            await timer1;
        }
    };
    const cb = fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert(cb.args[0][0] === undefined);
});



test('test exception', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(1000).catch(() => { });

            if (i === 2) {
                throw new Error('haha');
            }

            await timer1;
        }
    };
    const cb = fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await assert.isRejected(pollerloop.getLoopPromise(), { message: 'haha' });
    assert(cb.args[0][0].message === 'haha');
});



test('test manual stop', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(1000);
            await timer1;
        }
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(loop, engine);
    Bluebird.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.startable.stop();
    });
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await assert.isRejected(pollerloop.getLoopPromise(), new Cancelled().message);
    t.log(tik());
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});

test('test 2', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(300);
            await timer1;

            t.log(tik());
            const timer2 = sleep(700);
            await timer2;
        }
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});

test('test 3', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            const timer1 = sleep(800).catch(() => { });

            t.log(tik());
            const timer2 = sleep(300);
            await timer2;

            t.log(tik());
            const timer3 = sleep(700);
            await timer3;

            t.log(tik());
            await timer1;
        }
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});

test('test 4', async t => {
    const tik = createTik();
    const loop: Loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            const timer1 = sleep(1000).catch(() => { });

            t.log(tik());
            const timer2 = sleep(300);
            await timer2;

            t.log(tik());
            const timer3 = sleep(200);
            await timer3;

            t.log(tik());
            await timer1;
        }
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
