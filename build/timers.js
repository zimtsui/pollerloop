"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timers = void 0;
class Timers {
    constructor() {
        this.cancellables = new Set();
    }
    push(timer) {
        this.cancellables.add(timer);
        timer.finally(() => {
            this.cancellables.delete(timer);
        }).catch(() => { });
    }
    clear(err) {
        for (const timer of this.cancellables)
            timer.cancel(err);
        this.cancellables.clear();
    }
}
exports.Timers = Timers;
//# sourceMappingURL=timers.js.map