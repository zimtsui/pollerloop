import {
	ReadyState,
	StateError,
	AsRawStart,
	AsRawStop,
	$,
} from '@zimtsui/startable';
import {
	TimeEngineLike,
	Cancellable,
} from 'time-engine-like';
import { Timers } from './timers';



export class Pollerloop {
	private timers = new Timers();
	private loopPromise?: Promise<void>;


	public constructor(
		private loop: Loop,
		private engine: TimeEngineLike,
	) { }

	private sleep: Sleep = (ms: number): Cancellable => {
		$(this).assertState(
			[ReadyState.STARTING, ReadyState.STARTED],
		);
		const timer = new Cancellable(
			ms,
			this.engine,
		);
		this.timers.push(timer);
		return timer;
	}

	@AsRawStart()
	protected async rawStart(): Promise<void> {
		this.loopPromise = this.loop(this.sleep);
		this.loopPromise.then(
			() => $(this).stop(),
			err => $(this).stop(err),
		);
	}

	@AsRawStop()
	protected async rawStop(): Promise<void> {
		this.timers.clear(new StateError(
			ReadyState.STOPPING,
		));
		if (this.loopPromise)
			await this.loopPromise.catch(() => { });
	}
}

export interface Loop {
	(sleep: Sleep): Promise<void>;
}

export interface Sleep {
	(ms: number): Cancellable;
}
