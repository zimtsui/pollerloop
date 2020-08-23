import Startable from 'startable';
/**
 * IMPORTANT: always check 'shouldBeRunning' immediately after 'delay()' returns
 */
interface Poll {
    (stop: (err?: Error) => Promise<void>, shouldBeRunning: boolean, delay: (ms: number) => Promise<void>): Promise<void>;
}
declare class Pollerloop extends Startable {
    private poll;
    private timers;
    private shouldBeRunning;
    polling: Promise<void>;
    /**
     * @param {Poll} poll - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(poll: Poll);
    private delay;
    protected _start(): Promise<void>;
    protected _stop(err?: Error): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Poll, };
