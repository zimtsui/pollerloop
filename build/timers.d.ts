import { TimeEngineLike } from '@zimtsui/time-engine-like';
export declare class Timers {
    private cancellables;
    push(timer: TimeEngineLike.Cancellable): void;
    clear(err: Error): void;
}
