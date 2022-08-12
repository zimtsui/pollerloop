import { Cancellable } from 'time-engine-like';
export declare class Timers {
    private cancellables;
    push(timer: Cancellable): void;
    clear(err: Error): void;
}
