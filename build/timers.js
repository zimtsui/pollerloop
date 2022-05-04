"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoopStopped = exports.Timers = void 0;
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
            timer.cancel(new LoopStopped());
        super.clear();
    }
}
exports.Timers = Timers;
class LoopStopped extends Error {
}
exports.LoopStopped = LoopStopped;
//# sourceMappingURL=timers.js.map