import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	OrganizationSelectInput,
	IRecurringExpenseModel,
	RecurringExpenseDefaultCategoriesEnum,
	StartDateUpdateTypeEnum,
	IEmployee,
	IOrganization
} from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment';
import {
	EmployeeRecurringExpenseService,
	EmployeesService,
	ErrorHandlingService,
	ExpenseCategoriesStoreService,
	OrganizationRecurringExpenseService,
	OrganizationsService,
	Store,
	ToastrService
} from '../../../@core/services';
import { TranslationBaseComponent } from '../../language-base/translation-base.component';
import { TranslateService } from '@ngx-translate/core';
import { defaultDateFormat } from '../../../@core/utils/date';
import { EmployeeSelectorComponent } from '../../../@theme/components/header/selectors/employee/employee.component';

export enum COMPONENT_TYPE {
	EMPLOYEE = 'EMPLOYEE',
	ORGANIZATION = 'ORGANIZATION'
}

@Component({
	selector: 'ga-recurring-expense-mutation',
	templateUrl: './recurring-expense-mutation.component.html',
	styleUrls: ['./recurring-expense-mutation.component.scss']
})
export class RecurringExpenseMutationComponent
	extends TranslationBaseComponent
	implements OnInit {
	public form: FormGroup;
	@ViewChild('employeeSelector')
	employeeSelector: EmployeeSelectorComponent;

	startDateUpdateType: StartDateUpdateTypeEnum =
		StartDateUpdateTypeEnum.NO_CHANGE;

	startDateChangeLoading = false;

	defaultFilteredCategories: {
		label: string;
		value: string;
	}[] = [];

	defaultCategories: {
		category: string;
		types: COMPONENT_TYPE[];
	}[] = [
		{
			category: RecurringExpenseDefaultCategoriesEnum.SALARY,
			types: [COMPONENT_TYPE.EMPLOYEE]
		},
		{
			category: RecurringExpenseDefaultCategoriesEnum.SALARY_TAXES,
			types: [COMPONENT_TYPE.EMPLOYEE]
		},
		{
			category: RecurringExpenseDefaultCategoriesEnum.RENT,
			types: [COMPONENT_TYPE.ORGANIZATION]
		},
		{
			category: RecurringExpenseDefaultCategoriesEnum.EXTRA_BONUS,
			types: [COMPONENT_TYPE.EMPLOYEE, COMPONENT_TYPE.ORGANIZATION]
		}
	];
	@Input() isAdd: boolean;
	recurringExpense?: IRecurringExpenseModel;
	componentType: COMPONENT_TYPE;
	selectedDate: Date;
	conflicts: IRecurringExpenseModel[] = [];
	selectedOrganization: IOrganization;

	constructor(
		private readonly fb: FormBuilder,
		protected readonly dialogRef: NbDialogRef<RecurringExpenseMutationComponent>,
		private readonly organizationsService: OrganizationsService,
		private readonly store: Store,
		private readonly employeesService: EmployeesService,
		private readonly expenseCategoriesStore: ExpenseCategoriesStoreService,
		private readonly translate: TranslateService,
		private readonly toastrService: ToastrService,
		private readonly errorHandler: ErrorHandlingService,
		private readonly organizationRecurringExpenseService: OrganizationRecurringExpenseService,
		private readonly employeeRecurringExpenseService: EmployeeRecurringExpenseService
	) {
		super(translate);
	}

	get currencyValue() {
		return this.form.get('currency').value;
	}

	get currency() {
		return this.form.get('currency');
	}

	get startDate() {
		return this.form.get('startDate').value;
	}

	get value() {
		return this.form.get('value').value;
	}

	formatToOrganizationDate(date: string) {
		return date
			? moment(date).format(
				this.store.selectedOrganization.dateFormat ||
				defaultDateFormat
			)
			: 'end';
	}

	previousMonth(date: string) {
		return moment(date).subtract({ months: 1 }).format('MMM, YYYY');
	}

	month(date: string) {
		return moment(date).format('MMM, YYYY');
	}

	ngOnInit() {
		this.defaultFilteredCategories = this.defaultCategories
			.filter((c) => c.types.indexOf(this.componentType) > -1)
			.map((i) => ({
				value: i.category,
				label: this.getTranslatedExpenseCategory(i.category)
			}));
		this.expenseCategoriesStore.expenseCategories$.subscribe(
			(categories) => {
				const storedCategories: {
					label: string;
					value: string;
				}[] = [];
				for (let category of categories) {
					storedCategories.push({
						value: category.name,
						label: category.name
					});
				}
				this.defaultFilteredCategories = [
					...this.defaultFilteredCategories,
					...storedCategories
				];
			}
		);
    this.expenseCategoriesStore.loadAll();
		this._initializeForm(this.recurringExpense);
	}

	submitForm() {
		if (this.form.valid) {
			this.closeAndSubmit();
		}
	}

	async closeAndSubmit() {
		let employee: IEmployee;
		if (this.recurringExpense && this.recurringExpense.employeeId) {
			employee = await this.employeesService.getEmployeeById(
				this.recurringExpense.employeeId
			);
		}
		const {
			id: organizationId,
			tenantId
		} = this.store.selectedOrganization;
		let formValues = this.form.getRawValue();
		formValues = {
			...formValues,
			categoryName: formValues.categoryName,
			startDay: formValues.startDate.getDate(),
			startMonth: formValues.startDate.getMonth(),
			startYear: formValues.startDate.getFullYear(),
			organizationId,
			tenantId
		};
		if (this.recurringExpense && this.recurringExpense.employeeId) {
			formValues['employee'] = employee;
		} else {
			formValues['employee'] = this.employeeSelector
				? this.employeeSelector.selectedEmployee
				: null;
		}
		this.dialogRef.close(formValues);
	}

	getTranslatedExpenseCategory(categoryName) {
		return this.getTranslation(
			`EXPENSES_PAGE.DEFAULT_CATEGORY.${categoryName}`
		);
	}

	addCustomCategoryName(term) {
		return { value: term, label: term };
	}

	addNewCustomCategoryName = async (name: string): Promise<any> => {
		try {
			this.toastrService.success(
				'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_EXPENSE_CATEGORIES.ADD_EXPENSE_CATEGORY',
				{
					name
				}
			);
      const createdCategory =  await firstValueFrom(this.expenseCategoriesStore.create(name));
			return {
				value: createdCategory.name,
				label: createdCategory.name
			};
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	private _initializeForm(recurringExpense?: any) {
		this.form = this.fb.group({
			categoryName: [
				recurringExpense ? recurringExpense.categoryName : '',
				Validators.required
			],
			value: [
				recurringExpense ? recurringExpense.value : '',
				Validators.required
			],
			currency: [
				{
					value: recurringExpense ? recurringExpense.currency : '',
					disabled: true
				},
				Validators.required
			],
			splitExpense: [
				recurringExpense && recurringExpense.splitExpense
					? recurringExpense.splitExpense
					: false
			],
			startDate: [
				recurringExpense && recurringExpense.startDate
					? new Date(recurringExpense.startDate)
					: new Date(
						this.selectedDate.getFullYear(),
						this.selectedDate.getMonth(),
						1
					)
			]
		});

		if (
			recurringExpense &&
			!(
				recurringExpense.categoryName in
				RecurringExpenseDefaultCategoriesEnum
			)
		) {
			this.defaultFilteredCategories = [
				{
					value: recurringExpense.categoryName,
					label: recurringExpense.categoryName
				},
				...this.defaultFilteredCategories
			];
		}
		this._loadDefaultCurrency();
	}

	async datePickerChanged(newValue: string) {
		this.startDateChangeLoading = true;
		if (
			newValue &&
			this.recurringExpense &&
			this.recurringExpense.startDate
		) {
			const newStartDate = new Date(newValue);
			const { value, conflicts } =
				this.componentType === COMPONENT_TYPE.ORGANIZATION
					? await this.organizationRecurringExpenseService.getStartDateUpdateType(
						{
							newStartDate,
							recurringExpenseId: this.recurringExpense.id
						}
					)
					: await this.employeeRecurringExpenseService.getStartDateUpdateType(
						{
							newStartDate,
							recurringExpenseId: this.recurringExpense.id
						}
					);
			this.startDateUpdateType = value;
			this.conflicts = conflicts;
		}
		this.startDateChangeLoading = false;
	}

	private async _loadDefaultCurrency() {
		const orgData = await firstValueFrom(this.organizationsService
			.getById(this.store.selectedOrganization.id, [
				OrganizationSelectInput.currency
			])
		);

		if (orgData && this.currency && !this.currency.value) {
			this.currency.setValue(orgData.currency);
		}
	}

	close() {
		this.dialogRef.close();
	}
}
