import Startable from 'startable';
import { SetTimeout, ClearTimeout } from 'interruptible-timer';
/**
 * IMPORTANT: always check 'ifShouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (stop: (err?: Error) => Promise<void>, ifShouldBeRunning: () => boolean, delay: (ms: number) => Promise<void>): Promise<void>;
}
declare class Pollerloop<Timeout> extends Startable {
    private poll;
    private setTimeout;
    private clearTimeout;
    private timers;
    private shouldBeRunning;
    polling: Promise<void>;
    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(poll: Poll, setTimeout: SetTimeout<Timeout>, clearTimeout: ClearTimeout<Timeout>);
    private delay;
    protected _start(): Promise<void>;
    protected _stop(err?: Error): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Poll, SetTimeout, ClearTimeout, };
