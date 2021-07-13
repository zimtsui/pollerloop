"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pollerloop = exports.default = void 0;
const startable_1 = require("startable");
const interruptible_timer_1 = require("interruptible-timer");
const WebTimer = require("web-timer");
class Pollerloop extends startable_1.Startable {
    constructor(loop, setTimeout = WebTimer.setTimeout, clearTimeout = WebTimer.clearTimeout) {
        super();
        this.loop = loop;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
        this.sleep = (ms) => {
            if (this.lifePeriod === "STOPPING" /* STOPPING */)
                return Promise.reject('stopping');
            const timer = new interruptible_timer_1.Timer(ms, this.setTimeout, this.clearTimeout);
            this.timers.add(timer);
            return timer.promise.finally(() => {
                this.timers.delete(timer);
            });
        };
    }
    async _start() {
        this.polling = this.loop(this.sleep)
            .then(() => this.starp(), this.starp);
    }
    async _stop() {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        this.timers.forEach(timer => void timer.interrupt());
        await this.polling;
    }
}
exports.default = Pollerloop;
exports.Pollerloop = Pollerloop;
//# sourceMappingURL=pollerloop.js.map