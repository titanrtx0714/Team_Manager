import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/common-angular';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { NbTabComponent } from '@nebular/theme';
import { IEmployee, IEmployeeJobsStatisticsResponse, IOrganization, ISelectedEmployee } from '@gauzy/contracts';
import { EmployeeLinksComponent } from './../../../../@shared/table-components';
import {
	IPaginationBase,
	PaginationFilterBaseComponent
} from './../../../../@shared/pagination/pagination-filter-base.component';
import { EmployeesService, Store, ToastrService } from './../../../../@core/services';
import { SmartTableToggleComponent } from './../../../../@shared/smart-table/smart-table-toggle/smart-table-toggle.component';
import { ServerDataSource } from './../../../../@core/utils/smart-table';
import { API_PREFIX } from './../../../../@core/constants';
import { NumberEditorComponent } from 'apps/gauzy/src/app/@shared/table-components/editors/number-editor.component';

export enum JobSearchTabsEnum {
	BROWSE = 'BROWSE',
	SEARCH = 'SEARCH',
	HISTORY = 'HISTORY'
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-job-employees',
	templateUrl: './employees.component.html',
	styleUrls: ['./employees.component.scss'],
	providers: [CurrencyPipe]
})
export class EmployeesComponent extends PaginationFilterBaseComponent implements AfterViewInit, OnInit, OnDestroy {
	jobSearchTabsEnum = JobSearchTabsEnum;
	loading: boolean = false;
	settingsSmartTable: any;
	employees$: Subject<any> = new Subject();
	smartTableSource: ServerDataSource;
	public selectedEmployeeId: ISelectedEmployee['id'];
	public organization: IOrganization;
	nbTab$: Subject<string> = new BehaviorSubject(JobSearchTabsEnum.BROWSE);
	selectedEmployee: IEmployee;
	disableButton: boolean = true;

	constructor(
		private readonly http: HttpClient,
		private readonly router: Router,
		private readonly store: Store,
		public readonly translateService: TranslateService,
		private readonly employeesService: EmployeesService,
		private readonly toastrService: ToastrService,
		private readonly currencyPipe: CurrencyPipe
	) {
		super(translateService);
	}

	ngOnInit(): void {
		this._applyTranslationOnSmartTable();
		this._loadSmartTableSettings();
	}

	ngAfterViewInit(): void {
		this.employees$
			.pipe(
				debounceTime(100),
				tap(() => this.getActiveJobEmployees()),
				untilDestroyed(this)
			)
			.subscribe();
		this.pagination$
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				tap(() => this.employees$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
		const storeOrganization$ = this.store.selectedOrganization$;
		const storeEmployee$ = this.store.selectedEmployee$;
		combineLatest([storeOrganization$, storeEmployee$])
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				filter(([organization]) => !!organization),
				tap(([organization, employee]) => {
					this.organization = organization;
					this.selectedEmployeeId = employee ? employee.id : null;
				}),
				tap(() => this.employees$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/*
	 * Register Smart Table Source Config
	 */
	setSmartTableSource() {
		if (!this.organization) {
			return;
		}
		this.loading = true;

		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		this.smartTableSource = new ServerDataSource(this.http, {
			endPoint: `${API_PREFIX}/employee/job-statistics`,
			relations: ['user'],
			where: {
				tenantId,
				organizationId,
				isActive: true,
				...(this.selectedEmployeeId
					? {
							id: this.selectedEmployeeId
					  }
					: {}),
				...(this.filters.where ? this.filters.where : {})
			},
			finalize: () => {
				this.setPagination({
					...this.getPagination(),
					totalItems: this.smartTableSource.count()
				});
				this.loading = false;
			}
		});
	}

	/**
	 * Get jobs active employees
	 *
	 * @returns
	 */
	async getActiveJobEmployees() {
		if (!this.organization) {
			return;
		}
		try {
			this.setSmartTableSource();

			const { activePage, itemsPerPage } = this.getPagination();
			this.smartTableSource.setPaging(activePage, itemsPerPage, false);
		} catch (error) {
			this.toastrService.danger(error);
		}
	}

	private _loadSmartTableSettings() {
		const pagination: IPaginationBase = this.getPagination();
		this.settingsSmartTable = {
			selectedRowIndex: -1,
			hideSubHeader: true,
			noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.EMPLOYEE'),
			editable: true,
			actions: {
				delete: false
			},
			pager: {
				display: false,
				perPage: pagination ? pagination.itemsPerPage : 10
			},
			edit: {
				editButtonContent: '<i class="nb-edit"></i>',
				saveButtonContent: '<i class="nb-checkmark"></i>',
				cancelButtonContent: '<i class="nb-close"></i>',
				confirmSave: true
			},
			columns: {
				employeeId: {
					title: this.getTranslation('JOB_EMPLOYEE.EMPLOYEE'),
					width: '40%',
					type: 'custom',
					sort: false,
					editable: false,
					renderComponent: EmployeeLinksComponent,
					valuePrepareFunction: (cell, row: IEmployeeJobsStatisticsResponse) => {
						return {
							name: row.user ? row.user.name : null,
							imageUrl: row.user ? row.user.imageUrl : null,
							id: row.id
						};
					}
				},
				availableJobs: {
					title: this.getTranslation('JOB_EMPLOYEE.AVAILABLE_JOBS'),
					type: 'text',
					width: '10%',
					sort: false,
					editable: false,
					valuePrepareFunction: (cell, row: IEmployeeJobsStatisticsResponse) => {
						return row.availableJobs || 0;
					}
				},
				appliedJobs: {
					title: this.getTranslation('JOB_EMPLOYEE.APPLIED_JOBS'),
					type: 'text',
					width: '10%',
					sort: false,
					editable: false,
					valuePrepareFunction: (cell, row: IEmployeeJobsStatisticsResponse) => {
						return row.appliedJobs || 0;
					}
				},
				billRateValue: {
					title: this.getTranslation('JOB_EMPLOYEE.BILLING_RATE'),
					type: 'text',
					width: '10%',
					sort: false,
					editable: true,
					editor: {
						type: 'custom',
						component: NumberEditorComponent
					},
					valuePrepareFunction: (cell: number, row: IEmployeeJobsStatisticsResponse) => {
						return this.currencyPipe.transform(cell, row?.billRateCurrency);
					}
				},
				minimumBillingRate: {
					title: this.getTranslation('JOB_EMPLOYEE.MINIMUM_BILLING_RATE'),
					type: 'text',
					width: '10%',
					sort: false,
					editable: true,
					editor: {
						type: 'custom',
						component: NumberEditorComponent
					},
					valuePrepareFunction: (cell: number, row: IEmployeeJobsStatisticsResponse) => {
						return this.currencyPipe.transform(cell, row?.billRateCurrency);
					}
				},
				isJobSearchActive: {
					title: this.getTranslation('JOB_EMPLOYEE.JOB_SEARCH_STATUS'),
					type: 'custom',
					width: '20%',
					editable: false,
					renderComponent: SmartTableToggleComponent,
					valuePrepareFunction: (cell, row: IEmployeeJobsStatisticsResponse) => {
						return {
							checked: row.isJobSearchActive,
							onChange: (toggleValue: boolean) => this.updateJobSearchAvailability(row, toggleValue)
						};
					}
				}
			}
		};
	}

	/**
	 * Edit editable field event
	 *
	 * @param event
	 */
	async onEditConfirm(event: any) {
		if (!this.organization) {
			return;
		}
		try {
			const { tenantId } = this.store.user;
			const { id: organizationId } = this.organization;

			const employeeId = event.data?.id;

			const billRateValue = event.newData?.billRateValue;
			const minimumBillingRate = event.newData?.minimumBillingRate;

			// Update employee bill rates
			await this.employeesService.updateProfile(employeeId, {
				minimumBillingRate,
				billRateValue,
				tenantId,
				organizationId
			});
		} catch (error) {
			console.log('Error while updating employee rates', error);
			await event.confirm.reject();
		} finally {
			// Refresh smart table source
			this.employees$.next(true);
		}
	}

	async updateJobSearchAvailability(employee: IEmployee, isJobSearchActive: boolean): Promise<void> {
		if (!this.organization) {
			return;
		}
		try {
			const { tenantId } = this.store.user;
			const { id: organizationId } = this.organization;

			await this.employeesService
				.updateJobSearchStatus(employee.id, {
					isJobSearchActive,
					organizationId,
					tenantId
				})
				.then(() => {
					if (isJobSearchActive) {
						this.toastrService.success('TOASTR.MESSAGE.EMPLOYEE_JOB_STATUS_ACTIVE', {
							name: employee.fullName.trim()
						});
					} else {
						this.toastrService.success('TOASTR.MESSAGE.EMPLOYEE_JOB_STATUS_INACTIVE', {
							name: employee.fullName.trim()
						});
					}
				});
		} catch (error) {
			this.toastrService.danger(error);
		}
	}

	private _applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(
				tap(() => this._loadSmartTableSettings()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/**
	 * On change tab
	 *
	 * @param tab
	 */
	onTabChange(tab: NbTabComponent) {}

	/**
	 * On select employee
	 *
	 * @param param0
	 */
	onSelectEmployee({ isSelected, data }) {
		this.disableButton = !isSelected;
		this.selectedEmployee = isSelected ? data : null;
	}

	/**
	 * Edit employee
	 *
	 * @param selectedItem
	 */
	edit(selectedItem?: IEmployee) {
		if (selectedItem) {
			this.onSelectEmployee({
				isSelected: true,
				data: selectedItem
			});
		}
		this.router.navigate(['/pages/employees/edit/', this.selectedEmployee.id]);
	}

	ngOnDestroy(): void {}
}
