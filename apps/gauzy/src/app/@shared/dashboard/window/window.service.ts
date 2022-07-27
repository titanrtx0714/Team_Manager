import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { filter, tap } from 'rxjs/operators';
import { Store } from '../../../@core';
import { LayoutPersistance } from '../concretes/contexts/layout-persistance.class';
import { PersistanceTakers } from '../concretes/contexts/persistance-takers.class';
import { LocalstorageStrategy } from '../concretes/strategies/localstorage-strategy.class';
import { BackupStrategy } from '../interfaces/backup-strategy.interface';
import { GuiDrag } from '../interfaces/gui-drag.abstract';

@Injectable({
	providedIn: 'root'
})
export class WindowService {
	private _windowsRef: TemplateRef<HTMLElement>[] = [];
	private _windows: GuiDrag[] = [];
	private _windowLayoutPersistance: LayoutPersistance;
	private _windowsTakers: PersistanceTakers;
	private _localStorage: BackupStrategy;
	private _strategy: BackupStrategy;
	private _windows$: Subject<Partial<GuiDrag[]>>;

	constructor(private readonly store: Store) {
		this._windowLayoutPersistance = new LayoutPersistance();
		this._localStorage = new LocalstorageStrategy();
		this._windowsTakers = new PersistanceTakers(
			this._windowLayoutPersistance
		);
		this._windows$ = new Subject();
		this._windows$
			.pipe(
				tap((windows: GuiDrag[]) => (this.windows = windows)),
				tap(() => (this._windowLayoutPersistance.state = this.windows)),
				filter(() => this.windowsRef.length === 0),
				tap(() => {
					this.retrieve().length === 0
						? this.save()
						: this.retrieve().forEach((deserialized: GuiDrag) =>
								this.windowsRef.push(deserialized.templateRef)
						  );
				})
			)
			.subscribe();
	}

	public get windowsRef(): any[] {
		return this._windowsRef;
	}
	public set windowsRef(value: any[]) {
		this._windowsRef = value;
		this.sorting();
	}
	protected sorting(): void {
		const buffers: GuiDrag[] = [];
		this.windowsRef.forEach((windowsRef: TemplateRef<HTMLElement>) => {
			this.windows.forEach((window: GuiDrag) => {
				if (windowsRef === window.templateRef) {
					buffers.push(window);
				}
			});
		});
		this.windows = buffers;
	}
	public get windows(): GuiDrag[] {
		return this._windows;
	}
	public set windows(value: GuiDrag[]) {
		this._windows = value;
	}
	public save(): void {
		if (this.windows.length === 0) return;
		this._windowsTakers.backup();
		this._strategy = this._localStorage;
		this._strategy.serializables = this.windows;
		this.store.widgets = this._strategy.serialize() as Partial<GuiDrag>[];
	}

	public retrieve(): Partial<GuiDrag>[] {
		this._strategy = this._localStorage;
		this._strategy.serializables = this.windows;
		return this._strategy.deSerialize(this.store.windows);
	}

	public undoDrag() {
		this._windowsTakers.undo();
		this.windows = this._windowLayoutPersistance.state as GuiDrag[];
		this.sortingReverse();
		this._strategy = this._localStorage;
		this._strategy.serializables = this.windows;
		this.store.widgets = this._strategy.serialize() as Partial<GuiDrag>[];
	}

	protected sortingReverse(): void {
		const buffers: TemplateRef<HTMLElement>[] = [];
		this.windows.forEach((widget: GuiDrag) => {
			this.windowsRef.forEach((widgetRef: TemplateRef<HTMLElement>) => {
				if (widgetRef === widget.templateRef) {
					buffers.push(widgetRef);
				}
			});
		});
		this.windowsRef = buffers;
	}

	public set windows$(value: Partial<GuiDrag[]>) {
		this._windows$.next(value);
	}
}
