import {
    Startable,
    LifePeriod,
} from 'startable';
import {
    Timer,
    SetTimeout,
    ClearTimeout,
} from 'interruptible-timer';

interface Loop {
    (sleep: Sleep): Promise<void>;
}

interface Sleep {
    (ms: number): Promise<void>;
}

class Pollerloop extends Startable {
    private timers = new Set<Timer>();
    private polling?: Promise<void>;

    constructor(
        private loop: Loop,
        private setTimeout?: SetTimeout,
        private clearTimeout?: ClearTimeout,
    ) {
        super();
    }

    private sleep: Sleep = (ms: number) => {
        if (this.lifePeriod === LifePeriod.STOPPING)
            return Promise.reject('stopping');
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
    Sleep,
}
