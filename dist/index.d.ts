interface Callback {
    (err?: Error): void;
}
interface Polling {
    (stopping: (err?: Error) => void, isRunning: () => boolean, delay: (ms: number) => Promise<void>): Promise<void>;
}
declare class Pollerloop {
    private polling;
    private state;
    private timers;
    private stopping;
    /**
     * @param {Polling} polling - returns a promise fulfilled for auto or manual ending,
     * and rejected for exception.
     */
    constructor(polling: Polling);
    start(stopping?: Callback): Promise<void>;
    stop(err?: Error): void;
}
export { Polling };
export default Pollerloop;
