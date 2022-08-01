"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const __1 = require("../..");
const cancellable_1 = require("cancellable");
const ava_1 = require("ava");
const Bluebird = require("bluebird");
const node_time_engine_1 = require("node-time-engine");
const assert = require("assert");
const engine = new node_time_engine_1.NodeTimeEngine();
const { fake } = sinon;
class CustomError extends Error {
    constructor() {
        super('');
    }
}
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
    pollerloop.$s.start([], err => {
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
                throw new CustomError();
            }
            await timer1;
        }
    };
    const cb = fake();
    const pollerloop = new __1.Pollerloop(loop, engine);
    pollerloop.$s.start([], err => {
        cb(err);
    }).catch(() => { });
    await assert.rejects(pollerloop.getLoopPromise(), CustomError);
    assert(cb.args[0][0] instanceof CustomError);
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
        pollerloop.$s.stop();
    });
    pollerloop.$s.start([], err => {
        cb(err);
    }).catch(() => { });
    await assert.rejects(pollerloop.getLoopPromise(), cancellable_1.Cancelled);
    t.log(tik());
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start([], err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start([], err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
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
    pollerloop.$s.start([], err => {
        cb(err);
    }).catch(() => { });
    await pollerloop.getLoopPromise();
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
});
//# sourceMappingURL=test.js.map