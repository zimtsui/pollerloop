"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopStopped = exports.Timers = void 0;
const time_engine_like_1 = require("time-engine-like");
class Timers extends Set {
    add(timer) {
        super.add(timer);
        timer.finally(() => {
            this.delete(timer);
        }).catch(() => { });
        return this;
    }
    clear() {
        for (const timer of this)
            timer.cancel(new LoopStopped('Loop stopped.'));
        super.clear();
    }
}
exports.Timers = Timers;
class LoopStopped extends time_engine_like_1.Cancelled {
}
exports.LoopStopped = LoopStopped;
//# sourceMappingURL=timers.js.map