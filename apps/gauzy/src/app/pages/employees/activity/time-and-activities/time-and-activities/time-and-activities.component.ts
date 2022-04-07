import { Component, OnInit } from '@angular/core';
import { ITimeLogFilters } from '@gauzy/contracts';
import { TimesheetFilterService } from 'apps/gauzy/src/app/@shared/timesheet/timesheet-filter.service';

@Component({
	selector: 'gauzy-time-and-activities',
	templateUrl: './time-and-activities.component.html',
	styleUrls: ['./time-and-activities.component.scss']
})
export class TimeAndActivitiesComponent implements OnInit {
	
	filters: ITimeLogFilters;

	constructor(
		private readonly timesheetFilterService: TimesheetFilterService
	) {}

	filtersChange(filters: ITimeLogFilters) {
		this.timesheetFilterService.filter = filters;
		this.filters = Object.assign({}, filters);
	}

	ngOnInit(): void {}
}
