"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pollerloop = exports.default = void 0;
const startable_1 = require("startable");
const cancellable_sleep_1 = require("cancellable-sleep");
class Pollerloop extends startable_1.Startable {
    constructor(loop, setTimeout = globalThis.setTimeout, clearTimeout = globalThis.clearTimeout) {
        super();
        this.loop = loop;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
        this.sleep = (ms) => {
            if (this.readyState === "STOPPING" /* STOPPING */)
                return Promise.reject('stopping');
            const timer = new cancellable_sleep_1.Cancellable(ms, this.setTimeout, this.clearTimeout);
            this.timers.add(timer);
            return timer.finally(() => {
                this.timers.delete(timer);
            });
        };
    }
    async rawStart() {
        this.polling = this.loop(this.sleep).then(() => void this.stop(), err => void this.stop(err));
    }
    async rawStop() {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        for (const timer of this.timers)
            timer.cancel();
        await this.polling;
    }
}
exports.default = Pollerloop;
exports.Pollerloop = Pollerloop;
//# sourceMappingURL=pollerloop.js.map