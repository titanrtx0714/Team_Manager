import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit
} from '@angular/core';
import { IGetExpenseInput, ITimeLogFilters, ReportGroupByFilter, ReportGroupFilterEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, tap } from 'rxjs/operators';
import { pluck } from 'underscore';
import { isEmpty } from '@gauzy/common-angular';
import { ExpensesService, Store } from './../../../../@core/services';
import { ReportBaseComponent } from './../../../../@shared/report/report-base/report-base.component';
import { IChartData } from './../../../../@shared/report/charts/line-chart/line-chart.component';
import { ChartUtil } from './../../../../@shared/report/charts/line-chart/chart-utils';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-expenses-report',
	templateUrl: './expenses-report.component.html',
	styleUrls: ['./expenses-report.component.scss']
})
export class ExpensesReportComponent extends ReportBaseComponent 
	implements OnInit, AfterViewInit {
		
	logRequest: IGetExpenseInput = this.request;
	loading: boolean;
	chartData: IChartData;
	groupBy: ReportGroupByFilter = ReportGroupFilterEnum.date;
	filters: IGetExpenseInput;

	constructor(
		private readonly expensesService: ExpensesService,
		private readonly cd: ChangeDetectorRef,
		protected readonly store: Store,
		public readonly translateService: TranslateService
	) {
		super(store, translateService);
	}

	ngOnInit() {
		this.subject$
			.pipe(
				debounceTime(300),
				tap(() => this.updateChart()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngAfterViewInit() {
		this.cd.detectChanges();
	}

	filtersChange(filters: ITimeLogFilters) {
		this.logRequest = filters;
		this.filters = Object.assign(
			{},
			this.logRequest,
			this.getAdjustDateRangeFutureAllowed(this.logRequest)
		);
		this.subject$.next(true);
	}

	updateChart() {
		if (!this.organization || isEmpty(this.logRequest)) {
			return;
		}
		this.loading = true;
		const request: IGetExpenseInput = {
			...this.getFilterRequest(this.logRequest),
			groupBy: this.groupBy
		};
		this.expensesService
			.getReportChartData(request)
			.then((logs: any[]) => {
				const datasets = [{
					label: this.getTranslation('REPORT_PAGE.EXPENSE'),
					data: logs.map((log) => log.value['expense']),
					borderColor: ChartUtil.CHART_COLORS.red,
					backgroundColor: ChartUtil.transparentize(ChartUtil.CHART_COLORS.red, 0.5),
					borderWidth: 1
				}];
				this.chartData = {
					labels: pluck(logs, 'date'),
					datasets
				};
			})
			.finally(() => (this.loading = false));
	}
}
