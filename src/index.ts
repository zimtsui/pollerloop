import Timer from 'interruptible-timer';
import assert from 'assert';

interface Callback {
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
    // private stopped: Promise<void> | undefined = undefined;
    private stopping: Callback | undefined = undefined;

    /**
     * @param {Polling} polling - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(private polling: Polling) { }

    start(stopping: Callback = () => { }): Promise<void> {
        this.stopping = stopping;
        this.state = States.CONSTRUCTED;
        this.state = States.STARTED;
        return this.polling(
            (err?: Error) => {
                this.state === States.STARTED && this.stop(err);
            },
            () => this.state === States.STARTED,
            (ms: number) => {
                const timer = new Timer(ms, () => {
                    this.timers.delete(timer);
                });
                this.timers.add(timer);
                return timer.promise.catch(() => { });
            },
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
