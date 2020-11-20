import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimeReportsRoutingModule } from './time-reports-routing.module';
import { TimeReportsComponent } from './time-reports/time-reports.component';
import { TimeReportHorizontalBarChartModule } from '../charts/time-report-horizontal-bar-chart/time-report-horizontal-bar-chart.module';
import { SharedModule } from '../../../@shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import {
	NbCardModule,
	NbIconModule,
	NbSelectModule,
	NbSpinnerModule
} from '@nebular/theme';
import { FiltersModule } from '../../../@shared/timesheet/filters/filters.module';
import { FormsModule } from '@angular/forms';
import { DailyGridModule } from '../../../@shared/report/daily-grid/daily-grid.module';
import { DailyStatisticsModule } from '../../../@shared/report/daily-statistics/daily-statistics.module';

@NgModule({
	declarations: [TimeReportsComponent],
	imports: [
		CommonModule,
		SharedModule,
		DailyGridModule,
		DailyStatisticsModule,

		TimeReportsRoutingModule,
		TimeReportHorizontalBarChartModule,
		TranslateModule,
		NbIconModule,
		NbSpinnerModule,
		NbCardModule,
		FiltersModule,
		NbSelectModule,
		FormsModule
	]
})
export class TimeReportsModule {}
