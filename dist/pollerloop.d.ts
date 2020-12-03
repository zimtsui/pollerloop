import Startable from 'startable';
import { SetTimeout, ClearTimeout } from 'interruptible-timer';
/**
 * IMPORTANT: always check 'ifShouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (ifShouldBeRunning: () => boolean, delay: (ms: number) => Promise<void>): Promise<void>;
}
declare class Pollerloop<Timeout> extends Startable {
    private poll;
    private setTimeout;
    private clearTimeout;
    private timers;
    private shouldBeRunning;
    private polling?;
    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(poll: Poll, setTimeout: SetTimeout<Timeout>, clearTimeout: ClearTimeout<Timeout>);
    private delay;
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Poll, SetTimeout, ClearTimeout, };
