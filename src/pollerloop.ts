import Startable from 'startable';
import {
    Timer,
    SetTimeout,
    ClearTimeout,
} from 'interruptible-timer';

/**
 * IMPORTANT: always check 'ifShouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (
        ifShouldBeRunning: () => boolean,
        delay: (ms: number) => Promise<void>,
    ): Promise<void>;
}

class Pollerloop<Timeout> extends Startable {
    private timers = new Set<Timer<Timeout>>();
    private shouldBeRunning = false;
    private polling?: Promise<void>;

    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(
        private poll: Poll,
        private setTimeout: SetTimeout<Timeout>,
        private clearTimeout: ClearTimeout<Timeout>,
    ) {
        super();
    }

    private delay(ms: number) {
        const timer = new Timer(ms, () => {
            this.timers.delete(timer);
        }, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        return timer.promise.catch(() => { });
    }

    protected async _start(): Promise<void> {
        this.shouldBeRunning = true;
        this.polling = this.poll(
            () => this.shouldBeRunning,
            ms => this.delay(ms),
        ).then(
            () => this.stop(),
            err => this.stop(err),
        );
    }

    protected async _stop(): Promise<void> {
        this.shouldBeRunning = false;
        this.timers.forEach(timer => timer.interrupt());
        await this.polling;
    }
}

export {
    Pollerloop as default,
    Pollerloop,
    Poll,
    SetTimeout,
    ClearTimeout,
}
