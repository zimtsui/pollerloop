import {
    Startable,
    LifePeriod,
} from 'startable';
import {
    Cancellable,
} from 'cancellable-sleep';
import {
    SetTimeout,
    ClearTimeout,
} from 'timeout';
import * as Timeout from 'timeout';

interface Loop {
    (sleep: Sleep): Promise<void>;
}

interface Sleep {
    (ms: number): Promise<void>;
}

class Pollerloop extends Startable {
    private timers = new Set<Cancellable>();
    private polling?: Promise<void>;

    constructor(
        loop: Loop,
        setTimeout: SetTimeout<any>,
        clearTimeout: ClearTimeout<any>,
    );
    constructor(
        loop: Loop,
    );
    constructor(
        private loop: Loop,
        private setTimeout = Timeout.setTimeout,
        private clearTimeout = Timeout.clearTimeout,
    ) {
        super();
    }

    private sleep: Sleep = (ms: number) => {
        if (this.lifePeriod === LifePeriod.STOPPING)
            return Promise.reject('stopping');
        const timer = new Cancellable(ms, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        return timer.finally(() => {
            this.timers.delete(timer);
        });
    }

    protected async _start(): Promise<void> {
        this.polling = this.loop(this.sleep)
            .then(() => this.starp(), this.starp);
    }

    protected async _stop(): Promise<void> {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.cancel());
        await this.polling!;
    }
}

export {
    Pollerloop as default,
    Pollerloop,
    Loop,
    Sleep,
    SetTimeout,
    ClearTimeout,
}
