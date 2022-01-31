import {
	Startable,
	ReadyState,
} from 'startable';
import {
	Cancellable,
	SetTimeout,
	ClearTimeout,
} from 'cancellable-sleep';

interface Loop {
	(sleep: Sleep): Promise<void>;
}

interface Sleep {
	(ms: number): Promise<void>;
}

class Pollerloop extends Startable {
	private timers = new Set<Cancellable>();
	private polling?: Promise<void>;

	constructor(
		loop: Loop,
		setTimeout: SetTimeout<any>,
		clearTimeout: ClearTimeout<any>,
	);
	constructor(
		loop: Loop,
	);
	constructor(
		private loop: Loop,
		private setTimeout = globalThis.setTimeout,
		private clearTimeout = globalThis.clearTimeout,
	) {
		super();
	}

	private sleep: Sleep = (ms: number) => {
		if (this.readyState === ReadyState.STOPPING)
			return Promise.reject('stopping');
		const timer = new Cancellable(ms, this.setTimeout, this.clearTimeout);
		this.timers.add(timer);
		return timer.finally(() => {
			this.timers.delete(timer);
		});
	}

	protected async rawStart(): Promise<void> {
		this.polling = this.loop(this.sleep).then(
			() => void this.stop(),
			err => void this.stop(err),
		);
	}

	protected async rawStop(): Promise<void> {
		// https://stackoverflow.com/questions/28306756/is-it-safe-to-delete-elements-in-a-set-while-iterating-with-for-of
		for (const timer of this.timers) timer.cancel();
		await this.polling!;
	}
}

export {
	Pollerloop as default,
	Pollerloop,
	Loop,
	Sleep,
	SetTimeout,
	ClearTimeout,
}
