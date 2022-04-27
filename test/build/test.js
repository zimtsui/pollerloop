"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const __1 = require("../..");
const ava_1 = require("ava");
const Bluebird = require("bluebird");
const timeout_1 = require("timeout");
chai.use(chaiAsPromised);
const { assert } = chai;
const { fake } = sinon;
const engine = new timeout_1.TimeEngine();
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
(0, ava_1.default)('test 1', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(1000);
            await timer1;
        }
    };
    const cb = fake();
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert(cb.args[0][0] === undefined);
});
(0, ava_1.default)('test exception', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
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
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await assert.isRejected(pollerloop.getLoopPromise(), { message: 'haha' });
    assert(cb.args[0][0].message === 'haha');
});
(0, ava_1.default)('test manual stop', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
        for (let i = 1; i <= 3; i += 1) {
            t.log(tik());
            const timer1 = sleep(1000);
            await timer1;
        }
    };
    const cb = sinon.fake();
    const pollerloop = new __1.Pollerloop(loop, engine);
    Bluebird.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.startable.stop();
    });
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await assert.isRejected(pollerloop.getLoopPromise(), new __1.Cancelled().message);
    t.log(tik());
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
(0, ava_1.default)('test 2', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
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
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
(0, ava_1.default)('test 3', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
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
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
(0, ava_1.default)('test 4', async (t) => {
    const tik = createTik();
    const loop = async (sleep) => {
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
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.startable.start(err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert.isUndefined(cb.args[0][0]);
});
//# sourceMappingURL=test.js.map