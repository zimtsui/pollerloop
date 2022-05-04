"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cancelled = exports.Cancellable = exports.LoopStopped = void 0;
__exportStar(require("./loop-promise"), exports);
var timers_1 = require("./timers");
Object.defineProperty(exports, "LoopStopped", { enumerable: true, get: function () { return timers_1.LoopStopped; } });
var cancellable_1 = require("cancellable");
Object.defineProperty(exports, "Cancellable", { enumerable: true, get: function () { return cancellable_1.Cancellable; } });
Object.defineProperty(exports, "Cancelled", { enumerable: true, get: function () { return cancellable_1.Cancelled; } });
//# sourceMappingURL=index.js.map