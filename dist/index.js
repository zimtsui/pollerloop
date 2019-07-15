"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interruptible_timer_1 = __importDefault(require("interruptible-timer"));
const assert_1 = __importDefault(require("assert"));
class Pollerloop {
    /**
     * @param {Polling} polling - fulfilled with true for auto ending,
     * false for manual ending, and rejected for exception.
     */
    constructor(polling) {
        this.polling = polling;
        this.timers = new Set();
        this.running = false;
        this.stopped = undefined;
        this.stopping = undefined;
    }
    start(stopping) {
        this.stopping = stopping;
        this.running = true;
        this.stopped = this.polling((err) => {
            this.timers.forEach(timer => timer.interrupt());
            if (err)
                this.stopping(err);
            else
                this.stopping();
        }, () => this.running, (ms) => {
            const timer = new interruptible_timer_1.default(ms, () => {
                this.timers.delete(timer);
            });
            this.timers.add(timer);
            return timer.promise.catch(() => { });
        });
        return this.stopped;
    }
    stop() {
        assert_1.default(this.running);
        this.running = false;
        this.timers.forEach(timer => timer.interrupt());
        return this.stopped;
    }
    destructor() {
        if (this.running)
            return this.stop().then(() => { });
        return Promise.resolve();
    }
}
exports.default = Pollerloop;
//# sourceMappingURL=index.js.map