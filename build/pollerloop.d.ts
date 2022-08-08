import { ReadyState } from 'startable';
import { TimeEngineLike, Cancellable } from 'time-engine-like';
import { PollerloopLike } from './pollerloop-like';
export declare class Pollerloop implements PollerloopLike {
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
