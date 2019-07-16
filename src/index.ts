import Timer from 'interruptible-timer';
import assert from 'assert';

interface Stopping {
    (err?: Error): void;
}

interface Polling {
    (
        stopping: (err?: Error) => void,
        isRunning: () => boolean,
        delay: (ms: number) => Promise<void>,
    ): Promise<void>;
}

enum States {
    CONSTRUCTED,
    STARTED,
    STOPPING,
}

class Pollerloop {
    private state = States.CONSTRUCTED;
    private timers = new Set<Timer>();
    private stopping: Stopping | undefined = undefined;

    /**
     * @param {Polling} polling - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(private polling: Polling) { }

    private pollingStopping = (err?: Error) => {
        this.state === States.STARTED && this.stop(err);
    }
    private pollingIsRunning = () => {
        return this.state === States.STARTED;
    }
    private pollingDelay = (ms: number) => {
        const timer = new Timer(ms, () => {
            this.timers.delete(timer);
        });
        this.timers.add(timer);
        return timer.promise.catch(() => { });
    }

    start(stopping: Stopping = () => { }): Promise<void> {
        assert(this.state === States.CONSTRUCTED);
        this.state = States.STARTED;
        this.stopping = stopping;
        return this.polling(
            this.pollingStopping,
            this.pollingIsRunning,
            this.pollingDelay,
        );
    }

    stop(err?: Error): void {
        assert(this.state === States.STARTED);
        this.state = States.STOPPING;
        this.stopping!(err);
        this.timers.forEach(timer => timer.interrupt());
    }
}

export { Polling };
export default Pollerloop;
