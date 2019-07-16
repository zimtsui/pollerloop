"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interruptible_timer_1 = __importDefault(require("interruptible-timer"));
const assert_1 = __importDefault(require("assert"));
var States;
(function (States) {
    States[States["CONSTRUCTED"] = 0] = "CONSTRUCTED";
    States[States["STARTED"] = 1] = "STARTED";
    States[States["STOPPING"] = 2] = "STOPPING";
})(States || (States = {}));
class Pollerloop {
    /**
     * @param {Polling} polling - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(polling) {
        this.polling = polling;
        this.state = States.CONSTRUCTED;
        this.timers = new Set();
        this.stopping = undefined;
        this.pollingStopping = (err) => {
            this.state === States.STARTED && this.stop(err);
        };
        this.pollingIsRunning = () => {
            return this.state === States.STARTED;
        };
        this.pollingDelay = (ms) => {
            const timer = new interruptible_timer_1.default(ms, () => {
                this.timers.delete(timer);
            });
            this.timers.add(timer);
            return timer.promise.catch(() => { });
        };
    }
    start(stopping = () => { }) {
        assert_1.default(this.state === States.CONSTRUCTED);
        this.state = States.STARTED;
        this.stopping = stopping;
        return this.polling(this.pollingStopping, this.pollingIsRunning, this.pollingDelay);
    }
    stop(err) {
        assert_1.default(this.state === States.STARTED);
        this.state = States.STOPPING;
        this.stopping(err);
        this.timers.forEach(timer => timer.interrupt());
    }
}
exports.default = Pollerloop;
//# sourceMappingURL=index.js.map