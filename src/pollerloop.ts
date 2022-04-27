import {
	Startable,
	ReadyState,
} from 'startable';
import {
	Cancellable,
	TimeEngineLike,
	Cancelled,
} from 'cancellable';
import { Timers } from './timers';
import { LoopPromise } from './loop-promise';
import assert = require('assert');



export class Pollerloop {
	private timers = new Timers();
	private loopPromise = new LoopPromise();

	public startable = new Startable(
		() => this.start(),
		() => this.stop(),
	);

	public constructor(
		private loop: Loop,
		private engine: TimeEngineLike,
	) { }

	private sleep: Sleep = (ms: number): Cancellable => {
		assert(
			this.startable.getReadyState() === ReadyState.STARTING ||
			this.startable.getReadyState() === ReadyState.STARTED,
			new InvalidState(this.startable.getReadyState()),
		);
		const timer = new Cancellable(
			ms,
			this.engine,
		);
		this.timers.add(timer);
		return timer;
	}

	protected async start(): Promise<void> {
		this.loop(this.sleep).then(
			() => this.loopPromise.resolve(),
			(err: Error) => this.loopPromise.reject(err),
		);
		this.loopPromise.then(
			() => this.startable.starp(),
			err => this.startable.starp(err),
		);
	}

	public getLoopPromise(): Promise<void> {
		return this.loopPromise;
	}

	protected async stop(): Promise<void> {
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

export {
	Cancelled,
	Cancellable,
	TimeEngineLike,
}
