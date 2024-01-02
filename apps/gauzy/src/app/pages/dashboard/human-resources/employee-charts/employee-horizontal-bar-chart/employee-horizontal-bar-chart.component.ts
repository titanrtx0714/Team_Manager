import { Component, Input, OnDestroy, OnInit, OnChanges, ViewChild } from '@angular/core';
import { IMonthAggregatedEmployeeStatistics, IOrganization } from '@gauzy/contracts';
import { NbJSThemeOptions, NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { distinctUntilChange } from '@gauzy/common-angular';
import { TranslationBaseComponent } from './../../../../../@shared/language-base/translation-base.component';
import { Store } from './../../../../../@core/services';
import { months } from './../../../../../@core/moment-extend';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-employee-horizontal-bar-chart',
	template: `
		<ng-template [ngIf]="employeeStatistics.length" [ngIfElse]="chartNotFoundTemplate">
			<canvas
				style="height: 500px; width: 500px;"
				baseChart
				[data]="data"
				[options]="baseChartOptions"
				[legend]="baseChartLegend"
				[type]="baseChartType"
			></canvas>
		</ng-template>
		<ng-template #chartNotFoundTemplate>
			<div class="title">
				<nb-icon icon="info-outline"></nb-icon>
				<div>
					{{ 'DASHBOARD_PAGE.CHARTS.NO_MONTH_DATA' | translate }}
				</div>
			</div>
		</ng-template>
	`,
	styles: [
		`
			:host {
				.title {
					display: flex;
					flex-direction: column;
					align-items: center;
				}
			}
		`
	]
})
export class EmployeeHorizontalBarChartComponent extends TranslationBaseComponent implements OnInit, OnDestroy, OnChanges {

	public baseChartType: ChartType = 'bar';
	public baseChartLegend: boolean = true;
	public baseChartOptions: ChartConfiguration['options'];
	public data: ChartConfiguration['data'];

	public organization: IOrganization;
	public labels: string[] = [];
	public statistics = {
		income: [] as number[],
		expense: [] as number[],
		profit: [] as number[],
		bonus: [] as number[],
	};

	/**
	 * Private property to store employee statistics data.
	 */
	private _employeeStatistics: IMonthAggregatedEmployeeStatistics[] = [];
	/**
	 * Getter for the employeeStatistics property.
	 */
	public get employeeStatistics(): IMonthAggregatedEmployeeStatistics[] {
		return this._employeeStatistics;
	}
	/**
	 * Setter for the employeeStatistics property with an @Input decorator.
	 * It updates the chart if the baseChartDirective and chart properties exist.
	 * @param value The new value for the employeeStatistics property.
	 */
	@Input() public set employeeStatistics(value: IMonthAggregatedEmployeeStatistics[]) {
		// Set the private property with the provided value
		this._employeeStatistics = value || [];
		// Check if the baseChartDirective and chart properties exist
		if (this.baseChartDirective && this.baseChartDirective.chart) {
			// If they exist, update the chart
			this.baseChartDirective.chart.update();
		}
	}

	@ViewChild(BaseChartDirective, { static: false }) baseChartDirective: BaseChartDirective;

	constructor(
		private readonly themeService: NbThemeService,
		public readonly translateService: TranslateService,
		private readonly _store: Store,
	) {
		super(translateService);
	}

	ngOnInit() {
		this._store.selectedOrganization$
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				filter((organization: IOrganization) => !!organization),
				tap((organization: IOrganization) => this.organization = organization),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngOnChanges() {
		const jsTheme$ = this.themeService.getJsTheme();
		jsTheme$
			.pipe(
				debounceTime(200),
				// Tap into the stream to execute a side effect (initialize the chart)
				tap((config: NbJSThemeOptions) => {
					this._getChartStatistics();
					this._initializeChart(config);
				}),
				// Automatically unsubscribe when the component is destroyed
				untilDestroyed(this)
			)
			.subscribe();
	}

	/**
	 * Initializes a Chart with the given configuration options.
	 * @param config - The configuration options for the Chart, including theme variables.
	 */
	private _initializeChart(config: NbJSThemeOptions) {
		// Step 1: Extract chartjs configuration from theme variables
		const chartJs: any = config.variables.chartjs;

		// Step 2: Set the overall chart options
		this.baseChartOptions = {
			responsive: true, // Makes the chart responsive
			maintainAspectRatio: false, // Allows adjusting the aspect ratio
			indexAxis: 'y',
			// Elements options apply to all of the options unless overridden in a dataset
			// In this case, we are setting the border of each horizontal bar to be 2px wide
			elements: {
				bar: {
					borderWidth: 2
				},
			},
			plugins: {
				legend: {
					position: 'right',
					labels: {
						color: chartJs.textColor,
						usePointStyle: false
					},
				},
				tooltip: {
					enabled: true
				}
			},
			scales: {
				// Step 7: Configure x-axis scale
				x: {
					grid: {
						display: true,
						color: chartJs.axisLineColor,
					},
					ticks: {
						color: chartJs.textColo
					}
				},
				// Step 8: Configure y-axis scale
				y: {
					grid: {
						display: true,
						color: chartJs.axisLineColor
					},
					ticks: {
						color: chartJs.textColor
					},
				},
			}
		};

		// Step 13: Update the chart if it exists
		if (this.baseChartDirective && this.baseChartDirective.chart) {
			this.baseChartDirective.chart.update();
		}

		this._initializeChartDataset();
	}

	/**
	 * Determines the colors for bonus values.
	 * Negative values are represented in red, positive values in blue.
	 * @returns An array of color codes.
	 */
	private getBonusColors(): string[] {
		return this.statistics.bonus.map((val) => (val < 0 ? 'red' : '#0091ff'));
	}

	/**
	 * Determines the colors for profit values.
	 * Negative values are represented in orange, positive values in green.
	 * @returns An array of color codes.
	 */
	private getProfitColors(): string[] {
		return this.statistics.profit.map((val) => (val < 0 ? '#ff7b00' : '#66de0b'));
	}

	/**
	 * Initializes the chart dataset with appropriate colors and labels.
	 */
	private _initializeChartDataset(): void {
		// Get colors for bonus and profit based on their values
		const bonusColors = this.getBonusColors();
		const profitColors = this.getProfitColors();

		// Set up the 'data' object for the chart with labels and datasets
		this.data = {
			labels: this.labels,
			datasets: [
				{
					label: this.getTranslation('DASHBOARD_PAGE.CHARTS.REVENUE'),
					backgroundColor: '#089c17', // Background color for the revenue dataset
					data: this.statistics.income // Data values for the revenue dataset
				},
				{
					label: this.getTranslation('DASHBOARD_PAGE.CHARTS.EXPENSES'),
					backgroundColor: '#dbc300', // Background color for the expenses dataset
					data: this.statistics.expense // Data values for the expenses dataset
				},
				{
					label: this.getTranslation('DASHBOARD_PAGE.CHARTS.PROFIT'),
					backgroundColor: profitColors, // Background colors for the profit dataset
					data: this.statistics.profit // Data values for the profit dataset
				},
				{
					label: this.getTranslation('DASHBOARD_PAGE.CHARTS.BONUS'),
					backgroundColor: bonusColors, // Background colors for the bonus dataset
					data: this.statistics.bonus // Data values for the bonus dataset
				}
			].map((dataset) => ({
				...dataset,
				borderWidth: 0 // Set the border width for each dataset to 0
			}))
		};
	}


	/**
	 * Populates the local statistics variables with input employeeStatistics data.
	 */
	private async _getChartStatistics() {
		// Function to map specific statistics key from each item in employeeStatistics
		const mapStatistics = (key: string) => (this.employeeStatistics ?? []).map((stat) => stat[key]);

		// Function to generate labels based on month names and year
		const mapMonthLabel = (stat: any) => `${months[stat.month]} '${stat.year.toString(10).substring(2)}`;

		// Populate labels array by mapping each item using mapMonthLabel function
		this.labels = (this.employeeStatistics ?? []).map(mapMonthLabel) || [];

		// Populate statistics object with income, expense, profit, and bonus properties
		this.statistics = {
			income: mapStatistics('income'),
			expense: mapStatistics('expense'),
			profit: mapStatistics('profit'),
			bonus: mapStatistics('bonus'),
		};
	}

	ngOnDestroy() { }
}
