import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	OnInit,
	ViewChild
} from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs/internal/Observable';
import { filter, tap } from 'rxjs/operators';
import { GuiDrag } from '../interfaces/gui-drag.abstract';
import { WindowService } from './window.service';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-window',
	templateUrl: './window.component.html',
	styleUrls: ['./window.component.scss']
})
export class WindowComponent extends GuiDrag implements OnInit, AfterViewInit {
	private _windowDragEnded: Observable<any>;
	@ViewChild(NbPopoverDirective)
	private _windowPopover: NbPopoverDirective;
	@ViewChild('window')
	private _element: ElementRef;

	constructor(private readonly windowService: WindowService) {
		super();
	}
	ngAfterViewInit(): void {
		if (this._element) {
			const win: HTMLElement = this._element.nativeElement;
			const title: any = win.querySelector('nb-card-header');
			if (title) this.title = title.innerText;
		}
	}

	ngOnInit(): void {
		this.windowDragEnded
			.pipe(
				filter((event) => !!event),
				tap(() => (this.move = false)),
				untilDestroyed(this)
			)
			.subscribe();
		this.windowService.windows.forEach((window: GuiDrag) => {
			if (window.templateRef === this.templateRef) {
				this.isCollapse = window.isCollapse;
				this.isExpand = window.isExpand;
			}
		});
	}

	public onClickSetting(event: boolean) {
		if (event) {
			this._windowPopover.hide();
			this.windowService.serialize();
		}
	}

	public get windowDragEnded(): Observable<any> {
		return this._windowDragEnded;
	}

	@Input()
	public set windowDragEnded(value: Observable<any>) {
		this._windowDragEnded = value;
	}
}
