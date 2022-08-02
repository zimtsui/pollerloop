import { Cancellable, Cancelled } from 'time-engine-like';
export declare class Timers extends Set<Cancellable> {
    add(timer: Cancellable): this;
    clear(): void;
}
export declare class LoopStopped extends Cancelled {
}
