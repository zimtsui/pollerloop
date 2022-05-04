import { Cancellable } from 'cancellable';
export declare class Timers extends Set<Cancellable> {
    add(timer: Cancellable): this;
    clear(): void;
}
export declare class LoopStopped extends Error {
}
