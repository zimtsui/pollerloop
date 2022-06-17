"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidState = exports.Pollerloop = void 0;
const startable_1 = require("startable");
const cancellable_1 = require("cancellable");
const timers_1 = require("./timers");
const loop_promise_1 = require("./loop-promise");
const assert = require("assert");
class Pollerloop {
    constructor(loop, engine) {
        this.loop = loop;
        this.engine = engine;
        this.startable = startable_1.Startable.create(() => this.rawStart(), () => this.rawStop());
        this.start = this.startable.start;
        this.stop = this.startable.stop;
        this.assart = this.startable.assart;
        this.starp = this.startable.starp;
        this.getReadyState = this.startable.getReadyState;
        this.skipStart = this.startable.skipStart;
        this.timers = new timers_1.Timers();
        this.loopPromise = new loop_promise_1.LoopPromise();
        this.sleep = (ms) => {
            assert(this.startable.getReadyState() === "STARTING" /* STARTING */ ||
                this.startable.getReadyState() === "STARTED" /* STARTED */, new InvalidState(this.startable.getReadyState()));
            const timer = new cancellable_1.Cancellable(ms, this.engine);
            this.timers.add(timer);
            return timer;
        };
    }
    async rawStart() {
        this.loop(this.sleep).then(() => this.loopPromise.resolve(), (err) => this.loopPromise.reject(err));
        this.loopPromise.then(() => this.startable.starp(), err => this.startable.starp(err));
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