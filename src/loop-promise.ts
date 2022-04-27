import { ManualPromise } from 'manual-promise';


export class LoopPromise extends ManualPromise<void> {
	public resolve!: (value: void) => void;
	public reject!: (err: Error) => void;
}
