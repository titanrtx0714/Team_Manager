import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NbDialogRef, NbStepperComponent, NbTagComponent } from '@nebular/theme';
import { BasicInfoFormComponent } from '../../user/forms/basic-info/basic-info-form.component';
import {
	RolesEnum,
	IEmployee,
	IUser,
	IRole,
	IEmployeeCreateInput,
	CrudActionEnum,
	IOrganization
} from '@gauzy/contracts';
import { filter, firstValueFrom, tap } from 'rxjs';
import { distinctUntilChange } from '@gauzy/common-angular';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	EmployeesService,
	EmployeeStore,
	ErrorHandlingService,
	OrganizationsService,
	RoleService,
	Store
} from '../../../@core/services';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-employee-mutation',
	templateUrl: 'employee-mutation.component.html',
	styleUrls: ['employee-mutation.component.scss']
})
export class EmployeeMutationComponent implements OnInit, AfterViewInit {
	@ViewChild('userBasicInfo')
	userBasicInfo: BasicInfoFormComponent;

	@ViewChild('stepper')
	stepper: NbStepperComponent;
	linear = true;
	form: FormGroup;
	role: IRole;
	employees: IEmployeeCreateInput[] = [];
	organization: IOrganization;

	constructor(
		protected readonly dialogRef: NbDialogRef<EmployeeMutationComponent>,
		protected readonly organizationsService: OrganizationsService,
		protected readonly employeesService: EmployeesService,
		private readonly roleService: RoleService,
		protected readonly store: Store,
		private readonly errorHandler: ErrorHandlingService,
		private readonly _employeeStore: EmployeeStore
	) {}

	ngOnInit(): void {
		this.store.selectedOrganization$
			.pipe(
				distinctUntilChange(),
				filter((organization: IOrganization) => !!organization),
				tap((organization: IOrganization) => (this.organization = organization)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	async ngAfterViewInit() {
		const { tenantId } = this.store.user;
		this.form = this.userBasicInfo.form;
		this.role = await firstValueFrom(
			this.roleService.getRoleByOptions({
				name: RolesEnum.EMPLOYEE,
				tenantId
			})
		);
	}

	closeDialog(employee: IEmployee[] = null) {
		this.dialogRef.close(employee);
	}

	addEmployee() {
		this.form = this.userBasicInfo.form;
		const {
			firstName,
			lastName,
			email,
			username,
			password,
			tags,
			imageUrl
		} = this.form.getRawValue();
		const {
			offerDate = null,
			acceptDate = null,
			rejectDate = null,
			startedWorkOn = null
		} = this.form.getRawValue();
		const user: IUser = {
			firstName: firstName,
			lastName: lastName,
			username,
			email: email,
			imageUrl: imageUrl,
			tenant: null,
			role: this.role,
			tags: tags
		};
		const employee: IEmployeeCreateInput = {
			user,
			startedWorkOn: startedWorkOn,
			password: password,
			organization: this.organization,
			offerDate,
			acceptDate,
			rejectDate,
			tags: tags
		};
   		// Check form validity before to add an employe to the array of employees.
		if (this.form.valid) this.employees.push(employee);
    	// Reset form and stepper.
		this.form.reset();
		this.stepper.reset();
	}

	async add() {
		this.addEmployee();
		try {
			const employees = await firstValueFrom(
				this.employeesService.createBulk(this.employees)
			);
			this._employeeStore.employeeAction = {
				action: CrudActionEnum.CREATED,
				employees
			};
			this.closeDialog(employees);
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	}

	/**
	 * Removed one employe in the array of employees.
	 * @param tag
	 */
	onEmployeeRemove(tag: NbTagComponent): void {
		this.employees = this.employees.filter(
			(t: IEmployeeCreateInput) => t.user.email !== tag.text
		);
	}

	/**
	 * Go to the next step without saving the data even if the form is valid.
	 */
	nextStep() {
		this.form.reset();
		this.stepper.next();
	}
}
