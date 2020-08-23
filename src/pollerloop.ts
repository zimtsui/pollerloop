import Startable from 'startable';
import Timer from 'interruptible-timer';

/**
 * IMPORTANT: always check 'shouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (
        stop: (err?: Error) => Promise<void>,
        shouldBeRunning: boolean,
        delay: (ms: number) => Promise<void>,
    ): Promise<void>;
}

class Pollerloop extends Startable {
    private timers = new Set<Timer>();
    private shouldBeRunning = false;
    public polling!: Promise<void>;

    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(private poll: Poll) {
        super();
    }

    private delay = (ms: number) => {
        const timer = new Timer(ms, () => {
            this.timers.delete(timer);
        });
        this.timers.add(timer);
        return timer.promise.catch(() => { });
    }

    protected async _start(): Promise<void> {
        this.shouldBeRunning = true;
        this.polling = this.poll(
            this.stop.bind(this),
            this.shouldBeRunning,
            this.delay,
        ).catch((err: Error) => {
            this.stop(err);
            throw err;
        });
        this.polling.catch(() => { });
    }

    protected async _stop(err?: Error): Promise<void> {
        this.shouldBeRunning = false;
        this.timers.forEach(timer => timer.interrupt());
        await this.polling.catch(() => { });
    }
}

export {
    Pollerloop as default,
    Pollerloop,
    Poll,
}