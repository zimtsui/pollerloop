import { ReadyState } from 'startable';
import { Cancellable } from 'cancellable';
import { TimeEngineLike } from 'time-engine-like';
export declare class Pollerloop {
    private loop;
    private engine;
    private timers;
    private loopPromise;
    startable: import("startable/build/startable").Startable;
    constructor(loop: Loop, engine: TimeEngineLike);
    private sleep;
    protected start(): Promise<void>;
    getLoopPromise(): Promise<void>;
    protected stop(): Promise<void>;
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
