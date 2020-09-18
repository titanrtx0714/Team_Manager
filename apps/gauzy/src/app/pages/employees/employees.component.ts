import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	ActivatedRoute,
	Router,
	RouterEvent,
	NavigationEnd
} from '@angular/router';
import {
	InvitationTypeEnum,
	PermissionsEnum,
	ComponentLayoutStyleEnum,
	IOrganization
} from '@gauzy/models';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { EmployeesService } from '../../@core/services/employees.service';
import { ErrorHandlingService } from '../../@core/services/error-handling.service';
import { Store } from '../../@core/services/store.service';
import { monthNames } from '../../@core/utils/date';
import { EmployeeEndWorkComponent } from '../../@shared/employee/employee-end-work-popup/employee-end-work.component';
import { EmployeeMutationComponent } from '../../@shared/employee/employee-mutation/employee-mutation.component';
import { InviteMutationComponent } from '../../@shared/invite/invite-mutation/invite-mutation.component';
import { DeleteConfirmationComponent } from '../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { EmployeeAverageBonusComponent } from './table-components/employee-average-bonus/employee-average-bonus.component';
import { EmployeeAverageExpensesComponent } from './table-components/employee-average-expenses/employee-average-expenses.component';
import { EmployeeAverageIncomeComponent } from './table-components/employee-average-income/employee-average-income.component';
import { EmployeeWorkStatusComponent } from './table-components/employee-work-status/employee-work-status.component';
import { TranslationBaseComponent } from '../../@shared/language-base/translation-base.component';
import { PictureNameTagsComponent } from '../../@shared/table-components/picture-name-tags/picture-name-tags.component';
import { ComponentEnum } from '../../@core/constants/layout.constants';

interface EmployeeViewModel {
	fullName: string;
	email: string;
	bonus?: number;
	endWork?: any;
	id: string;
}

@Component({
	templateUrl: './employees.component.html',
	styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	organizationName: string;
	settingsSmartTable: object;
	sourceSmartTable = new LocalDataSource();
	selectedEmployee: EmployeeViewModel;
	employeeData: EmployeeViewModel[];
	selectedOrganization: IOrganization;
	selectedOrganizationId: string;
	viewComponentName: ComponentEnum;
	disableButton = true;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	private _ngDestroy$ = new Subject<void>();
	incomeStatistics: number[];
	expenseStatistics: number[];
	profitStatistics: number[];
	bonusStatistics: number[];
	averageBonus: number;
	averageExpense: number;
	averageIncome: number;
	statistics: any;
	employeeName = 'Employee';

	difference = 0;
	bonus = 0;
	totalIncome = 0;
	totalExpense = 0;
	bonusForSelectedMonth = 0;

	includeDeleted = false;
	loading = true;
	hasEditPermission = false;
	hasEditExpensePermission = false;
	hasInviteEditPermission = false;
	hasInviteViewOrEditPermission = false;
	organizationInvitesAllowed = false;
	month;
	year;

	@ViewChild('employeesTable') employeesTable;

	constructor(
		private employeesService: EmployeesService,
		private dialogService: NbDialogService,
		private store: Store,
		private router: Router,
		private toastrService: NbToastrService,
		private route: ActivatedRoute,
		private translate: TranslateService,
		private errorHandler: ErrorHandlingService
	) {
		super(translate);
		this.setView();
	}

	async ngOnInit() {
		this.store.userRolePermissions$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this.hasEditPermission = this.store.hasPermission(
					PermissionsEnum.ORG_EMPLOYEES_EDIT
				);
				this.hasInviteEditPermission = this.store.hasPermission(
					PermissionsEnum.ORG_INVITE_EDIT
				);
				this.hasInviteViewOrEditPermission =
					this.store.hasPermission(PermissionsEnum.ORG_INVITE_VIEW) ||
					this.hasInviteEditPermission;

				this.hasEditExpensePermission = this.store.hasPermission(
					PermissionsEnum.ORG_EXPENSES_EDIT
				);
			});

		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((organization) => {
				if (organization) {
					this.selectedOrganization = organization;
					this.selectedOrganizationId = organization.id;
					this.organizationInvitesAllowed =
						organization.invitesAllowed;
					this.loadPage();
				}
			});

		this._loadSmartTableSettings();
		this._applyTranslationOnSmartTable();

		this.route.queryParamMap
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((params) => {
				if (params.get('openAddDialog')) {
					this.add();
				}
			});
		this.router.events
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((event: RouterEvent) => {
				if (event instanceof NavigationEnd) {
					this.setView();
				}
			});
	}

	setView() {
		this.viewComponentName = ComponentEnum.EMPLOYEES;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((componentLayout) => {
				this.dataLayoutStyle = componentLayout;
			});
	}

	selectEmployeeTmp({ isSelected, data }) {
		const selectedEmployee = isSelected ? data : null;
		if (this.employeesTable) {
			this.employeesTable.grid.dataSet.willSelect = false;
		}
		this.disableButton = !isSelected;
		this.selectedEmployee = selectedEmployee;
		if (this.selectedEmployee) {
			const checkName = this.selectedEmployee.fullName.trim();
			this.employeeName = checkName ? checkName : 'Employee';
		}
	}

	async add() {
		const dialog = this.dialogService.open(EmployeeMutationComponent);

		const response = await dialog.onClose.pipe(first()).toPromise();
		if (response) {
			response.map((data) => {
				if (data.user.firstName || data.user.lastName) {
					this.employeeName =
						data.user.firstName + ' ' + data.user.lastName;
				}
				this.toastrService.primary(
					this.employeeName.trim() +
						' added to ' +
						data.organization.name,
					'Success'
				);
			});

			this.loadPage();
		}
	}

	edit(selectedItem?: EmployeeViewModel) {
		if (selectedItem) {
			this.selectEmployeeTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.router.navigate([
			'/pages/employees/edit/' + this.selectedEmployee.id
		]);
	}

	manageInvites() {
		this.router.navigate(['/pages/employees/invites']);
	}

	async invite() {
		const dialog = this.dialogService.open(InviteMutationComponent, {
			context: {
				invitationType: InvitationTypeEnum.EMPLOYEE,
				selectedOrganizationId: this.selectedOrganizationId,
				currentUserId: this.store.userId,
				selectedOrganization: this.selectedOrganization
			}
		});

		await dialog.onClose.pipe(first()).toPromise();
	}

	async delete(selectedItem?: EmployeeViewModel) {
		if (selectedItem) {
			this.selectEmployeeTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.dialogService
			.open(DeleteConfirmationComponent, {
				context: {
					recordType:
						this.selectedEmployee.fullName +
						' ' +
						this.getTranslation('FORM.DELETE_CONFIRMATION.EMPLOYEE')
				}
			})
			.onClose.pipe(takeUntil(this._ngDestroy$))
			.subscribe(async (result) => {
				if (result) {
					try {
						await this.employeesService.setEmployeeAsInactive(
							this.selectedEmployee.id
						);

						this.toastrService.primary(
							this.employeeName + ' set as inactive.',
							'Success'
						);

						this.loadPage();
					} catch (error) {
						this.errorHandler.handleError(error);
					}
				}
			});
	}

	async endWork(selectedItem?: EmployeeViewModel) {
		if (selectedItem) {
			this.selectEmployeeTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		const dialog = this.dialogService.open(EmployeeEndWorkComponent, {
			context: {
				endWorkValue: this.selectedEmployee.endWork,
				employeeFullName: this.selectedEmployee.fullName
			}
		});

		const data = await dialog.onClose.pipe(first()).toPromise();

		if (data) {
			try {
				await this.employeesService.setEmployeeEndWork(
					this.selectedEmployee.id,
					data
				);
				this.toastrService.primary(
					this.employeeName + ' set as inactive.',
					'Success'
				);
			} catch (error) {
				this.errorHandler.handleError(error);
			}
			this.selectedEmployee = null;
			this.loadPage();
		}
	}

	async backToWork(selectedItem?: EmployeeViewModel) {
		if (selectedItem) {
			this.selectEmployeeTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		const dialog = this.dialogService.open(EmployeeEndWorkComponent, {
			context: {
				backToWork: true,
				employeeFullName: this.selectedEmployee.fullName
			}
		});

		const data = await dialog.onClose.pipe(first()).toPromise();

		if (data) {
			try {
				await this.employeesService.setEmployeeEndWork(
					this.selectedEmployee.id,
					null
				);
				this.toastrService.primary(
					this.employeeName + ' set as active.',
					'Success'
				);
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
			this.selectedEmployee = null;
			this.loadPage();
		}
	}

	private async loadPage() {
		this.selectedEmployee = null;

		const { items } = await this.employeesService
			.getAll(['user', 'tags'], {
				organization: {
					id: this.selectedOrganizationId,
					tenantId: this.selectedOrganization.tenantId
				}
			})
			.pipe(first())
			.toPromise();
		const { name } = this.store.selectedOrganization;

		let employeesVm = [];
		const result = [];
		for (const emp of items) {
			result.push({
				fullName: `${emp.user.firstName} ${emp.user.lastName}`,
				email: emp.user.email,
				id: emp.id,
				isActive: emp.isActive,
				endWork: emp.endWork ? new Date(emp.endWork) : '',
				workStatus: emp.endWork
					? new Date(emp.endWork).getDate() +
					  ' ' +
					  monthNames[new Date(emp.endWork).getMonth()] +
					  ' ' +
					  new Date(emp.endWork).getFullYear()
					: '',
				imageUrl: emp.user.imageUrl,
				tags: emp.tags,
				// TODO: laod real bonus and bonusDate
				bonus: this.bonusForSelectedMonth,
				averageIncome: Math.floor(emp.averageIncome),
				averageExpenses: Math.floor(emp.averageExpenses),
				averageBonus: Math.floor(emp.averageBonus),
				bonusDate: Date.now(),
				startedWorkOn: emp.startedWorkOn
			});
		}
		if (!this.includeDeleted) {
			result.forEach((employee) => {
				if (employee.isActive) {
					employeesVm.push(employee);
				}
			});
		} else {
			employeesVm = result;
		}
		this.employeeData = employeesVm;
		this.sourceSmartTable.load(employeesVm);

		if (this.employeesTable) {
			this.employeesTable.grid.dataSet.willSelect = 'false';
		}

		this.organizationName = name;

		this.loading = false;
	}

	private _loadSmartTableSettings() {
		const dateNow = new Date();
		this.month =
			monthNames[dateNow.getMonth() - 1] ||
			monthNames[monthNames.length - 1];
		this.year = monthNames[dateNow.getMonth() - 1]
			? dateNow.getFullYear()
			: dateNow.getFullYear() - 1;

		this.settingsSmartTable = {
			actions: false,
			columns: {
				fullName: {
					title: this.getTranslation('SM_TABLE.FULL_NAME'),
					type: 'custom',
					renderComponent: PictureNameTagsComponent,
					class: 'align-row'
				},
				email: {
					title: this.getTranslation('SM_TABLE.EMAIL'),
					type: 'email',
					class: 'email-column'
				},
				averageIncome: {
					title: this.getTranslation('SM_TABLE.INCOME'),
					type: 'custom',
					filter: false,
					class: 'text-center',
					renderComponent: EmployeeAverageIncomeComponent
				},
				averageExpenses: {
					title: this.getTranslation('SM_TABLE.EXPENSES'),
					type: 'custom',
					filter: false,
					class: 'text-center',
					renderComponent: EmployeeAverageExpensesComponent
				},
				averageBonus: {
					title: this.getTranslation('SM_TABLE.BONUS_AVG'),
					type: 'custom',
					filter: false,
					class: 'text-center',
					renderComponent: EmployeeAverageBonusComponent
				},
				workStatus: {
					title: this.getTranslation('SM_TABLE.WORK_STATUS'),
					type: 'custom',
					class: 'text-center',
					width: '200px',
					renderComponent: EmployeeWorkStatusComponent,
					filter: false
				}
			},
			pager: {
				display: true,
				perPage: 8
			}
		};
	}

	changeIncludeDeleted(checked: boolean) {
		this.includeDeleted = checked;
		this.loadPage();
	}

	private _applyTranslationOnSmartTable() {
		this.translate.onLangChange
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this._loadSmartTableSettings();
			});
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
