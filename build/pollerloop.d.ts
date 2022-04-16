import { SetTimeout, ClearTimeout, Cancelled } from 'cancellable-sleep';
export interface Loop {
    (sleep: Sleep): Promise<void>;
}
export interface Sleep {
    (ms: number): Promise<void>;
}
export declare class Pollerloop<Timeout> {
    private loop;
    private setTimeout;
    private clearTimeout;
    private timers;
    private loopPromise?;
    startable: import("startable/build/startable-like").StartableLike;
    constructor(loop: Loop, setTimeout: SetTimeout<Timeout>, clearTimeout: ClearTimeout<Timeout>);
    constructor(loop: Loop);
    private sleep;
    protected start(): Promise<void>;
    getLoopPromise(): Promise<void>;
    protected stop(): Promise<void>;
}
export { SetTimeout, ClearTimeout, Cancelled, };
