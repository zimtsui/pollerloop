import { Startable } from 'startable';
import { SetTimeout, ClearTimeout } from 'cancellable-sleep';
interface Loop {
    (sleep: Sleep): Promise<void>;
}
interface Sleep {
    (ms: number): Promise<void>;
}
declare class Pollerloop extends Startable {
    private loop;
    private setTimeout;
    private clearTimeout;
    private timers;
    private polling?;
    constructor(loop: Loop, setTimeout: SetTimeout<any>, clearTimeout: ClearTimeout<any>);
    constructor(loop: Loop);
    private sleep;
    protected Startable$start(): Promise<void>;
    protected Startable$stop(): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Loop, Sleep, SetTimeout, ClearTimeout, };
