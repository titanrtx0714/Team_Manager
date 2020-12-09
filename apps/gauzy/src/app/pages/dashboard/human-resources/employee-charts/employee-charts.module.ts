import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbIconModule, NbSelectModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'angular2-chartjs';
import {
	HttpLoaderFactory,
	ThemeModule
} from 'apps/gauzy/src/app/@theme/theme.module';
import { EmployeeChartsComponent } from './employee-charts.component';
import { EmployeeDoughnutChartComponent } from './employee-doughnut-chart/employee-doughnut-chart.component';
import { EmployeeHorizontalBarChartComponent } from './employee-horizontal-bar-chart/employee-horizontal-bar-chart.component';
import { EmployeeStackedBarChartComponent } from './employee-stacked-bar-chart/employee-stacked-bar-chart.component';

@NgModule({
	imports: [
		ThemeModule,
		ChartModule,
		NbIconModule,
		NbSelectModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	exports: [EmployeeChartsComponent],
	declarations: [
		EmployeeChartsComponent,
		EmployeeHorizontalBarChartComponent,
		EmployeeStackedBarChartComponent,
		EmployeeDoughnutChartComponent
	]
})
export class EmployeeChartsModule {}
