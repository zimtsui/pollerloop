import Promise from 'bluebird';
import test from 'ava';
import sinon from 'sinon';
import assert from 'assert';
import Pollerloop from '~/dist/index';

test.beforeEach((t) => {
    t.context.tik = (() => {
        let time;
        return () => {
            if (time) {
                const lastTime = time;
                time = Date.now();
                return time - lastTime;
            }
            time = Date.now();
            return 0;
        };
    })();
});

test('test 1', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = Pollerloop(polling);
    await pollerloop.start(cb);
    assert(cb.args[0].length === 0);
});

test('test exception', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
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
    const pollerloop = Pollerloop(polling);
    await assert.rejects(pollerloop.start(cb), { message: 'haha' });
    assert(cb.args[0][0].message === 'haha');
});

test('test manual stop', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 100 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = sinon.fake();
    const pollerloop = Pollerloop(polling);
    const loop = pollerloop.start(cb);
    Promise.delay(1500).then(() => pollerloop.stop());
    await loop;
    assert(cb.args[0].length === 0);
});

test('test 2', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
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
    const pollerloop = Pollerloop(polling);
    return pollerloop.start(cb);
});

test('test 3', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
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
    const pollerloop = Pollerloop(polling);
    return pollerloop.start(cb);
});

test('test 4', async (t) => {
    global.logger = t;
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
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
    const pollerloop = Pollerloop(polling);
    return pollerloop.start(cb);
});
