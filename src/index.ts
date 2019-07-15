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
    ): Promise<boolean>;
}

class Pollerloop {
    private timers = new Set<Timer>();
    private running: boolean = false;
    private stopped: Promise<boolean> | undefined = undefined;
    private stopping: Callback | undefined = undefined;

    /**
     * @param {Polling} polling - fulfilled with true for auto ending,
     * false for manual ending, and rejected for exception.
     */
    constructor(private polling: Polling) { }

    start(stopping: Callback = () => { }): Promise<boolean> {
        this.stopping = stopping;
        this.running = true;
        this.stopped = this.polling(
            (err?: Error) => {
                this.timers.forEach(timer => timer.interrupt());
                if (err) this.stopping!(err); else this.stopping!();
            },
            () => this.running,
            (ms: number) => {
                const timer = new Timer(ms, () => {
                    this.timers.delete(timer);
                });
                this.timers.add(timer);
                return timer.promise.catch(() => { });
            },
        );
        return this.stopped;
    }

    stop(): Promise<boolean> {
        assert(this.running);
        this.running = false;
        this.timers.forEach(timer => timer.interrupt());
        return this.stopped!;
    }

    destructor(): Promise<void> {
        if (this.running) return this.stop().then(() => { });
        return Promise.resolve();
    }
}

export default Pollerloop;