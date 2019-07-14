"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const ava_1 = __importDefault(require("ava"));
const sinon_1 = __importDefault(require("sinon"));
const assert_1 = __importDefault(require("assert"));
const __1 = __importDefault(require("../.."));
ava_1.default.beforeEach((t) => {
    t.context.tik = (() => {
        let time;
        return () => {
            if (time) {
                const lastTime = time;
                time = Date.now();
                return time - lastTime;
            }
            else {
                time = Date.now();
                return 0;
            }
        };
    })();
});
ava_1.default('test 1', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            yield timer1;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    assert_1.default(yield pollerloop.start(cb));
    assert_1.default(cb.args[0].length === 0);
}));
ava_1.default('test exception', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            if (i === 2) {
                const err = new Error('haha');
                stopping(err);
                throw err;
            }
            yield timer1;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    yield assert_1.default.rejects(pollerloop.start(cb), { message: 'haha' });
    assert_1.default(cb.args[0][0].message === 'haha');
}));
ava_1.default('test manual stop', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(1000);
            yield timer1;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    const loop = pollerloop.start(cb);
    bluebird_1.default.delay(1500).then(() => {
        t.log('pollerloop.stop()');
        pollerloop.stop();
    });
    assert_1.default(!(yield loop));
    assert_1.default(cb.args[0].length === 0);
}));
ava_1.default('test 2', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            t.log(tik());
            const timer1 = delay(300);
            yield timer1;
            if (!isRunning())
                break;
            t.log(tik());
            const timer2 = delay(700);
            yield timer2;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    assert_1.default(yield pollerloop.start(cb));
}));
ava_1.default('test 3', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(800);
            t.log(tik());
            const timer2 = delay(300);
            yield timer2;
            if (!isRunning())
                break;
            t.log(tik());
            const timer3 = delay(700);
            yield timer3;
            if (!isRunning())
                break;
            t.log(tik());
            yield timer1;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    assert_1.default(yield pollerloop.start(cb));
}));
ava_1.default('test 4', (t) => __awaiter(this, void 0, void 0, function* () {
    const { tik } = t.context;
    const polling = (stopping, isRunning, delay) => __awaiter(this, void 0, void 0, function* () {
        for (let i = 1; i <= 3 && isRunning(); i += 1) {
            const timer1 = delay(1000);
            t.log(tik());
            const timer2 = delay(300);
            yield timer2;
            if (!isRunning())
                break;
            t.log(tik());
            const timer3 = delay(200);
            yield timer3;
            if (!isRunning())
                break;
            t.log(tik());
            yield timer1;
        }
        stopping();
        return isRunning();
    });
    const cb = sinon_1.default.fake();
    const pollerloop = new __1.default(polling);
    assert_1.default(yield pollerloop.start(cb));
}));
//# sourceMappingURL=test.js.map