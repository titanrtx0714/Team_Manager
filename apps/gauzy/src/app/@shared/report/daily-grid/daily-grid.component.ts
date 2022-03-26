import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Input,
	OnDestroy,
	OnInit
} from '@angular/core';
import {
	IGetTimeLogReportInput,
	IReportDayData,
	ITimeLogFilters,
	ReportGroupByFilter,
	ReportGroupFilterEnum
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, tap } from 'rxjs/operators';
import { pick } from 'underscore';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '../../../@core/services/store.service';
import { TimesheetService } from '../../timesheet/timesheet.service';
import { ReportBaseComponent } from '../report-base/report-base.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-daily-grid',
	templateUrl: './daily-grid.component.html',
	styleUrls: ['./daily-grid.component.scss']
})
export class DailyGridComponent extends ReportBaseComponent
	implements OnInit, AfterViewInit, OnDestroy {
	
	logRequest: ITimeLogFilters = this.request;
	dailyLogs: IReportDayData[] = [];
	loading: boolean;
	groupBy: ReportGroupByFilter = ReportGroupFilterEnum.date;
	ReportGroupFilterEnum = ReportGroupFilterEnum;

	@Input()
	set filters(value: ITimeLogFilters) {
		if (value) {
			this.logRequest = value;
			this.subject$.next(true);
		}
	}

	constructor(
		private readonly timesheetService: TimesheetService,
		protected readonly store: Store,
		public readonly translateService: TranslateService,
		private readonly cd: ChangeDetectorRef
	) {
		super(store, translateService);
	}

	ngOnInit() {
		this.subject$
			.pipe(
				debounceTime(500),
				tap(() => this.getLogs()),
				untilDestroyed(this),
			)
			.subscribe();
	}

	ngAfterViewInit() {
		this.cd.detectChanges();
	}
	
	groupByChange() {
		this.subject$.next(true);
	}

	async getLogs() {
		if (!this.organization || !this.logRequest) {
			return;
		}
		this.loading = true;
		const appliedFilter = pick(
			this.logRequest,
			'source',
			'activityLevel',
			'logType'
		);
		const request: IGetTimeLogReportInput = {
			...appliedFilter,
			...this.getFilterRequest(this.logRequest),
			groupBy: this.groupBy
		}

		try {
			const logs: IReportDayData[] = await this.timesheetService.getDailyReport(request);
			this.dailyLogs = logs;
		} catch (error) {
			console.log('Error while retrieving daily logs report', error);
		} finally {
			this.loading = false;
		}
	}

	ngOnDestroy() {}
}
