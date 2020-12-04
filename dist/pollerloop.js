import Startable from 'startable';
import Timer from 'interruptible-timer';
class Pollerloop extends Startable {
    constructor(poll, setTimeout = global.setTimeout, clearTimeout = global.clearTimeout) {
        super();
        this.poll = poll;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
    }
    async sleep(ms) {
        const timer = new Timer(ms, this.setTimeout, this.clearTimeout);
        this.timers.add(timer);
        return timer.promise.finally(() => {
            this.timers.delete(timer);
        });
    }
    async _start() {
        this.polling = this.poll(ms => this.sleep(ms)).then(() => void this.stop().catch(() => { }), err => void this.stop(err).catch(() => { }));
    }
    async _stop() {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.interrupt());
        await this.polling;
    }
}
export { Pollerloop as default, Pollerloop, };
//# sourceMappingURL=pollerloop.js.map