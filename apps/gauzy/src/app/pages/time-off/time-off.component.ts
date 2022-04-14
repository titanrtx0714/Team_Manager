import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import {
	StatusTypesEnum,
	ITimeOff,
	ComponentLayoutStyleEnum,
	IOrganization,
	IEmployeeJobsStatisticsResponse,
	IDateRangePicker
} from '@gauzy/contracts';
import { debounceTime, filter, first, tap, finalize } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/common-angular';
import { ComponentEnum } from '../../@core/constants';
import { Store, TimeOffService, ToastrService } from '../../@core/services';
import { TimeOffHolidayMutationComponent, TimeOffRequestMutationComponent } from '../../@shared/time-off';
import { DeleteConfirmationComponent } from '../../@shared/user/forms';
import { TranslationBaseComponent } from '../../@shared/language-base';
import { StatusBadgeComponent } from '../../@shared/status-badge';
import { AvatarComponent } from '../../@shared/components/avatar/avatar.component';
import { DateViewComponent } from '../../@shared/table-components';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-time-off',
	templateUrl: './time-off.component.html',
	styleUrls: ['./time-off.component.scss']
})
export class TimeOffComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {

	settingsSmartTable: object;
	selectedEmployeeId: string | null;
	selectedDateRange: IDateRangePicker;
	sourceSmartTable = new LocalDataSource();
	timeOffs: ITimeOff[] = [];
	selectedTimeOffRecord: ITimeOff;
	timeOffRequest: ITimeOff;
	viewComponentName: ComponentEnum;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	componentLayoutStyleEnum = ComponentLayoutStyleEnum;
	rows: Array<any> = [];
	selectedStatus = StatusTypesEnum.ALL;
	timeOffStatuses = Object.keys(StatusTypesEnum);
	loading: boolean;
	isRecordSelected: boolean = false;
	displayHolidays: boolean = true;
	showActions: boolean = false;
	public organization: IOrganization;
	timeoff$: Subject<any> = new Subject();
	includeArchived: boolean = false;
	showFilter: boolean = false;

	timeOffTable: Ng2SmartTableComponent;
	@ViewChild('timeOffTable') set content(content: Ng2SmartTableComponent) {
		if (content) {
			this.timeOffTable = content;
			this.onChangedSource();
		}
	}

	constructor(
		private readonly router: Router,
		private readonly dialogService: NbDialogService,
		private readonly timeOffService: TimeOffService,
		private readonly toastrService: ToastrService,
		private readonly store: Store,
		private readonly translate: TranslateService
	) {
		super(translate);
		this.setView();
	}

	ngOnInit() {
		this._loadSmartTableSettings();
		this._applyTranslationOnSmartTable();
		this.timeoff$
			.pipe(
				debounceTime(300),
				tap(() => this.loading = true),
				tap(() => this.getTimeOffs()),
				tap(() => this.clearItem()),
				untilDestroyed(this)
			)
			.subscribe();
		const storeOrganization$ = this.store.selectedOrganization$;
		const storeEmployee$ = this.store.selectedEmployee$;
		const selectedDateRange$ = this.store.selectedDateRange$;
		combineLatest([storeOrganization$, storeEmployee$, selectedDateRange$])
			.pipe(
				debounceTime(400),
				filter(([organization]) => !!organization),
				distinctUntilChange(),
				tap(([organization, employee, dateRange]) => {
					this.organization = organization;
					this.selectedDateRange = dateRange;
					this.selectedEmployeeId = employee ? employee.id : null;
				}),
				tap(() => this.timeoff$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	setView() {
		this.viewComponentName = ComponentEnum.TIME_OFF;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(
				distinctUntilChange(),
				tap((componentLayout) => this.dataLayoutStyle = componentLayout),
				filter((componentLayout) => componentLayout === ComponentLayoutStyleEnum.CARDS_GRID),
				untilDestroyed(this)
			)
			.subscribe();
	}

	showAdditionalActions() {
		this.showActions = !this.showActions;
	}

	changeDisplayHolidays(checked: boolean) {
		this.displayHolidays = checked;
		this.isRecordSelected = false;

		if (this.displayHolidays) {
			this.timeOffs = this.rows;
			this.sourceSmartTable.load(this.rows);
		} else {
			const filtered = [...this.rows].filter(
				(record: ITimeOff) => !record.isHoliday
			);
			this.timeOffs = filtered;
			this.sourceSmartTable.load(filtered);
		}
	}

	private _applyTranslationOnSmartTable() {
		this.translate.onLangChange
			.pipe(
				tap(() => this._loadSmartTableSettings()),
				untilDestroyed(this)
			).subscribe();
	}

	detectStatusChange(status: StatusTypesEnum) {
		let filtered: ITimeOff[] = [];
		switch (status) {
			case StatusTypesEnum.REQUESTED:
			case StatusTypesEnum.APPROVED:
			case StatusTypesEnum.DENIED:
				filtered = [...this.rows].filter(
					(record: ITimeOff) => record.status === status
				);
				this.timeOffs = filtered;
				this.sourceSmartTable.load(filtered);
				break;
			default:
				filtered = this.rows;
				break;
		}

		this.isRecordSelected = false;
		this.timeOffs = filtered;
		this.sourceSmartTable.load(filtered);
	}

	openTimeOffSettings() {
		this.router.navigate(['/pages/employees/time-off/settings']);
	}

	selectRecord({ isSelected, data }) {
		this.isRecordSelected = isSelected ? true : false;
		this.selectedTimeOffRecord = isSelected ? data : null;
	}

	approveDaysOff(selectedItem?: ITimeOff) {
		if (selectedItem) {
			this.selectRecord({
				isSelected: true,
				data: selectedItem
			});
		}
		if (this.selectedTimeOffRecord.status !== StatusTypesEnum.APPROVED) {
			const requestId = this.selectedTimeOffRecord.id;
			this.selectedTimeOffRecord.status = StatusTypesEnum.APPROVED;
			this.timeOffService
				.updateRequestStatus(requestId, 'approval')
				.pipe(untilDestroyed(this), first())
				.subscribe(
					() => {
						this.toastrService.success(
							'TIME_OFF_PAGE.NOTIFICATIONS.STATUS_SET_APPROVED'
						);
						this.timeoff$.next(true);
					},
					() =>
						this.toastrService.danger(
							'TIME_OFF_PAGE.NOTIFICATIONS.ERR_SET_STATUS'
						)
				);
		} else {
			this.toastrService.success(
				'TIME_OFF_PAGE.NOTIFICATIONS.APPROVED_NO_CHANGES',
				'TIME_OFF_PAGE.NOTIFICATIONS.NO_CHANGES'
			);
			this.timeoff$.next(true);
		}
	}

	denyDaysOff(selectedItem?: ITimeOff) {
		if (selectedItem) {
			this.selectRecord({
				isSelected: true,
				data: selectedItem
			});
		}
		if (this.selectedTimeOffRecord.status !== StatusTypesEnum.DENIED) {
			const requestId = this.selectedTimeOffRecord.id;
			this.selectedTimeOffRecord.status = StatusTypesEnum.DENIED;
			this.timeOffService
				.updateRequestStatus(requestId, 'denied')
				.pipe(untilDestroyed(this), first())
				.subscribe(
					() => {
						this.toastrService.success(
							'TIME_OFF_PAGE.NOTIFICATIONS.REQUEST_DENIED'
						);
						this.timeoff$.next(true);
					},
					() =>
						this.toastrService.danger(
							'TIME_OFF_PAGE.NOTIFICATIONS.ERR_SET_STATUS'
						)
				);
		} else {
			this.toastrService.success(
				'TIME_OFF_PAGE.NOTIFICATIONS.DENIED_NO_CHANGES',
				'TIME_OFF_PAGE.NOTIFICATIONS.NO_CHANGES'
			);
			this.timeoff$.next(true);
		}
	}

	deleteRequest(selectedItem?: ITimeOff) {
		if (selectedItem) {
			this.selectRecord({
				isSelected: true,
				data: selectedItem
			});
		}
		this.dialogService
			.open(DeleteConfirmationComponent, {
				context: {
					recordType: this.getTranslation(
						'TIME_OFF_PAGE.TIME_OFF_REQUEST'
					)
				}
			})
			.onClose.pipe(first())
			.subscribe((res) => {
				if (res) {
					this.timeOffService
						.deleteDaysOffRequest(this.selectedTimeOffRecord.id)
						.pipe(untilDestroyed(this), first())
						.subscribe(
							() => {
								this.toastrService.success(
									'TIME_OFF_PAGE.NOTIFICATIONS.REQUEST_DELETED'
								);
								this.timeoff$.next(true);
							},
							() =>
								this.toastrService.danger(
									'TIME_OFF_PAGE.NOTIFICATIONS.ERR_DELETE_REQUEST'
								)
						);
				}
			});
	}

	requestDaysOff() {
		this.dialogService
			.open(TimeOffRequestMutationComponent, {
				context: { type: 'request' }
			})
			.onClose.pipe(untilDestroyed(this), first())
			.subscribe((res) => {
				this.timeOffRequest = res;
				this._createRecord();
			});
	}

	addHolidays() {
		this.dialogService
			.open(TimeOffHolidayMutationComponent)
			.onClose.pipe(untilDestroyed(this), first())
			.subscribe((res) => {
				if (res) {
					this.timeOffRequest = res;
					this._createRecord();
				}
			});
	}

	updateTimeOffRecord() {
		this._removeDocUrl();

		this.dialogService
			.open(TimeOffRequestMutationComponent, {
				context: { timeOff: this.selectedTimeOffRecord }
			})
			.onClose.pipe(untilDestroyed(this), first())
			.subscribe((res) => {
				if (res) {
					const requestId = this.selectedTimeOffRecord.id;
					this.timeOffRequest = res;
					this._updateRecord(requestId);
				}
			});
	}

	archive() {
		const requestId = this.selectedTimeOffRecord.id;
		this.selectedTimeOffRecord.isArchived = true;
		this.timeOffRequest = this.selectedTimeOffRecord;
		this._updateRecord(requestId);
	}

	changeIncludeArchived($event) {
		this.includeArchived = $event;
		this.timeoff$.next(true);
	}

	showHideFilter() {
		this.showFilter = !this.showFilter;
	}

	private _loadSmartTableSettings() {
		this.settingsSmartTable = {
			actions: false,
			noDataMessage: this.getTranslation('SM_TABLE.NO_DATA'),
			columns: {
				fullName: {
					title: this.getTranslation('SM_TABLE.EMPLOYEE'),
					type: 'custom',
					renderComponent: AvatarComponent,
					valuePrepareFunction: (
						cell,
						row: IEmployeeJobsStatisticsResponse
					) => {
						return {
							name: row.fullName ? row.fullName : null,
							src: row.imageUrl ? row.imageUrl : null,
							id: (row.employees && row.employees.length === 1) ?
								row.employees[0].id :
								null
						};
					},
					class: 'align-row'
				},
				description: {
					title: this.getTranslation('SM_TABLE.DESCRIPTION'),
					type: 'html'
				},
				policyName: {
					title: this.getTranslation('SM_TABLE.POLICY'),
					type: 'string',
					class: 'text-center'
				},
				start: {
					title: this.getTranslation('SM_TABLE.START'),
					type: 'custom',
					filter: false,
					renderComponent: DateViewComponent,
					class: 'text-center'
				},
				end: {
					title: this.getTranslation('SM_TABLE.END'),
					type: 'custom',
					filter: false,
					renderComponent: DateViewComponent,
					class: 'text-center'
				},
				requestDate: {
					title: this.getTranslation('SM_TABLE.REQUEST_DATE'),
					type: 'custom',
					filter: false,
					renderComponent: DateViewComponent,
					class: 'text-center'
				},
				status: {
					title: this.getTranslation('SM_TABLE.STATUS'),
					type: 'custom',
					class: 'text-center',
					width: '200px',
					renderComponent: StatusBadgeComponent,
					filter: false,
					valuePrepareFunction: (cell, row) => {
						let badgeClass;
						if (cell) {
							badgeClass = ['approved'].includes(
								cell.toLowerCase()
							)
								? 'success'
								: ['requested'].includes(cell.toLowerCase())
									? 'warning'
									: 'danger';
						}
						return {
							text: cell,
							class: badgeClass
						};
					}
				}
			},
			pager: {
				display: true,
				perPage: 8
			}
		};
	}

	private getTimeOffs() {
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		try {
			const request = {
				organizationId,
				tenantId,
				employeeId: this.selectedEmployeeId || null,
				...this.selectedDateRange
			}
			this.timeOffService.getAllTimeOffRecords([], request)
				.pipe(
					first(),
					tap(({ items }) => this.mapTimeOffRequests(items)),
					finalize(() => this.loading = false),
					untilDestroyed(this)
				).subscribe()
		} catch (error) {
			this.toastrService.danger('TIME_OFF_PAGE.NOTIFICATIONS.ERR_LOAD_RECORDS')
		}
	}

	mapTimeOffRequests(items: ITimeOff[]) {
		this.rows = [];
		items.forEach((timeOff: ITimeOff) => {
			let employeeName: string;
			let employeeImage: string;
			let extendedDescription = '';

			if (timeOff.employees.length !== 1) {
				employeeName = this.getTranslation('TIME_OFF_PAGE.MULTIPLE_EMPLOYEES');
				employeeImage = 'assets/images/avatars/people-outline.svg';
			} else {
				employeeName = `${timeOff.employees[0].fullName}`;
				employeeImage = timeOff.employees[0].user.imageUrl;
			}

			if (timeOff.documentUrl) {
				extendedDescription = `<a href=${
					timeOff.documentUrl
				} target="_blank">${this.getTranslation(
					'TIME_OFF_PAGE.VIEW_REQUEST_DOCUMENT'
				)}</a><br>${timeOff.description}`;
			} else {
				extendedDescription = timeOff.description;
			}

			if (!timeOff.isArchived || this.includeArchived) {
				this.rows.push({
					...timeOff,
					fullName: employeeName,
					imageUrl: employeeImage,
					policyName: timeOff.policy.name,
					description: extendedDescription
				});
			}
		});
		this.timeOffs = this.rows;
		this.sourceSmartTable.load(this.rows);
	}

	private _createRecord() {
		try {
			if (this.timeOffRequest) {
				this.timeOffService
					.createRequest(this.timeOffRequest)
					.pipe(
						untilDestroyed(this),
						first(),
						tap(() => this.toastrService.success('TIME_OFF_PAGE.NOTIFICATIONS.RECORD_CREATED')),
						finalize(() => this.timeoff$.next(true)),
					)
					.subscribe();
			}
		} catch (error) {
			this.toastrService.danger('TIME_OFF_PAGE.NOTIFICATIONS.ERR_CREATE_RECORD');
		}
	}

	private _updateRecord(id: string) {
		try {
			this.timeOffService
				.updateRequest(id, this.timeOffRequest)
				.pipe(
					untilDestroyed(this),
					first(),
					tap(() => this.toastrService.success('TIME_OFF_PAGE.NOTIFICATIONS.REQUEST_UPDATED')),
					finalize(() => this.timeoff$.next(true)),
				)
		} catch (error) {
			this.toastrService.danger('TIME_OFF_PAGE.NOTIFICATIONS.ERR_UPDATE_RECORD');
		}
	}

	private _removeDocUrl() {
		if (this.selectedTimeOffRecord.description) {
			const index = this.selectedTimeOffRecord.description.lastIndexOf('>');
			const nativeDescription = this.selectedTimeOffRecord.description;
			this.selectedTimeOffRecord.description = nativeDescription.substr(
				index + 1
			);
		}
	}

	/*
	 * Table on changed source event
	 */
	onChangedSource() {
		this.timeOffTable.source.onChangedSource
			.pipe(
				untilDestroyed(this),
				tap(() => this.clearItem())
			)
			.subscribe();
	}

	/*
	 * Clear selected item
	 */
	clearItem() {
		this.selectRecord({
			isSelected: false,
			data: null
		});
		this.deselectAll();
	}

	/*
	 * Deselect all table rows
	 */
	deselectAll() {
		if (this.timeOffTable && this.timeOffTable.grid) {
			this.timeOffTable.grid.dataSet['willSelect'] = 'false';
			this.timeOffTable.grid.dataSet.deselectAll();
		}
	}

	/**
	 * Navigate to employee edit section
	 * 
	 * @param row 
	 */
	navigateToEmployee(row: ITimeOff) {
		if (row?.employees.length > 0) {
			this.router.navigate([
				`/pages/employees/edit`,
				row.employees[0].id
			]);
		}
	}

	ngOnDestroy(): void { }
}
