import Startable from 'startable';
import Timer from 'interruptible-timer';

interface Loop {
    (
        sleep: (ms: number) => Promise<void>,
    ): Promise<void>;
}

class Pollerloop extends Startable {
    private timers = new Set<Timer>();
    private polling?: Promise<void>;

    constructor(
        private loop: Loop,
        private setTimeout = global.setTimeout,
        private clearTimeout = global.clearTimeout,
    ) {
        super();
    }

    private async sleep(ms: number): Promise<void> {
        const timer = new Timer(ms, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        return timer.promise.finally(() => {
            this.timers.delete(timer);
        });
    }

    protected async _start(): Promise<void> {
        this.polling = this.loop(
            ms => this.sleep(ms),
        ).then(
            () => void this.stop().catch(() => { }),
            err => void this.stop(err).catch(() => { }),
        );
    }

    protected async _stop(): Promise<void> {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.interrupt());
        await this.polling!;
    }
}

export {
    Pollerloop as default,
    Pollerloop,
    Loop,
}
