import { Injectable, TemplateRef } from '@angular/core';
import { Store } from '../../../@core';
import { DashboardPersistance } from '../interfaces/dashboard-persistance.abstract';
import { GuiDrag } from '../interfaces/gui-drag.abstract';

@Injectable({
	providedIn: 'root'
})
export class WidgetService extends DashboardPersistance {
	private _widgetsRef: TemplateRef<HTMLElement>[] = [];
	private _widgets: GuiDrag[] = [];

	constructor(private readonly store: Store) {
		super();
	}

	public get widgetsRef(): TemplateRef<HTMLElement>[] {
		return this._widgetsRef;
	}
	public set widgetsRef(value: TemplateRef<HTMLElement>[]) {
		const buffers: GuiDrag[] = [];
		this.widgetsRef.forEach((widgetRef: TemplateRef<HTMLElement>) => {
			this.widgets.forEach((widget: GuiDrag) => {
				if (widgetRef === widget.templateRef) {
					buffers.push(widget);
				}
			});
		});
		this.widgets = buffers;
		this.serialize(this.widgets);
		this._widgetsRef = value;
	}

	public get widgets(): GuiDrag[] {
		return this._widgets;
	}
	public set widgets(value: GuiDrag[]) {
		this._widgets = value;
	}
	public serialize(values: GuiDrag[]): void {
		if (values.length === 0) return;
		const toJson: Partial<GuiDrag>[] = values.map(
			(value: Partial<GuiDrag>) => {
				return {
					position: value.position,
					isCollapse: value.isCollapse,
					isExpand: value.isExpand,
					hide: value.hide,
					title: value.title
				};
			}
		);
		this.store.widgets = toJson;
	}

	public deSerialize(): Partial<GuiDrag>[] {
		return this.store.widgets;
	}
}
