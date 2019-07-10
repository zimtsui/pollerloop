import delay from 'interruptible-timer';

// const isTest = () => process.env.NODE_ENV === 'test' && global.logger;

/*
三种情况

- 自动结束
- 手动结束
- 异常结束
*/

const Pollerloop = (polling) => {
    const publ = {};
    const destructors = new Set();
    let running;
    let stopped;
    let stopping;

    publ.start = (newStopping) => {
        stopping = newStopping;
        running = true;
        stopped = polling(
            (err) => {
                destructors.forEach(destructor => destructor());
                if (err) stopping(err); else stopping();
            },
            () => running,
            (ms) => {
                const timer = delay(ms, () => {
                    destructors.delete(timer.stop);
                });
                destructors.add(timer.stop);
                return timer.timeout.catch(() => {});
            },
        );

        return stopped;
    };

    publ.stop = () => {
        running = false;
        destructors.forEach(destructor => destructor());
        return stopped.catch(() => {});
    };

    publ.destructor = () => {
        if (running) return publ.stop();
        return undefined;
    };

    return publ;
};

export default Pollerloop;
