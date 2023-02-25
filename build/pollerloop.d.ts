import { TimeEngineLike } from '@zimtsui/time-engine-like';
export declare class Pollerloop {
    private loop;
    private engine;
    private timers;
    private loopPromise?;
    constructor(loop: Pollerloop.Loop, engine: TimeEngineLike);
    private sleep;
    protected rawStart(): Promise<void>;
    protected rawStop(): Promise<void>;
}
export declare namespace Pollerloop {
    interface Loop {
        (sleep: Sleep): Promise<void>;
    }
    interface Sleep {
        (ms: number): TimeEngineLike.Cancellable;
    }
}
