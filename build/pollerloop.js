"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancelled = exports.Pollerloop = void 0;
const startable_1 = require("startable");
const cancellable_sleep_1 = require("cancellable-sleep");
Object.defineProperty(exports, "Cancelled", { enumerable: true, get: function () { return cancellable_sleep_1.Cancelled; } });
const assert = require("assert");
class Pollerloop {
    constructor(loop, setTimeout = globalThis.setTimeout, clearTimeout = globalThis.clearTimeout) {
        this.loop = loop;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;
        this.timers = new Set();
        this.startable = startable_1.Startable.create(() => this.start(), () => this.stop());
        this.sleep = async (ms) => {
            if (this.startable.getReadyState() === "STOPPING" /* STOPPING */)
                return Promise.reject('stopping');
            const timer = (0, cancellable_sleep_1.sleep)(ms, this.setTimeout, this.clearTimeout);
            this.timers.add(timer);
            await timer.finally(() => {
                this.timers.delete(timer);
            });
        };
    }
    async start() {
        this.loopPromise = this.loop(this.sleep);
        this.loopPromise.then(() => void this.startable.starp(), err => void this.startable.starp(err));
    }
    getLoopPromise() {
        assert(this.startable.getReadyState() !== "STOPPED" /* STOPPED */);
        return this.loopPromise;
    }
    async stop() {
        // https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
        for (const timer of this.timers)
            timer.cancel();
        await this.loopPromise.catch(() => { });
    }
}
exports.Pollerloop = Pollerloop;
//# sourceMappingURL=pollerloop.js.map