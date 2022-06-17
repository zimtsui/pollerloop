import { ReadyState, StartableLike } from 'startable';
import { Cancellable } from 'cancellable';
import { TimeEngineLike } from 'time-engine-like';
export declare class Pollerloop implements StartableLike {
    private loop;
    private engine;
    private startable;
    start: (onStopping?: import("startable").OnStopping | undefined) => Promise<void>;
    stop: (err?: Error | undefined) => Promise<void>;
    assart: (onStopping?: import("startable").OnStopping | undefined) => Promise<void>;
    starp: (err?: Error | undefined) => Promise<void>;
    getReadyState: () => ReadyState;
    skipStart: (onStopping?: import("startable").OnStopping | undefined) => void;
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
