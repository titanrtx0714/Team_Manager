import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ViewCell } from 'ng2-smart-table';
import { IVisibilityJobPostInput } from '@gauzy/contracts';
import { TranslationBaseComponent } from './../../../../@shared/language-base';

@Component({
	selector: 'job-title-description-details',
	templateUrl: './job-title-description-details.component.html',
	styleUrls: ['./job-title-description-details.component.scss'],
	providers: [CurrencyPipe]
})
export class JobTitleDescriptionDetailsComponent extends TranslationBaseComponent implements ViewCell {

	constructor(
		public readonly translateService: TranslateService
	) {
		super(translateService);
	}

	@Input() rowData: any;
	@Input() hideJobIcon: boolean = true;

	value: string | number;

	@Output() hideJobEvent: EventEmitter<any> = new EventEmitter<any>();

	/**
	 * Icon with link to Job Post
	 *
	 * @returns
	 */
	public openJob() {
		if (!this.rowData) {
			return;
		}
		if (this.rowData?.jobPost) {
			window.open(this.rowData.jobPost.url, '_blank');
		}
	}

	/**
	 * Updates job visibility
	 *
	 */
	public async hideJob(event: Event) {
		const { employeeId, providerCode, providerJobId } = this.rowData;
		this.hideJobEvent.emit({
			hide: true,
			employeeId,
			providerCode,
			providerJobId
		} as IVisibilityJobPostInput);
	}
}
