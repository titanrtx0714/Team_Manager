import {
	Component,
	OnInit,
	Input,
	OnDestroy,
	Output,
	EventEmitter
} from '@angular/core';
import {
	OrganizationPermissionsEnum,
	ITimeSlot,
	IScreenshot
} from '@gauzy/contracts';
import { NbDialogService } from '@nebular/theme';
import { TimesheetService } from '../../timesheet.service';
import { GalleryItem } from '../../../gallery/gallery.directive';
import { toLocal } from '@gauzy/common-angular';
import { ViewScreenshotsModalComponent } from '../view-screenshots-modal/view-screenshots-modal.component';
import * as _ from 'underscore';

@Component({
	selector: 'ngx-screenshots-item',
	templateUrl: './screenshots-item.component.html',
	styleUrls: ['./screenshots-item.component.scss']
})
export class ScreenshotsItemComponent implements OnInit, OnDestroy {
	private _screenshots: IScreenshot[] = [];
	private _timeSlot: ITimeSlot;
	OrganizationPermissionsEnum = OrganizationPermissionsEnum;

	@Input() selectionMode = false;
	@Input() galleryItems: GalleryItem[] = [];
	@Input() isSelected: boolean;

	@Output() delete: EventEmitter<any> = new EventEmitter();
	@Output() toggle: EventEmitter<any> = new EventEmitter();

	@Input()
	public get timeSlot(): ITimeSlot {
		return this._timeSlot;
	}
	public set timeSlot(timeSlot: ITimeSlot) {
		if (timeSlot) {
			timeSlot.localStartedAt = toLocal(timeSlot.startedAt).toDate();
			timeSlot.localStoppedAt = toLocal(timeSlot.stoppedAt).toDate();

			this._timeSlot = timeSlot;

			const screenshots = JSON.parse(
				JSON.stringify(timeSlot.screenshots)
			);
			this._screenshots = _.sortBy(screenshots, 'createdAt').reverse();
			if (this._screenshots.length) {
				const [last] = this._screenshots;
				this.lastScreenshot = last;
			}
		}
	}

	private _lastScreenshot: IScreenshot;
	public get lastScreenshot(): IScreenshot {
		return this._lastScreenshot;
	}
	public set lastScreenshot(screenshot: IScreenshot) {
		this._lastScreenshot = screenshot;
	}

	constructor(
		private nbDialogService: NbDialogService,
		private timesheetService: TimesheetService
	) {}

	ngOnInit(): void {}

	toggleSelect(slotId): void {
		this.toggle.emit(slotId);
	}

	progressStatus(value) {
		if (value <= 25) {
			return 'danger';
		} else if (value <= 50) {
			return 'warning';
		} else if (value <= 75) {
			return 'info';
		} else {
			return 'success';
		}
	}

	deleteSlot(timeSlot) {
		this.timesheetService.deleteTimeSlots([timeSlot.id]).then(() => {
			this.delete.emit();
		});
	}

	viewInfo(timeSlot) {
		this.nbDialogService.open(ViewScreenshotsModalComponent, {
			context: { timeSlot }
		});
	}

	ngOnDestroy(): void {}
}
