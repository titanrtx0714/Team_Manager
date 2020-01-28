import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Employee, OrganizationTeams } from '@gauzy/models';
import { EmployeesService } from '../../../@core/services';
import { first, takeUntil } from 'rxjs/operators';
import { Store } from '../../../@core/services/store.service';
import { Subject } from 'rxjs';

@Component({
	selector: 'ngx-time-off-settings-mutation',
	templateUrl: './time-off-settings-mutation.component.html',
	styleUrls: ['./time-off-settings-mutation.component.scss']
})
export class TimeOffSettingsMutationComponent implements OnInit, OnDestroy {
	constructor(
		protected dialogRef: NbDialogRef<TimeOffSettingsMutationComponent>,
		private employeesService: EmployeesService,
		private store: Store
	) {}

	private _ngDestroy$ = new Subject<void>();

	@Input()
	team?: OrganizationTeams;

	organizationId: string;
	selectedEmployees: string[];
	employees: Employee[] = [];
	name: string;
	showWarning = false;
	requiresApproval = false;
	paid = true;

	ngOnInit() {
		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((org) => {
				this.organizationId = org.id;
			});

		this.loadEmployees();
	}

	private async loadEmployees() {
		if (!this.organizationId) {
			return;
		}

		const { items } = await this.employeesService
			.getAll(['user'], { organization: { id: this.organizationId } })
			.pipe(first())
			.toPromise();

		this.employees = items;
	}

	addOrEditPolicy() {
		if (this.name && this.selectedEmployees) {
			this.dialogRef.close({
				name: this.name,
				organizationId: this.organizationId,
				employees: this.selectedEmployees,
				requiresApproval: this.requiresApproval,
				paid: this.paid
			});
		} else {
			this.showWarning = true;
			setTimeout(() => {
				this.closeWarning();
			}, 3000);
		}
	}

	onEmployeesSelected(employees: string[]) {
		this.selectedEmployees = employees;
	}

	changeRequiresApproval(checked: boolean) {
		this.requiresApproval = checked;
	}

	changePaidStatus(checked: boolean) {
		this.paid = checked;
	}

	closeWarning() {
		this.showWarning = !this.showWarning;
	}

	close() {
		this.dialogRef.close();
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
		clearTimeout();
	}
}
