import { Cancellable } from 'cancellable';


export class Timers extends Set<Cancellable> {
	public add(timer: Cancellable): this {
		super.add(timer);
		timer.finally(() => {
			this.delete(timer);
		}).catch(() => { });
		return this;
	}

	public clear(): void {
		for (const timer of this)
			timer.cancel();
		super.clear();
	}
}