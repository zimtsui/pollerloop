import Promise from 'bluebird';
import Pollerloop from '~/src/index';

let tik;

beforeEach(() => {
    tik = (() => {
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

test('test 1', async () => {
    console.log('++++++++++++ test 1 +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = jest.fn();
    const pollerloop = Pollerloop(poller);
    await expect(pollerloop.start(cb)).resolves.toBe();
    expect(cb.mock.calls[0].length).toBe(0);
});

test.only('test exception', async () => {
    console.log('++++++++++++ test exception +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(1000);

            if (i == 2) {
                const err = new Error('haha');
                stopping(err);
                throw err;
            }

            await timer1;
        }
        stopping();
    };
    const cb = jest.fn();
    const pollerloop = Pollerloop(poller);
    await expect(pollerloop.start(cb)).rejects.toThrow('haha');
    // await expect(Promise.reject(cb.mock.calls[0][0])).rejects.toThrow('haha');
    await expect(Promise.reject(new Error('haha'))).rejects.toThrow('haha');
    // console.log(cb.mock.calls[0][0]);
});

test('test manual stop', async () => {
    console.log('++++++++++++ test manual stop +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 100 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
        stopping();
    };
    const cb = jest.fn();
    const pollerloop = Pollerloop(poller);
    const loop = pollerloop.start(cb);
    Promise.delay(1500).then(() => pollerloop.stop());
    await expect(loop).resolves.toBe();
    expect(cb.mock.calls[0].length).toBe(0);
});

test('test 2', async () => {
    console.log('++++++++++++ test 2 +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(300);
            await timer1;

            console.log(tik());
            const timer2 = delay(700);
            await timer2;
        }
        stopping();
    };
    const pollerloop = Pollerloop(poller);
    return pollerloop.start();
});

test('test 3', async () => {
    console.log('++++++++++++ test 3 +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(800);

            console.log(tik());
            const timer2 = delay(300);
            await timer2;

            console.log(tik());
            const timer3 = delay(700);
            await timer3;

            console.log(tik());
            await timer1;
        }
        stopping();
    };
    const pollerloop = Pollerloop(poller);
    return pollerloop.start();
});

test('test 4', async () => {
    console.log('++++++++++++ test 4 +++++++++++++');
    const poller = async (stopping, isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(1000);

            console.log(tik());
            const timer2 = delay(300);
            await timer2;

            console.log(tik());
            const timer3 = delay(200);
            await timer3;

            console.log(tik());
            await timer1;
        }
        stopping();
    };
    const pollerloop = Pollerloop(poller);
    return pollerloop.start();
});
