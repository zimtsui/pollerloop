import { ReadyState } from 'startable';
import { Cancellable } from 'cancellable';
import { TimeEngineLike } from 'time-engine-like';
export declare class Pollerloop {
    private loop;
    private engine;
    $s: import("startable").Startable<[]>;
    private timers;
    private loopPromise;
    constructor(loop: Loop, engine: TimeEngineLike);
    private sleep;
    protected rawStart(): Promise<void>;
    getLoopPromise(): Promise<void>;
    protected rawStop(): Promise<void>;
}
export interface Loop {
    (sleep: Sleep): Promise<void>;
}
export interface Sleep {
    (ms: number): Cancellable;
}
export declare class InvalidState extends Error {
    constructor(state: ReadyState);
}
