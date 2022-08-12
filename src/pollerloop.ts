import {
	createStartable,
	ReadyState,
	StateError,
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
		this.$s.assertReadyState(
			'sleep',
			[ReadyState.STARTING, ReadyState.STARTED],
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
			() => this.$s.stop(),
			err => this.$s.stop(err),
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
			new StateError(
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
