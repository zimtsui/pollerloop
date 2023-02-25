import { TimeEngineLike, Cancellable } from 'time-engine-like';
export declare class Pollerloop {
    private loop;
    private engine;
    private timers;
    private loopPromise?;
    constructor(loop: Loop, engine: TimeEngineLike);
    private sleep;
    protected rawStart(): Promise<void>;
    protected rawStop(): Promise<void>;
}
export interface Loop {
    (sleep: Sleep): Promise<void>;
}
export interface Sleep {
    (ms: number): Cancellable;
}
