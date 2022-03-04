import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit
} from '@angular/core';
import {
	ICountsStatistics,
	IGetCountsStatistics,
	ITimeLogFilters,
	PermissionsEnum
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pick } from 'underscore';
import { debounceTime, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { isNotEmpty } from '@gauzy/common-angular';
import { Store } from './../../../../@core/services';
import { TimesheetStatisticsService } from '../../../timesheet/timesheet-statistics.service';
import { ReportBaseComponent } from '../../report-base/report-base.component';
import { firstValueFrom } from 'rxjs';
import { EmployeesService } from '../../../../@core/services/employees.service';
import { OrganizationProjectsService } from '../../../../@core/services/organization-projects.service';
import * as moment from 'moment';

@UntilDestroy()
@Component({
	selector: 'ga-daily-statistics',
	templateUrl: './daily-statistics.component.html',
	styleUrls: ['./daily-statistics.component.scss']
})
export class DailyStatisticsComponent
	extends ReportBaseComponent
	implements OnInit, AfterViewInit
{
	PermissionsEnum = PermissionsEnum;
	logRequest: ITimeLogFilters = this.request;
	counts: ICountsStatistics;
	loading: boolean;
	employeesCount: number;
	projectsCount: number;

	@Input()
	set filters(value: ITimeLogFilters) {
		this.logRequest = value;
		this.subject$.next(true);
	}

	constructor(
		private readonly timesheetStatisticsService: TimesheetStatisticsService,
		protected readonly store: Store,
		public readonly translateService: TranslateService,
		private readonly cd: ChangeDetectorRef,
		private readonly employeesService: EmployeesService,
		private readonly projectService: OrganizationProjectsService
	) {
		super(store, translateService);
	}

	ngOnInit() {
		this.subject$
			.pipe(
				debounceTime(300),
				tap(() => (this.loading = true)),
				tap(() => this.getCounts()),
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

	getCounts() {
		if (!this.organization || !this.logRequest) {
			return;
		}
		const appliedFilter = pick(
			this.logRequest,
			'source',
			'activityLevel',
			'logType',
			'startDate',
			'endDate'
		);
		const {
			employeeIds = [],
			projectIds = [],
			tenantId,
			organizationId
		}: ITimeLogFilters = this.getFilterRequest(this.logRequest);
		const request: IGetCountsStatistics = {
			...appliedFilter,
			organizationId,
			tenantId,
			...(isNotEmpty(employeeIds) ? { employeeId: employeeIds[0] } : {}),
			...(isNotEmpty(projectIds) ? { projectId: projectIds[0] } : {})
		};
		this.timesheetStatisticsService
			.getCounts(request)
			.then((resp) => {
				this.counts = resp;
				this.loadEmployeesCount();
				this.loadProjectsCount();
			})
			.finally(() => {
				this.loading = false;
			});
	}

	private async loadEmployeesCount() {
		const { tenantId } = this.store.user;
		const { total } = await firstValueFrom(
			this.employeesService.getAll([], {
				organizationId: this.organization.id,
				tenantId
			})
		);
		this.employeesCount = total;
	}
	private async loadProjectsCount() {
		const { tenantId } = this.store.user;
		const { total } = await this.projectService.getAll([], {
			organizationId: this.organization.id,
			tenantId
		});
		this.projectsCount = total;
	}
  get period() {
    if(this.logRequest){
      const { startDate, endDate } = this.logRequest;
      const start = moment(startDate);
      const end = moment(endDate);
      return end.diff(start, 'days') * 86400;
    }
  }
}
