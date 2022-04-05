import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NbIconModule, NbSpinnerModule, NbCardModule } from '@nebular/theme';
import { WeeklyTimeReportsRoutingModule } from './weekly-time-reports-routing.module';
import { WeeklyTimeReportsComponent } from './weekly-time-reports/weekly-time-reports.component';
import { SharedModule } from '../../../@shared/shared.module';
import { LineChartModule } from '../../../@shared/report/charts/line-chart/line-chart.module';
import { DailyStatisticsModule } from '../../../@shared/report/daily-statistics/daily-statistics.module';
import { HeaderTitleModule } from '../../../@shared/components/header-title/header-title.module';
import { DateRangeTitleModule } from '../../../@shared/components/date-range-title/date-range-title.module';
import { GauzyRangePickerModule } from '../../../@shared/timesheet/gauzy-range-picker/gauzy-range-picker.module';
import {
	ReportTableUserAvatarModule
} from "../../../@shared/report/report-table-user-avatar/report-table-user-avatar.module";

@NgModule({
	declarations: [WeeklyTimeReportsComponent],
	imports: [
		CommonModule,
		SharedModule,
		WeeklyTimeReportsRoutingModule,
		LineChartModule,
		DailyStatisticsModule,
		TranslateModule,
		NbIconModule,
		NbSpinnerModule,
		NbCardModule,
		HeaderTitleModule,
		DateRangeTitleModule,
		GauzyRangePickerModule,
		ReportTableUserAvatarModule,
	],
})
export class WeeklyTimeReportsModule {}
