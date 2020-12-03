import Startable from 'startable';
import { Timer, } from 'interruptible-timer';
class Pollerloop extends Startable {
    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(poll, setTimeout, clearTimeout) {
        super();
        this.poll = poll;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
        this.shouldBeRunning = false;
    }
    delay(ms) {
        const timer = new Timer(ms, () => {
            this.timers.delete(timer);
        }, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        return timer.promise.catch(() => { });
    }
    async _start() {
        this.shouldBeRunning = true;
        this.polling = this.poll(() => this.shouldBeRunning, ms => this.delay(ms)).then(() => this.stop(), err => this.stop(err));
    }
    async _stop() {
        this.shouldBeRunning = false;
        this.timers.forEach(timer => timer.interrupt());
        await this.polling;
    }
}
export { Pollerloop as default, Pollerloop, };
//# sourceMappingURL=pollerloop.js.map