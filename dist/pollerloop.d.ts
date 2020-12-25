/// <reference types="node" />
import { Startable } from 'startable';
interface Loop {
    (sleep: (ms: number) => Promise<void>): Promise<void>;
}
declare class Pollerloop extends Startable {
    private loop;
    private setTimeout;
    private clearTimeout;
    private timers;
    private polling?;
    constructor(loop: Loop, setTimeout?: ((callback: (...args: any[]) => void, ms: number, ...args: any[]) => NodeJS.Timeout) & typeof globalThis.setTimeout, clearTimeout?: ((timeoutId: NodeJS.Timeout) => void) & typeof globalThis.clearTimeout);
    private sleep;
    protected _start(): Promise<void>;
    protected _stop(): Promise<void>;
}
export { Pollerloop as default, Pollerloop, Loop, };
