import { Startable } from 'startable';
import { SetTimeout, ClearTimeout } from 'interruptible-timer';
interface Loop {
    (sleep: Sleep): Promise<void>;
}
interface Sleep {
    (ms: number): Promise<void>;
}
declare class Pollerloop extends Startable {
    private loop;
    private setTimeout;
    private clearTimeout;
    private timers;
    private polling?;
    constructor(loop: Loop, setTimeout: SetTimeout, clearTimeout: ClearTimeout);
    constructor(loop: Loop);
    private sleep;
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Loop, Sleep, SetTimeout, ClearTimeout, };
