import {
	createStartable,
	ReadyState,
	StartableLike,
} from 'startable';
import { Cancellable } from 'cancellable';
import { TimeEngineLike } from 'time-engine-like';
import { Timers } from './timers';
import { LoopPromise } from './loop-promise';
import assert = require('assert');



export class Pollerloop {
	public $s = createStartable(
		() => this.rawStart(),
		() => this.rawStop(),
	);

	private timers = new Timers();
	private loopPromise = new LoopPromise();


	public constructor(
		private loop: Loop,
		private engine: TimeEngineLike,
	) { }

	private sleep: Sleep = (ms: number): Cancellable => {
		assert(
			this.$s.getReadyState() === ReadyState.STARTING ||
			this.$s.getReadyState() === ReadyState.STARTED,
			new InvalidState(this.$s.getReadyState()),
		);
		const timer = new Cancellable(
			ms,
			this.engine,
		);
		this.timers.add(timer);
		return timer;
	}

	protected async rawStart(): Promise<void> {
		this.loop(this.sleep).then(
			() => this.loopPromise.resolve(),
			(err: Error) => this.loopPromise.reject(err),
		);
		this.loopPromise.then(
			() => this.$s.starp(),
			err => this.$s.starp(err),
		);
	}

	public getLoopPromise(): Promise<void> {
		return this.loopPromise;
	}

	protected async rawStop(): Promise<void> {
		this.timers.clear();
		await this.loopPromise.catch(() => { });
	}
}

export interface Loop {
	(sleep: Sleep): Promise<void>;
}

export interface Sleep {
	(ms: number): Cancellable;
}

export class InvalidState extends Error {
	public constructor(
		state: ReadyState,
	) {
		super(`Invalid state: ${state}`);
	}
}
