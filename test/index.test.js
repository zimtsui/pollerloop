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
    const poller = async (isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(1000);
            await timer1;
        }
    };
    const pollerloop = Pollerloop.constructor(poller);
    await pollerloop.start();
});

test('test 2', async () => {
    console.log('++++++++++++ test 2 +++++++++++++');
    const poller = async (isRunning, delay) => {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            console.log(tik());
            const timer1 = delay(300);
            await timer1;

            console.log(tik());
            const timer2 = delay(700);
            await timer2;
        }
    };
    const pollerloop = Pollerloop.constructor(poller);
    await pollerloop.start();
});

test('test 3', async () => {
    console.log('++++++++++++ test 3 +++++++++++++');
    const poller = async (isRunning, delay) => {
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
    };
    const pollerloop = Pollerloop.constructor(poller);
    await pollerloop.start();
});

test('test 4', async () => {
    console.log('++++++++++++ test 4 +++++++++++++');
    const poller = async (isRunning, delay) => {
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
    };
    const pollerloop = Pollerloop.constructor(poller);
    await pollerloop.start();
});
