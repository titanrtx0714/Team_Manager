import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ExpenseViewModel } from '../../../pages/expenses/expenses.component';
import {
	CurrenciesEnum,
	OrganizationSelectInput,
	TaxTypesEnum,
	OrganizationClients,
	OrganizationProjects
} from '@gauzy/models';
import { OrganizationsService } from '../../../@core/services/organizations.service';
import { Store } from '../../../@core/services/store.service';
import { first } from 'rxjs/operators';
import { EmployeeSelectorComponent } from '../../../@theme/components/header/selectors/employee/employee.component';
import { OrganizationVendorsService } from '../../../@core/services/organization-vendors.service';
import { OrganizationClientsService } from '../../../@core/services/organization-clients.service ';
import { OrganizationProjectsService } from '../../../@core/services/organization-projects.service';

@Component({
	selector: 'ga-expenses-mutation',
	templateUrl: './expenses-mutation.component.html',
	styleUrls: ['./expenses-mutation.component.scss']
})
export class ExpensesMutationComponent implements OnInit {
	@ViewChild('employeeSelector', { static: false })
	employeeSelector: EmployeeSelectorComponent;
	form: FormGroup;
	expense: ExpenseViewModel;
	organizationId: string;
	fakeCategories: { categoryName: string; categoryId: string }[] = [];
	currencies = Object.values(CurrenciesEnum);
	taxTypes = Object.values(TaxTypesEnum);
	vendor: { vendorName: string; vendorId: string };
	vendors: { vendorName: string; vendorId: string }[] = [];
	clients: OrganizationClients[];
	projects: OrganizationProjects[];
	calculatedValue = '0';
	showNotes = false;
	showTaxesInput = false;
	disable = true;

	constructor(
		public dialogRef: NbDialogRef<ExpensesMutationComponent>,
		private fb: FormBuilder,
		private organizationsService: OrganizationsService,
		private organizationVendorsService: OrganizationVendorsService,
		private store: Store,
		private readonly organizationClientsService: OrganizationClientsService,
		private readonly organizationProjectsService: OrganizationProjectsService
	) {}

	ngOnInit() {
		this.getDefaultData();
		this.loadClients();
		this.loadProjects();
		this._initializeForm();

		// TODO: here we'll get all the categories and vendors for ng-select menus
	}

	get currency() {
		return this.form.get('currency');
	}

	private getFakeId = () => (Math.floor(Math.random() * 101) + 1).toString();

	private async getDefaultData() {
		this.organizationId = this.store.selectedOrganization.id;
		const res = await this.organizationVendorsService.getAll({
			organizationId: this.organizationId
		});

		if (res) {
			const resultArr = res.items;
			resultArr.forEach((vendor) => {
				this.vendors.push({
					vendorName: vendor.name,
					vendorId: vendor.id
				});
			});
		}

		if (!this.vendors.length) {
			const fakeVendorNames = [
				'Microsoft',
				'Google',
				'CaffeeMania',
				'CoShare',
				'Cleaning Company',
				'Udemy',
				'MultiSport'
			];

			fakeVendorNames.forEach((name) => {
				this.vendors.push({
					vendorName: name,
					vendorId: this.getFakeId()
				});
			});
		}

		const fakeCategoryNames = [
			'Rent',
			'Electricity',
			'Internet',
			'Water Supply',
			'Office Supplies',
			'Parking',
			'Employees Benefits',
			'Insurance Premiums',
			'Courses',
			'Subscriptions',
			'Repairs',
			'Depreciable Assets',
			'Software Products',
			'Office Hardware',
			'Courier Services',
			'Business Trips',
			'Team Buildings'
		];

		fakeCategoryNames.forEach((name) => {
			this.fakeCategories.push({
				categoryName: name,
				categoryId: this.getFakeId()
			});
		});
	}

	addOrEditExpense() {
		this.dialogRef.close(
			Object.assign(
				{ employee: this.employeeSelector.selectedEmployee },
				this.form.value
			)
		);
	}

	showNotesInput() {
		return (this.showNotes = !this.showNotes);
	}

	includeTaxes() {
		if (this.form.value.taxType) {
			this.disable = false;
		}
		this.calculateTaxes();
		return (this.showTaxesInput = !this.showTaxesInput);
	}

	private _initializeForm() {
		if (this.expense) {
			this.form = this.fb.group({
				id: [this.expense.id],
				amount: [this.expense.amount, Validators.required],
				vendor: [
					{
						vendorId: this.expense.vendorId,
						vendorName: this.expense.vendorName
					},
					Validators.required
				],
				category: [
					{
						categoryId: this.expense.categoryId,
						categoryName: this.expense.categoryName
					},
					Validators.required
				],
				notes: [this.expense.notes],
				currency: [this.expense.currency],
				valueDate: [
					new Date(this.expense.valueDate),
					Validators.required
				],
				purpose: [this.expense.purpose],
				taxType: [this.expense.taxType],
				taxLabel: [this.expense.taxLabel],
				rateValue: [this.expense.rateValue]
			});
		} else {
			this.form = this.fb.group({
				amount: ['', Validators.required],
				vendor: [null, Validators.required],
				category: [null, Validators.required],
				notes: [''],
				currency: [''],
				valueDate: [
					this.store.getDateFromOrganizationSettings(),
					Validators.required
				],
				purpose: [''],
				clientName: [''],
				projectName: [''],
				taxType: [TaxTypesEnum.PERCENTAGE],
				taxLabel: [''],
				rateValue: [0]
			});

			this._loadDefaultCurrency();
		}
	}

	private calculateTaxes() {
		this.form.valueChanges.subscribe((val) => {
			const amount = val.amount;
			const rate = val.rateValue;
			const oldNotes = val.notes;

			if (val.taxType === 'Percentage') {
				const result = (amount / (rate + 100)) * 100 * (rate / 100);

				this.calculatedValue =
					'Tax Amount: ' + result.toFixed(2) + ' ' + val.currency;
			} else {
				const result = (rate / (amount - rate)) * 100;
				this.calculatedValue = 'Tax Rate: ' + result.toFixed(2) + ' %';
			}

			if (rate !== 0) {
				val.notes = this.calculatedValue + '. ' + oldNotes;
			}
		});
	}

	private async loadClients() {
		const res = await this.organizationClientsService.getAll(['projects'], {
			organizationId: this.organizationId
		});
		if (res) {
			this.clients = res.items;
		}
	}

	private async loadProjects() {
		const res = await this.organizationProjectsService.getAll(['client'], {
			organizationId: this.organizationId,
			client: null
		});

		if (res) {
			this.projects = res.items;
		}
	}

	private async _loadDefaultCurrency() {
		const orgData = await this.organizationsService
			.getById(this.store.selectedOrganization.id, [
				OrganizationSelectInput.currency
			])
			.pipe(first())
			.toPromise();

		if (orgData && this.currency && !this.currency.value) {
			this.currency.setValue(orgData.currency);
		}
	}
}
