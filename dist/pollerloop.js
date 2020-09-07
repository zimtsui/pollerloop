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
        this.delay = (ms) => {
            const timer = new Timer(ms, () => {
                this.timers.delete(timer);
            }, this.setTimeout, this.clearTimeout);
            this.timers.add(timer);
            return timer.promise.catch(() => { });
        };
    }
    async _start() {
        this.shouldBeRunning = true;
        this.polling = this.poll(this.stop.bind(this), () => this.shouldBeRunning, this.delay).catch((err) => {
            this.stop(err);
            throw err;
        });
        this.polling.catch(() => { });
    }
    async _stop(err) {
        this.shouldBeRunning = false;
        this.timers.forEach(timer => timer.interrupt());
        await this.polling.catch(() => { });
    }
}
export { Pollerloop as default, Pollerloop, };
//# sourceMappingURL=pollerloop.js.map