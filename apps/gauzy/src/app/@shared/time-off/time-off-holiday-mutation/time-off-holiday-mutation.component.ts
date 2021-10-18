import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import * as Holidays from 'date-holidays';
import {
	IEmployee,
	ITimeOffPolicy,
	ITimeOff,
	IOrganization,
	StatusTypesEnum,
	IUser
} from '@gauzy/contracts';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, filter, first, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { EmployeeSelectorComponent } from '../../../@theme/components/header/selectors/employee/employee.component';
import {
	EmployeesService,
	Store,
	TimeOffService,
	ToastrService
} from '../../../@core/services';
import { environment as ENV } from './../../../../environments/environment';
import { CompareDateValidator } from '../../../@core/validators';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-time-off-holiday-mutation',
	templateUrl: './time-off-holiday-mutation.component.html',
	styleUrls: ['../time-off-mutation.components.scss']
})
export class TimeOffHolidayMutationComponent implements OnInit {
	constructor(
		protected readonly dialogRef: NbDialogRef<TimeOffHolidayMutationComponent>,
		private readonly fb: FormBuilder,
		private readonly toastrService: ToastrService,
		private readonly timeOffService: TimeOffService,
		private readonly employeesService: EmployeesService,
		private readonly store: Store
	) {}

	/**
	 * Employee Selector
	 */
	employeeSelector: EmployeeSelectorComponent;
	@ViewChild('employeeSelector') set content(component: EmployeeSelectorComponent) {
		if (component) {
			this.employeeSelector = component;
		}
	}

	/*
	* Getter & Setter
	*/
	_timeOff: ITimeOff;
	get timeOff(): ITimeOff {
		return this._timeOff;
	}
	@Input() set timeOff(value: ITimeOff) {
		this._timeOff = value;
	};

	policies: ITimeOffPolicy[] = [];
	orgEmployees: IEmployee[] = [];
	employeesArr: IEmployee[] = [];
	holidays = [];
	selectedEmployee: any;
	policy: ITimeOffPolicy;
	isEditMode = false;
	minDate = new Date(moment().format('YYYY-MM-DD'));
	public organization: IOrganization;
	countryCode: string;
	employeeIds: string[] = [];

	/*
	* Time Off Holiday Mutation Form 
	*/
	public form: FormGroup = TimeOffHolidayMutationComponent.buildForm(this.fb);
	static buildForm(fb: FormBuilder): FormGroup {
		const form = fb.group({
			start: ['', Validators.required],
			end: ['', Validators.required],
			policy: ['', Validators.required],
			status: []
		}, { 
			validators: [
				CompareDateValidator.validateDate('start', 'end')
			]
		});
		return form;
	}

	ngOnInit() {
		this.store.user$
			.pipe(
				filter((user: IUser) => !!user.employee),
				tap(({ employee : { contact } }: IUser) => {
					if (contact && contact.country) {
						this.countryCode = contact.country;
					}
				}),
				untilDestroyed(this)
			)
			.subscribe();
		this.store.selectedOrganization$
			.pipe(
				filter((organization: IOrganization) => !!organization),
				debounceTime(200),
				tap((organization) => this.organization = organization),
				tap(({ contact } : IOrganization) => {
					if (contact && contact.country) {
						this.countryCode = contact.country;
					}
				}),
				tap(() => this._getFormData()),
				tap(() => this._getOrganizationEmployees()),
				tap(() => this._getPolicies()),
				untilDestroyed(this)
			)
			.subscribe(() => {
				this.patchFormValue()
			});
	}

	private async _getAllHolidays() {
		const holidays = new Holidays();
		const countryCode = this.countryCode || ENV.DEFAULT_COUNTRY;

		if (countryCode) {
			holidays.init(countryCode);
			this.holidays = holidays
				.getHolidays(moment().year())
				.filter((holiday) => holiday.type === 'public');
		} else {
			this.toastrService.danger('TOASTR.MESSAGE.HOLIDAY_ERROR');
		}
	}

	/**
	 * Patch form value on edit section 
	 */
	patchFormValue() {
		// patch form value
		if(this.timeOff) {
			this.form.patchValue({
				start: this.timeOff.start,
				end: this.timeOff.end,
				policy: this.timeOff.policy,
				status: this.timeOff.status,
			});
	
			this.policy = this.timeOff.policy;
			this.selectedEmployee = this.timeOff['employees'][0];
			this.employeesArr = this.timeOff['employees'];
		}		
	}

	addHolidays() {
		this._checkFormData();
		this.employeeIds.forEach((element) => {
			const employee = this.orgEmployees.find((e) => e.id === element);
			this.employeesArr.push(employee);
		});
		this._createNewRecord();
	}

	private _createNewRecord() {
		if (this.form.invalid) {
			return;
		}
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		this.dialogRef.close(
			Object.assign(
				{
					employees: this.employeesArr,
					organizationId,
					tenantId,
					isHoliday: true,
					requestDate: new Date()
				},
				this.form.getRawValue()
			)
		);
	}

	private _checkFormData() {
		if (this.policy.requiresApproval) {
			this.form.patchValue({
				status: StatusTypesEnum.REQUESTED
			});
		} else {
			this.form.patchValue({
				status: StatusTypesEnum.APPROVED
			});
		}
	}

	private async _getFormData() {
		this._getAllHolidays();
	}

	private async _getPolicies() {
		if (!this.organization) {
			return;
		}

		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		await this.timeOffService.getAllPolicies(['employees'], {
			organizationId,
			tenantId
		})
		.pipe(
			first(),
			tap(({ items }) => this.policies = items)
		)
		.subscribe();
	}

	private _getOrganizationEmployees() {
		if (!this.organization) {
			return;
		}

		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		this.employeesService.getAll(['user', 'tags'], {
			organizationId,
			tenantId
		})
		.pipe(
			first(),
			tap(({ items }) => this.orgEmployees = items)
		)
		.subscribe();
	}

	onPolicySelected(policy: ITimeOffPolicy) {
		this.policy = policy;
	}

	onEmployeesSelected(employees: string[]) {
		this.employeeIds = employees;
	}

	/**
	 * Patch value on holiday selected
	 * 
	 * @param holiday 
	 */
	onHolidaySelected(holiday: any) {
		this.form.patchValue({
			start: holiday.start,
			end: holiday.end || null,
			description: holiday.name
		});
	}

	close() {
		this.dialogRef.close();
	}

	/**
	 * Form invalid control validate
	 * 
	 * @param control 
	 * @returns 
	 */
	isInvalidControl(control: string) {
		if (!this.form.contains(control)) {
			return true;
		}
		return this.form.get(control).touched && 
			this.form.get(control).invalid;
	}
}
