import BPromise from 'bluebird';
import test from 'ava';
import sinon from 'sinon';
import assert from 'assert';
import Pollerloop from '../..';

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

test('test 1', async (t: any) => {
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    assert(await pollerloop.start(cb));
    assert(cb.args[0].length === 0);
});

test('test exception', async (t: any) => {
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
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    await assert.rejects(pollerloop.start(cb), { message: 'haha' });
    assert(cb.args[0][0].message === 'haha');
});

test('test manual stop', async (t: any) => {
    const { tik } = t.context;
    const polling = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    const loop = pollerloop.start(cb);
    BPromise.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.stop();
    });
    assert(!await loop);
    assert(cb.args[0].length === 0);
});

test('test 2', async (t: any) => {
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
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    assert(await pollerloop.start(cb));
});

test('test 3', async (t: any) => {
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
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    assert(await pollerloop.start(cb));
});

test('test 4', async (t: any) => {
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
        return isRunning();
    };
    const cb = sinon.fake();
    const pollerloop = new Pollerloop(polling);
    assert(await pollerloop.start(cb));
});
