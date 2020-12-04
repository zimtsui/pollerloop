import Startable from 'startable';
import Timer from 'interruptible-timer';

/**
 * IMPORTANT: always check 'ifShouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (
        shouldBeRunning: () => boolean,
        sleep: (ms: number) => Promise<void>,
    ): Promise<void>;
}

class Pollerloop extends Startable {
    private timers = new Set<Timer>();
    private shouldBeRunning = false;
    private polling?: Promise<void>;

    constructor(
        private poll: Poll,
        private setTimeout = global.setTimeout,
        private clearTimeout = global.clearTimeout,
    ) {
        super();
    }

    private async sleep(ms: number): Promise<void> {
        const timer = new Timer(ms, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        const sleeping = timer.promise.finally(() => {
            this.timers.delete(timer);
        });
        sleeping.catch(() => { });
        return sleeping;
    }

    protected async _start(): Promise<void> {
        this.shouldBeRunning = true;
        this.polling = this.poll(
            () => this.shouldBeRunning,
            ms => this.sleep(ms),
        ).then(
            () => void this.stop().catch(() => { }),
            err => void this.stop(err).catch(() => { }),
        );
    }

    protected async _stop(): Promise<void> {
        this.shouldBeRunning = false;
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.interrupt());
        await this.polling!;
    }
}

export {
    Pollerloop as default,
    Pollerloop,
    Poll,
}
