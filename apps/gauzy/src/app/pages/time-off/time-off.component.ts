import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { StatusTypesEnum, PermissionsEnum, TimeOff } from '@gauzy/models';
import { Store } from '../../@core/services/store.service';
import { takeUntil, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TimeOffRequestMutationComponent } from '../../@shared/time-off/time-off-request-mutation/time-off-request-mutation.component';
import { TimeOffService } from '../../@core/services/time-off.service';

@Component({
	selector: 'ngx-time-off',
	templateUrl: './time-off.component.html',
	styleUrls: ['./time-off.component.scss']
})
export class TimeOffComponent implements OnInit, OnDestroy {
	constructor(
		private router: Router,
		private dialogService: NbDialogService,
		private timeOffService: TimeOffService,
		private toastrService: NbToastrService,
		private store: Store
	) {}

	private _ngDestroy$ = new Subject<void>();
	private _selectedOrganizationId: string;
	timeOffRequest: TimeOff;
	selectedDate: Date;
	selectedEmployeeId: string;
	selectedStatus = 'All';
	timeOffStatuses = Object.keys(StatusTypesEnum);
	loading = false;
	displayHolidays = true;
	hasEditPermission = false;

	ngOnInit() {
		this.store.userRolePermissions$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this.hasEditPermission = this.store.hasPermission(
					PermissionsEnum.POLICY_EDIT
				);
			});

		this.store.selectedDate$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((date) => {
				this.selectedDate = date;

				if (this.selectedEmployeeId) {
					this._loadTableData();
				} else {
					if (this._selectedOrganizationId) {
						this._loadTableData(null, this._selectedOrganizationId);
					}
				}
			});

		this.store.selectedEmployee$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((employee) => {
				if (employee && employee.id) {
					this.selectedEmployeeId = employee.id;
					this._loadTableData();
				} else {
					if (this._selectedOrganizationId) {
						this.selectedEmployeeId = null;
						this._loadTableData(null, this._selectedOrganizationId);
					}
				}
			});

		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((org) => {
				if (org) {
					this._selectedOrganizationId = org.id;
					if (this.loading) {
						this._loadTableData(
							this.store.selectedEmployee
								? this.store.selectedEmployee.id
								: null,
							this.store.selectedEmployee &&
								this.store.selectedEmployee.id
								? null
								: this._selectedOrganizationId
						);
					}
				}
			});
	}

	private _loadTableData(
		employeeId = this.selectedEmployeeId,
		orgId?: string
	) {}

	openTimeOffSettings() {
		this.router.navigate(['/pages/employees/time-off/settings']);
	}

	async requestDaysOff() {
		this.timeOffRequest = await this.dialogService
			.open(TimeOffRequestMutationComponent, {
				context: { type: 'request' }
			})
			.onClose.pipe(first())
			.toPromise();

		this._createRecord();
	}

	async addHolidays() {
		this.timeOffRequest = await this.dialogService
			.open(TimeOffRequestMutationComponent, {
				context: { type: 'holiday' }
			})
			.onClose.pipe(first())
			.toPromise();

		this._createRecord();
	}

	private async _createRecord() {
		if (this.timeOffRequest) {
			await this.timeOffService.createRequest(this.timeOffRequest);
			this.toastrService.success(`Time off record ${this.timeOffRequest.description} successfully created!`, 'Success')
		}
	}

	changeDisplayHolidays(checked: boolean) {
		this.displayHolidays = checked;
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
