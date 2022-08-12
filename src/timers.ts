import { Cancellable } from 'time-engine-like';


export class Timers {
	private cancellables = new Set<Cancellable>();

	public push(timer: Cancellable): void {
		this.cancellables.add(timer);
		timer.finally(() => {
			this.cancellables.delete(timer);
		}).catch(() => { });
	}

	public clear(err: Error): void {
		for (const timer of this.cancellables)
			timer.cancel(err);
		this.cancellables.clear();
	}
}
