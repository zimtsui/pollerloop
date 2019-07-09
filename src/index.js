import delay from 'interruptible-timer';

const constructor = (polling) => {
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
                });
                destructors.add(timer.stop);
                return timer.timeout;
            },
        );
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

export default {
    constructor,
};
