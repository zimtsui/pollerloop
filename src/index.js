import delay from 'interruptible-timer';

const isTest = () => process.env.NODE_ENV == 'test';

const Pollerloop = (polling) => {
    const publ = {};
    const destructors = new Set();
    let running;
    let stopped;

    publ.start = () => {
        running = true;
        stopped = polling(
            () => running,
            (ms) => {
                const timer = delay(ms, () => {
                    destructors.delete(timer.stop);
                    isTest() && console.log('destructors size:', destructors.size);
                });
                destructors.add(timer.stop);
                isTest() && console.log('destructors size:', destructors.size);
                return timer.timeout;
            },
        );
        if (isTest()) {
            return stopped.then(() => {
                console.log('destructors size:', destructors.size);
            });
        }
        return stopped;
    };

    publ.stop = () => {
        running = false;
        destructors.forEach(destructor => destructor());
        return stopped;
    };

    publ.destructor = () => {
        if (running) return publ.stop();
        return undefined;
    };

    return publ;
};

export default Pollerloop;
