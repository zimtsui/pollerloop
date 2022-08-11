import {
	createStartable,
	ReadyState,
	IncorrectState,
} from 'startable';
import {
	TimeEngineLike,
	Cancellable,
} from 'time-engine-like';
import { Timers } from './timers';
import assert = require('assert');



export class Pollerloop {
	public $s = createStartable(
		() => this.rawStart(),
		() => this.rawStop(),
	);

	private timers = new Timers();
	private loopPromise?: Promise<void>;


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
		this.loopPromise = this.loop(this.sleep);
		this.loopPromise.then(
			() => this.$s.starp(),
			err => this.$s.starp(err),
		);
	}

	protected async rawStop(): Promise<void> {
		this.timers.clear();
		if (this.loopPromise)
			await this.loopPromise.catch(() => { });
	}

	public getLoopPromise(): Promise<void> {
		assert(
			this.$s.getReadyState() !== ReadyState.READY,
			new IncorrectState(
				'getLoopPromise',
				this.$s.getReadyState(),
			),
		);
		return this.loopPromise!;
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
