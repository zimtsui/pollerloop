import sinon = require('sinon');
import {
    Pollerloop,
    Loop,
} from '../..';
import { Cancelled } from 'time-engine-like';
import test from 'ava';
import Bluebird = require('bluebird');
import { NodeTimeEngine } from 'node-time-engine';
import assert = require('assert');

const engine = new NodeTimeEngine();
const { fake } = sinon;


class CustomError extends Error {
    public constructor() {
        super('');
    }
}

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
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.$s;
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
                throw new CustomError();
            }

            await timer1;
        }
    };
    const cb = fake();
    const pollerloop = new Pollerloop(loop, engine);
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await assert.rejects(pollerloop.$s, CustomError);
    assert(cb.args[0][0] instanceof CustomError);
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
        pollerloop.$s.stop();
    });
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.$s;
    t.log(tik());
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.$s;
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.$s;
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.$s;
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
});
