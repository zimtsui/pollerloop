import {
	Startable,
	ReadyState,
} from 'startable';
import {
	Cancellable,
	sleep,
	SetTimeout,
	ClearTimeout,
	Cancelled,
} from 'cancellable-sleep';
import assert = require('assert');

export interface Loop {
	(sleep: Sleep): Promise<void>;
}

export interface Sleep {
	(ms: number): Promise<void>;
}

export class Pollerloop<Timeout> {
	private timers = new Set<Cancellable<Timeout>>();
	private loopPromise?: Promise<void>;
	public startable = Startable.create(
		() => this.start(),
		() => this.stop(),
	);

	constructor(
		loop: Loop,
		setTimeout: SetTimeout<Timeout>,
		clearTimeout: ClearTimeout<Timeout>,
	);
	constructor(
		loop: Loop,
	);
	constructor(
		private loop: Loop,
		private setTimeout = globalThis.setTimeout,
		private clearTimeout = globalThis.clearTimeout,
	) { }

	private sleep: Sleep = async (ms: number) => {
		if (this.startable.getReadyState() === ReadyState.STOPPING)
			return Promise.reject('stopping');
		const timer = sleep(ms, this.setTimeout, this.clearTimeout);
		this.timers.add(timer);
		await timer.finally(() => {
			this.timers.delete(timer);
		});
	}

	protected async start(): Promise<void> {
		this.loopPromise = this.loop(this.sleep);
		this.loopPromise.then(
			() => void this.startable.starp(),
			err => void this.startable.starp(err),
		);
	}

	public getLoopPromise(): Promise<void> {
		assert(this.startable.getReadyState() !== ReadyState.STOPPED);
		return this.loopPromise!;
	}

	protected async stop(): Promise<void> {
		// https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
		for (const timer of this.timers) timer.cancel();
		await this.loopPromise!.catch(() => { });
	}
}

export {
	SetTimeout,
	ClearTimeout,
	Cancelled,
}
