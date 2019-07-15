interface Callback {
    (err?: Error): void;
}
interface Polling {
    (stopping: (err?: Error) => void, isRunning: () => boolean, delay: (ms: number) => Promise<void>): Promise<boolean>;
}
declare class Pollerloop {
    private polling;
    private timers;
    private running;
    private stopped;
    private stopping;
    /**
     * @param {Polling} polling - fulfilled with true for auto ending,
     * false for manual ending, and rejected for exception.
     */
    constructor(polling: Polling);
    start(stopping: Callback): Promise<boolean>;
    stop(): Promise<boolean>;
    destructor(): Promise<void>;
}
export default Pollerloop;
