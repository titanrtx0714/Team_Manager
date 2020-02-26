import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	CurrenciesEnum,
	Organization,
	OrganizationRecurringExpense,
	RecurringExpenseDeletionEnum
} from '@gauzy/models';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';

import { EmployeesService } from '../../../@core/services';
import { OrganizationRecurringExpenseService } from '../../../@core/services/organization-recurring-expense.service';
import { OrganizationsService } from '../../../@core/services/organizations.service';
import { Store } from '../../../@core/services/store.service';
import { monthNames } from '../../../@core/utils/date';
import { RecurringExpenseDeleteConfirmationComponent } from '../../../@shared/expenses/recurring-expense-delete-confirmation/recurring-expense-delete-confirmation.component';
import {
	RecurringExpenseMutationComponent,
	COMPONENT_TYPE
} from '../../../@shared/expenses/recurring-expense-mutation/recurring-expense-mutation.component';
import { TranslationBaseComponent } from '../../../@shared/language-base/translation-base.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
	templateUrl: './edit-organization.component.html',
	styleUrls: [
		'./edit-organization.component.scss',
		'../../dashboard/dashboard.component.scss'
	]
})
export class EditOrganizationComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	selectedOrg: Organization;
	selectedDate: Date;
	selectedOrgFromHeader: Organization;
	employeesCount: number;
	selectedOrgRecurringExpense: OrganizationRecurringExpense[];
	selectedRowIndexToShow: number;
	currencies = Object.values(CurrenciesEnum);
	editExpenseId: string;

	private _ngDestroy$ = new Subject<void>();

	loading = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private organizationsService: OrganizationsService,
		private employeesService: EmployeesService,
		private organizationRecurringExpenseService: OrganizationRecurringExpenseService,
		private store: Store,
		private dialogService: NbDialogService,
		private toastrService: NbToastrService,
		readonly translateService: TranslateService
	) {
		super(translateService);
	}

	async ngOnInit() {
		this.selectedDate = this.store.selectedDate;

		this.store.selectedDate$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((date) => {
				this.selectedDate = date;
				this._loadOrgRecurringExpense();
			});

		this.route.params
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(async (params) => {
				const id = params.id;

				this.selectedOrg = await this.organizationsService
					.getById(id)
					.pipe(first())
					.toPromise();
				this.selectedOrgFromHeader = this.selectedOrg;
				this.loadEmployeesCount();
				this._loadOrgRecurringExpense();
				this.store.selectedOrganization = this.selectedOrg;
				this.store.selectedEmployee = null;

				this.store.selectedOrganization$
					.pipe(takeUntil(this._ngDestroy$))
					.subscribe((org) => {
						this.selectedOrgFromHeader = org;
						if (org && org.id) {
							this.router.navigate([
								'/pages/organizations/edit/' + org.id
							]);
						}
					});
			});
	}

	editOrg() {
		this.router.navigate([
			'/pages/organizations/edit/' + this.selectedOrg.id + '/settings'
		]);
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}

	getMonthString(month: number) {
		const months = monthNames;
		return months[month - 1];
	}

	showMenu(index: number) {
		this.selectedRowIndexToShow = index;
	}

	getDefaultDate() {
		const month = ('0' + (this.selectedDate.getMonth() + 1)).slice(-2);
		return `${this.selectedDate.getFullYear()}-${month}`;
	}

	getDateValue(value: string): { month: number; year: number } {
		if (value) {
			const res = value.split('-');

			return {
				year: +res[0],
				month: +res[1]
			};
		}
	}

	async deleteOrgRecurringExpense(index: number) {
		const selectedExpense = this.selectedOrgRecurringExpense[index];
		const result: RecurringExpenseDeletionEnum = await this.dialogService
			.open(RecurringExpenseDeleteConfirmationComponent, {
				context: {
					recordType: 'Organization recurring expense',
					start: `${this.getMonthString(
						selectedExpense.startMonth
					)}, ${selectedExpense.startYear}`,
					current: `${this.getMonthString(
						this.selectedDate.getMonth() + 1
					)}, ${this.selectedDate.getFullYear()}`,
					end: selectedExpense.endMonth
						? `${this.getMonthString(selectedExpense.endMonth)}, ${
								selectedExpense.endYear
						  }`
						: 'end'
				}
			})
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				const id = selectedExpense.id;
				await this.organizationRecurringExpenseService.delete(id, {
					deletionType: result,
					month: this.selectedDate.getMonth() + 1,
					year: this.selectedDate.getFullYear()
				});
				this.selectedRowIndexToShow = null;

				this.toastrService.primary(
					this.selectedOrg.name + ' recurring expense deleted.',
					'Success'
				);
				setTimeout(() => {
					this._loadOrgRecurringExpense();
				}, 100);
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
		}
	}

	async addOrganizationRecurringExpense() {
		const result = await this.dialogService
			.open(RecurringExpenseMutationComponent, {
				context: {
					componentType: COMPONENT_TYPE.ORGANIZATION
				}
			})
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				await this.organizationRecurringExpenseService.create({
					orgId: this.selectedOrg.id,
					categoryName: result.categoryName,
					value: result.value,
					startDay: 1,
					startYear: this.selectedDate.getFullYear(),
					startMonth: this.selectedDate.getMonth() + 1,
					startDate: new Date(
						this.selectedDate.getFullYear(),
						this.selectedDate.getMonth(),
						1
					),
					currency: result.currency
				});

				this.toastrService.primary(
					this.selectedOrg.name + ' recurring expense set.',
					'Success'
				);
				this._loadOrgRecurringExpense();
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
		}
	}

	async editOrganizationRecurringExpense(index: number) {
		const result = await this.dialogService
			.open(RecurringExpenseMutationComponent, {
				context: {
					recurringExpense: this.selectedOrgRecurringExpense[index],
					componentType: COMPONENT_TYPE.ORGANIZATION
				}
			})
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				const id = this.selectedOrgRecurringExpense[index].id;
				await this.organizationRecurringExpenseService.update(id, {
					...result,
					startDay: 1,
					startMonth: this.selectedDate.getMonth() + 1,
					startYear: this.selectedDate.getFullYear()
				});
				this.selectedRowIndexToShow = null;
				this._loadOrgRecurringExpense();

				this.toastrService.primary(
					this.selectedOrg.name + ' recurring expense edited.',
					'Success'
				);
				setTimeout(() => {
					this._loadOrgRecurringExpense();
				}, 300);
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
		}
	}

	private async loadEmployeesCount() {
		const { total } = await this.employeesService
			.getAll([], { organization: { id: this.selectedOrg.id } })
			.pipe(first())
			.toPromise();

		this.employeesCount = total;
	}

	private async _loadOrgRecurringExpense() {
		if (this.selectedOrg && this.selectedDate) {
			this.selectedOrgRecurringExpense = (
				await this.organizationRecurringExpenseService.getAll({
					orgId: this.selectedOrg.id,
					year: this.selectedDate.getFullYear(),
					month: this.selectedDate.getMonth() + 1
				})
			).items;
			this.loading = false;
		}
	}
}
