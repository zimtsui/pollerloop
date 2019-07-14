interface Callback {
    (err?: Error): void;
}
interface Polling {
    (stopping: (err?: Error) => void, isRunning: () => boolean, delay: (ms: number) => Promise<void>): Promise<boolean>;
}
declare class Pollerloop {
    private polling;
    private destructors;
    private running;
    private stopped;
    private stopping;
    constructor(polling: Polling);
    start(stopping: Callback): Promise<boolean>;
    stop(): Promise<boolean>;
    destructor(): Promise<void>;
}
export default Pollerloop;
