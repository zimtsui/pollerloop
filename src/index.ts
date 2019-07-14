/*
三种情况

- 自动结束
- 手动结束
- 异常结束
*/

import Delay from 'interruptible-timer';
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
    private destructors = new Set<Function>();
    private running: boolean = false;
    private stopped: Promise<boolean> | undefined = undefined;
    private stopping: Callback | undefined = undefined;

    constructor(private polling: Polling) { }

    start(stopping: Callback): Promise<boolean> {
        this.stopping = stopping;
        this.running = true;
        this.stopped = this.polling(
            (err?: Error) => {
                this.destructors.forEach(destructor => destructor());
                if (err) this.stopping!(err); else this.stopping!();
            },
            () => this.running,
            (ms: number) => {
                let timerInterruptbind: Delay['interrupt'];
                const timer = new Delay(ms, () => {
                    this.destructors.delete(timerInterruptbind);
                });
                timerInterruptbind = timer.interrupt.bind(timer);
                this.destructors.add(timerInterruptbind);
                return timer.promise.catch(() => { });
            },
        );
        return this.stopped;
    }

    stop(): Promise<boolean> {
        assert(this.running);
        this.running = false;
        this.destructors.forEach(destructor => destructor());
        return this.stopped!;
    }

    destructor(): Promise<void> {
        if (this.running) return this.stop().then(() => { });
        return Promise.resolve();
    }
}

export default Pollerloop;