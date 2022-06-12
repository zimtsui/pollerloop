import { ManualPromise } from '@zimtsui/manual-promise';
export declare class LoopPromise extends ManualPromise<void> {
    resolve: (value: void) => void;
    reject: (err: Error) => void;
}
