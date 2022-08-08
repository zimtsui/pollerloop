import { StartableLike } from 'startable';
export interface PollerloopLike {
    $s: StartableLike<[]>;
    getLoopPromise(): Promise<void>;
}
