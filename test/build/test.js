"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sinon = require("sinon");
const __1 = require("../..");
const ava_1 = require("ava");
const Bluebird = require("bluebird");
const node_time_engine_1 = require("@zimtsui/node-time-engine");
const assert = require("assert");
const startable_1 = require("@zimtsui/startable");
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    await (0, startable_1.$)(pollerloop).getRunning();
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    await assert.rejects(Promise.resolve((0, startable_1.$)(pollerloop).getRunning()), CustomError);
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    Bluebird.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        (0, startable_1.$)(pollerloop).stop();
    });
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    t.log(tik());
    await (0, startable_1.$)(pollerloop).getRunning();
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    await (0, startable_1.$)(pollerloop).getRunning();
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    await (0, startable_1.$)(pollerloop).getRunning();
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
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
    const pollerloop = new __1.Pollerloop(loop, node_time_engine_1.nodeTimeEngine);
    await (0, startable_1.$)(pollerloop).start(err => {
        cb(err);
    }).then(() => { }, () => { });
    await (0, startable_1.$)(pollerloop).getRunning();
    await (0, startable_1.$)(pollerloop).stop().catch(() => { });
    assert(cb.callCount === 1);
    assert(typeof cb.args[0][0] === 'undefined');
});
//# sourceMappingURL=test.js.map