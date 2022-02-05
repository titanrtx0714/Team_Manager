import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit
} from '@angular/core';
import {
	IGetPaymentInput,
	IGetTimeLogReportInput,
	IProjectBudgetLimitReport,
	OrganizationProjectBudgetTypeEnum,
	ReportGroupByFilter,
	ReportGroupFilterEnum
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
	selector: 'ga-project-budgets-report',
	templateUrl: './project-budgets-report.component.html',
	styleUrls: ['./project-budgets-report.component.scss']
})
export class ProjectBudgetsReportComponent
	extends ReportBaseComponent
	implements OnInit, AfterViewInit {
	logRequest: IGetPaymentInput = this.request;
	loading: boolean;
	groupBy: ReportGroupByFilter = ReportGroupFilterEnum.date;
	filters: IGetPaymentInput;
	OrganizationProjectBudgetTypeEnum = OrganizationProjectBudgetTypeEnum;
	projects: IProjectBudgetLimitReport[];
  arrow: Arrow;
  isDisable : boolean;

	constructor(
		private timesheetService: TimesheetService,
		protected store: Store,
		readonly translateService: TranslateService,
		private cd: ChangeDetectorRef
	) {
		super(store, translateService);
    this.arrow = new Arrow(this.logRequest);
	}

	ngOnInit() {
		this.subject$
			.pipe(
				debounceTime(500),
				tap(() => this.getReportData()),
				untilDestroyed(this)
			)
			.subscribe();
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

	async getReportData() {
		if (!this.organization || !this.logRequest) {
			return;
		}
		const request: IGetTimeLogReportInput = {
			...this.getFilterRequest(this.logRequest),
			groupBy: this.groupBy
		};
		this.loading = true;
		this.timesheetService
			.getProjectBudgetLimit(request)
			.then((logs: IProjectBudgetLimitReport[]) => {
				this.projects = logs;
			})
			.catch(() => {})
			.finally(() => (this.loading = false));
	}
}
