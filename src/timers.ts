import { TimeEngineLike } from '@zimtsui/time-engine-like';


export class Timers {
	private cancellables = new Set<TimeEngineLike.Cancellable>();

	public push(timer: TimeEngineLike.Cancellable): void {
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
