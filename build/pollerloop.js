"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pollerloop = void 0;
const startable_1 = require("@zimtsui/startable");
const time_engine_like_1 = require("@zimtsui/time-engine-like");
const timers_1 = require("./timers");
class Pollerloop {
    constructor(loop, engine) {
        this.loop = loop;
        this.engine = engine;
        this.timers = new timers_1.Timers();
        this.sleep = (ms) => {
            (0, startable_1.$)(this).assertState([startable_1.ReadyState.STARTING, startable_1.ReadyState.STARTED]);
            const timer = new time_engine_like_1.TimeEngineLike.Cancellable(ms, this.engine);
            this.timers.push(timer);
            return timer;
        };
    }
    async rawStart() {
        this.loopPromise = this.loop(this.sleep);
        this.loopPromise.then(() => (0, startable_1.$)(this).stop(), err => (0, startable_1.$)(this).stop(err));
    }
    async rawStop() {
        this.timers.clear(new startable_1.StateError(startable_1.ReadyState.STOPPING));
        if (this.loopPromise)
            await this.loopPromise.catch(() => { });
    }
}
__decorate([
    (0, startable_1.AsRawStart)()
], Pollerloop.prototype, "rawStart", null);
__decorate([
    (0, startable_1.AsRawStop)()
], Pollerloop.prototype, "rawStop", null);
exports.Pollerloop = Pollerloop;
//# sourceMappingURL=pollerloop.js.map