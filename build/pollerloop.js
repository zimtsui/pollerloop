"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidState = exports.Pollerloop = void 0;
const startable_1 = require("startable");
const time_engine_like_1 = require("time-engine-like");
const timers_1 = require("./timers");
const loop_promise_1 = require("./loop-promise");
const assert = require("assert");
class Pollerloop {
    constructor(loop, engine) {
        this.loop = loop;
        this.engine = engine;
        this.$s = (0, startable_1.createStartable)(() => this.rawStart(), () => this.rawStop());
        this.timers = new timers_1.Timers();
        this.loopPromise = new loop_promise_1.LoopPromise();
        this.sleep = (ms) => {
            assert(this.$s.getReadyState() === "STARTING" /* STARTING */ ||
                this.$s.getReadyState() === "STARTED" /* STARTED */, new InvalidState(this.$s.getReadyState()));
            const timer = new time_engine_like_1.Cancellable(ms, this.engine);
            this.timers.add(timer);
            return timer;
        };
    }
    async rawStart() {
        this.loop(this.sleep).then(() => this.loopPromise.resolve(), (err) => this.loopPromise.reject(err));
        this.loopPromise.then(() => this.$s.starp(), err => this.$s.starp(err));
    }
    getLoopPromise() {
        return this.loopPromise;
    }
    async rawStop() {
        this.timers.clear();
        await this.loopPromise.catch(() => { });
    }
}
exports.Pollerloop = Pollerloop;
class InvalidState extends Error {
    constructor(state) {
        super(`Invalid state: ${state}`);
    }
}
exports.InvalidState = InvalidState;
//# sourceMappingURL=pollerloop.js.map