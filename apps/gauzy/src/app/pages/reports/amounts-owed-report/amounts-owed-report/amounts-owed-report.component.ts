import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	OnInit,
	ViewChild
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { pluck } from 'underscore';
import * as moment from 'moment';
import { IGetExpenseInput, ReportGroupFilterEnum, ReportGroupByFilter, ITimeLogFilters, IGetTimeLogReportInput } from '@gauzy/contracts';
import { distinctUntilChange, isEmpty } from '@gauzy/common-angular';
import { DateRangePickerBuilderService, Store } from './../../../../@core/services';
import { TimesheetService } from './../../../../@shared/timesheet/timesheet.service';
import { BaseSelectorFilterComponent } from './../../../../@shared/timesheet/gauzy-filters/base-selector-filter/base-selector-filter.component';
import { IChartData } from './../../../../@shared/report/charts/line-chart';
import { ChartUtil } from './../../../../@shared/report/charts/line-chart/chart-utils';
import { TimesheetFilterService } from './../../../../@shared/timesheet';
import { GauzyFiltersComponent } from './../../../../@shared/timesheet/gauzy-filters/gauzy-filters.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-amounts-owed-report',
	templateUrl: './amounts-owed-report.component.html',
	styleUrls: ['./amounts-owed-report.component.scss']
})
export class AmountsOwedReportComponent extends BaseSelectorFilterComponent
	implements OnInit, AfterViewInit {

	public filters: IGetExpenseInput;
	public loading: boolean = false;
	public charts: IChartData;
	public groupBy: ReportGroupByFilter = ReportGroupFilterEnum.date;

	public datePickerConfig$: Observable<any> = this.dateRangePickerBuilderService.datePickerConfig$;
	public payloads$: BehaviorSubject<ITimeLogFilters> = new BehaviorSubject(null);

	@ViewChild(GauzyFiltersComponent) gauzyFiltersComponent: GauzyFiltersComponent;

	constructor(
		private readonly timesheetService: TimesheetService,
		private readonly cd: ChangeDetectorRef,
		protected readonly store: Store,
		public readonly translateService: TranslateService,
		private readonly timesheetFilterService: TimesheetFilterService,
		protected readonly dateRangePickerBuilderService: DateRangePickerBuilderService
	) {
		super(store, translateService, dateRangePickerBuilderService);
	}

	ngOnInit() {
		this.subject$
			.pipe(
				// Filters out emissions when the organization is falsy
				filter(() => !!this.organization),
				// Performs a side effect: invokes the prepareRequest() method
				tap(() => this.prepareRequest()),
				// Ensures that the subscription is automatically unsubscribed when the component is destroyed
				untilDestroyed(this)
			)
			// Subscribes to the observable
			.subscribe();
		this.payloads$
			.pipe(
				// Ensures that consecutive emissions are distinct
				distinctUntilChange(),
				// Filters out falsy payloads
				filter((payloads: ITimeLogFilters) => !!payloads),
				// Performs a side effect: invokes the updateChart() method
				tap(() => this.updateChart()),
				// Ensures that the subscription is automatically unsubscribed when the component is destroyed
				untilDestroyed(this)
			)
			// Subscribes to the observable
			.subscribe();
	}

	ngAfterViewInit() {
		this.cd.detectChanges();
	}

	/**
	 * Prepares a request for a time log report and emits it to the 'payloads$' observable.
	 * If the request or filters are empty, the method does nothing.
	 *
	 * @returns
	 */
	prepareRequest() {
		// Check if either the request or filters are empty
		if (isEmpty(this.request) || isEmpty(this.filters)) {
			return; // Do nothing if either is empty
		}

		// Determine the current timezone using moment-timezone
		const timezone = moment.tz.guess();

		// Construct the request for the time log report
		const request: IGetTimeLogReportInput = {
			...this.getFilterRequest(this.request), // Assuming this is a method to process the request
			groupBy: this.groupBy,
			timezone // Set the 'timezone' property to the determined timezone
		};

		// Emit the prepared request to the 'payloads$' observable
		this.payloads$.next(request);
	}

	/**
	 * Handles changes in Gauzy timesheet filters.
	 * @param filters - The updated filters.
	 */
	filtersChange(filters: ITimeLogFilters) {
		// Check if the 'saveFilters' property of 'gauzyFiltersComponent' is truthy
		if (this.gauzyFiltersComponent.saveFilters) {
			// If true, set the 'filter' property of 'timesheetFilterService' to the updated filters
			this.timesheetFilterService.filter = filters;
		}

		// Create a shallow copy of the updated filters and assign it to the 'filters' property
		this.filters = Object.assign({}, filters);

		// Emit a signal to the 'subject$' observable, indicating that filters have changed
		this.subject$.next(true);
	}

	/**
	 * Updates the chart with data for the amount owed report.
	 * @returns A Promise that resolves when the chart is successfully updated.
	 */
	async updateChart(): Promise<void> {
		// Check if the organization or request is not provided; resolve the Promise without further action
		if (!this.organization || isEmpty(this.request)) {
			return;
		}

		// Set the loading flag to true
		this.loading = true;

		try {
			// Get the current payloads from the observable
			const payloads = this.payloads$.getValue();

			// Fetch the owed amount report data from the timesheetService
			const logs: any = await this.timesheetService.getOwedAmountReportChartData(payloads);

			// Build datasets for the chart
			const datasets = [{
				label: this.getTranslation('REPORT_PAGE.AMOUNT'), // Label for the dataset
				data: logs.map((log: any) => log.value),          // Array of data points
				borderColor: ChartUtil.CHART_COLORS.red,           // Color of the dataset border
				backgroundColor: ChartUtil.transparentize(ChartUtil.CHART_COLORS.red, 1), // Background color with transparency
				borderWidth: 2,               // Width of the dataset border
				pointRadius: 2,              // Radius of the data points
				pointHoverRadius: 4,         // Radius of the data points on hover
				pointHoverBorderWidth: 4,    // Width of the border of data points on hover
				tension: 0.4,                // Tension of the spline curve connecting data points
				fill: false                  // Whether to fill the area under the line or not
			}];

			// Update the 'chartData' property with the processed data
			this.charts = {
				labels: pluck(logs, 'date'),
				datasets
			};
		} catch (error) {
			// Log any errors during the process
			console.error('Error while retrieving amounts owed chart', error);
		} finally {
			// Set the loading flag to false, regardless of success or failure
			this.loading = false;
		}
	}
}
