import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	IGetTimeLimitReportInput,
	ITimeLimitReport,
	ITimeLogFilters
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from 'apps/gauzy/src/app/@core/services/store.service';
import { TimesheetService } from 'apps/gauzy/src/app/@shared/timesheet/timesheet.service';
import { debounceTime, tap } from 'rxjs/operators';
import { ReportBaseComponent } from 'apps/gauzy/src/app/@shared/report/report-base/report-base.component';
import { TranslateService } from '@ngx-translate/core';
import { Arrow } from 'apps/gauzy/src/app/@shared/report/common/arrow.class';

@UntilDestroy()
@Component({
	selector: 'ga-time-limit-report',
	templateUrl: './time-limit-report.component.html',
	styleUrls: ['./time-limit-report.component.scss']
})
export class TimeLimitReportComponent
	extends ReportBaseComponent
	implements OnInit, AfterViewInit {
	logRequest: IGetTimeLimitReportInput = {
		...this.request,
		duration: 'day'
	};
	filters: ITimeLogFilters;
	loading: boolean;
	dailyData: any;
	title: string;
  arrow: Arrow;
  isDisable : boolean;

	constructor(
		private cd: ChangeDetectorRef,
		private timesheetService: TimesheetService,
		private activatedRoute: ActivatedRoute,
		protected store: Store,
		readonly translateService: TranslateService
	) {
		super(store, translateService);
    this.arrow = new Arrow(this.logRequest);
	}

	ngOnInit(): void {
		this.subject$
			.pipe(
				debounceTime(300),
				tap(() => this.loading = true),
				tap(() => this.getLogs()),
				untilDestroyed(this)
			)
			.subscribe();
		this.activatedRoute.data
			.pipe(untilDestroyed(this))
			.subscribe((data) => {
				this.logRequest.duration = data.duration || 'day';
				this.title = data.title;
			});
	}

	ngAfterViewInit() {
		this.cd.detectChanges();
	}

	filtersChange($event) {
		this.logRequest = $event;
		this.filters = Object.assign({}, this.logRequest);
		this.subject$.next(true);
	}

  next(){
    this.arrow.setLogRequest = this.logRequest;
    this.logRequest = this.arrow.next(this.today);
    this.isDisable = this.arrow.isDisable;
    this.cd.detectChanges();
  }

  previous(){
    this.arrow.setLogRequest = this.logRequest;
    this.logRequest = this.arrow.previous();
    this.isDisable = this.arrow.isDisable;
    this.cd.detectChanges();
  }

	getLogs() {
		const { duration } = this.logRequest;
		const request: IGetTimeLimitReportInput = {
			...this.getFilterRequest(this.logRequest),
			duration,
			relations: ['task', 'project', 'employee', 'employee.user']
		};
		this.timesheetService
			.getTimeLimit(request)
			.then((logs: ITimeLimitReport[]) => {
				this.dailyData = logs;
			})
			.finally(() => (this.loading = false));
	}
}
