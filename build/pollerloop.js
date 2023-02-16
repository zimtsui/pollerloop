"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pollerloop = void 0;
const startable_1 = require("startable");
const time_engine_like_1 = require("time-engine-like");
const timers_1 = require("./timers");
class Pollerloop {
    constructor(loop, engine) {
        this.loop = loop;
        this.engine = engine;
        this.$s = (0, startable_1.createStartable)(() => this.rawStart(), () => this.rawStop());
        this.timers = new timers_1.Timers();
        this.sleep = (ms) => {
            this.$s.assertState([startable_1.ReadyState.STARTING, startable_1.ReadyState.STARTED]);
            const timer = new time_engine_like_1.Cancellable(ms, this.engine);
            this.timers.push(timer);
            return timer;
        };
    }
    async rawStart() {
        this.loopPromise = this.loop(this.sleep);
        this.loopPromise.then(() => this.$s.stop(), err => this.$s.stop(err));
    }
    async rawStop() {
        this.timers.clear(new startable_1.StateError(startable_1.ReadyState.STOPPING));
        if (this.loopPromise)
            await this.loopPromise.catch(() => { });
    }
}
exports.Pollerloop = Pollerloop;
//# sourceMappingURL=pollerloop.js.map