import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from 'apps/gauzy/src/app/@core/services/store.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';
import {
	IOrganization,
	ITimeLogFilters,
	IGetActivitiesInput,
	ActivityType,
	IDailyActivity,
	IActivity
} from '@gauzy/models';
import { debounceTime } from 'rxjs/operators';
import { toUTC, toLocal } from 'libs/utils';
import { ActivityService } from 'apps/gauzy/src/app/@shared/timesheet/activity.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'underscore';
import * as moment from 'moment';
import { TimesheetFilterService } from 'apps/gauzy/src/app/@shared/timesheet/timesheet-filter.service';

@Component({
	selector: 'ngx-app-url-activity',
	styleUrls: ['./app-url-activity.component.scss'],
	templateUrl: './app-url-activity.component.html'
})
export class AppUrlActivityComponent implements OnInit, OnDestroy {
	loading: boolean;
	apps: {
		hour: string;
		activities: IDailyActivity[];
	}[];
	request: any;
	updateLogs$: Subject<any> = new Subject();
	organization: IOrganization;
	type: 'apps' | 'urls';

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private timesheetFilterService: TimesheetFilterService,
		private activityService: ActivityService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params
			.pipe(untilDestroyed(this))
			.subscribe((params) => {
				if (params.type) {
					this.type = params.type;
					this.updateLogs$.next();
				}
			});

		this.store.selectedOrganization$
			.pipe(untilDestroyed(this))
			.subscribe((organization: IOrganization) => {
				this.organization = organization;
				this.updateLogs$.next();
			});

		this.updateLogs$
			.pipe(untilDestroyed(this), debounceTime(500))
			.subscribe(() => {
				this.getLogs();
			});
	}

	prgressStatus(value) {
		if (value <= 25) {
			return 'danger';
		} else if (value <= 50) {
			return 'warning';
		} else if (value <= 75) {
			return 'info';
		} else {
			return 'success';
		}
	}

	async filtersChange($event: ITimeLogFilters) {
		this.request = $event;
		this.timesheetFilterService.filter = $event;
		this.updateLogs$.next();
	}

	loadChild(item: IDailyActivity) {
		const date = toLocal(item.date).format('YYYY-MM-DD') + ' ' + item.time;
		const request: IGetActivitiesInput = {
			startDate: toUTC(date).format('YYYY-MM-DD HH:mm:ss'),
			endDate: toUTC(date).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
			employeeIds: [item.employeeId],
			types: [this.type === 'urls' ? ActivityType.URL : ActivityType.APP],
			titles: [item.title]
		};

		this.activityService.getActivites(request).then((items) => {
			item.childItems = items.map(
				(activite: IActivity): IDailyActivity => {
					return {
						sessions: 1,
						duration: activite.duration,
						employeeId: activite.employeeId,
						date: activite.date,
						title: activite.title,
						description: activite.description,
						durationPercentage:
							(activite.duration * 100) / item.duration
					};
				}
			);
		});
	}

	async getLogs() {
		if (!this.organization) {
			return;
		}

		const { employeeId, startDate, endDate } = this.request;

		const request: IGetActivitiesInput = {
			organizationId: this.organization.id,
			tenantId: this.organization.tenantId,
			...this.request,
			startDate: toUTC(startDate).format('YYYY-MM-DD HH:mm:ss'),
			endDate: toUTC(endDate).format('YYYY-MM-DD HH:mm:ss'),
			...(employeeId ? { employeeId } : {}),
			types: [this.type === 'apps' ? ActivityType.APP : ActivityType.URL]
		};

		this.loading = true;
		this.activityService
			.getDailyActivites(request)
			.then((activities) => {
				this.apps = _.chain(activities)
					.map((activity) => {
						activity.hours = toLocal(
							moment(
								moment(activity.date).format('YYYY-MM-DD') +
									' ' +
									activity.time
							).toDate()
						);
						return activity;
					})
					.groupBy('hours')
					.mapObject((value, key) => {
						const sum = _.reduce(
							value,
							(memo, activitiy) =>
								memo + parseInt(activitiy.duration + '', 10),
							0
						);
						value = value.map((activity) => {
							activity.durationPercentage = parseFloat(
								((activity.duration * 100) / sum).toFixed(1)
							);
							return activity;
						});
						return { hour: key, activities: value };
					})
					.values()
					.value();
			})
			.finally(() => (this.loading = false));
	}

	ngOnDestroy(): void {}
}
