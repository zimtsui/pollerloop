import { Startable, } from 'startable';
import Timer from 'interruptible-timer';
class Pollerloop extends Startable {
    constructor(loop, setTimeout = global.setTimeout, clearTimeout = global.clearTimeout) {
        super();
        this.loop = loop;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
        this.sleep = (ms) => {
            if (this.lifePeriod === "STOPPING" /* STOPPING */)
                return Promise.reject('stopping');
            // nodejs reset ms to 1 if ms == 0
            // queue as macro task
            // https://zh.javascript.info/event-loop
            if (!ms)
                return new Promise(resolve => void setImmediate(resolve));
            const timer = new Timer(ms, this.setTimeout, this.clearTimeout);
            this.timers.add(timer);
            return timer.promise.finally(() => {
                this.timers.delete(timer);
            });
        };
    }
    async _start() {
        this.polling = this.loop(ms => this.sleep(ms)).then(() => void this.stop().catch(() => { }), err => void this.stop(err).catch(() => { }));
    }
    async _stop() {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.interrupt());
        await this.polling;
    }
}
export { Pollerloop as default, Pollerloop, };
//# sourceMappingURL=pollerloop.js.map