import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
	FeatureEnum,
	IOrganization,
	IRolePermission,
	IUser,
	PermissionsEnum
} from '@gauzy/contracts';
import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, tap } from 'rxjs/operators';
import { NgxPermissionsService } from 'ngx-permissions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { chain } from 'underscore';
import { distinctUntilChange, isNotEmpty } from '@gauzy/common-angular';
import { SelectorService } from '../@core/utils/selector.service';
import { EmployeesService, Store, UsersService } from '../@core/services';
import { ReportService } from './reports/all-report/report.service';
import { AuthStrategy } from '../@core/auth/auth-strategy.service';
import { TranslationBaseComponent } from '../@shared/language-base';

interface GaMenuItem extends NbMenuItem {
	data: {
		translationKey: string; //Translation key for the title, mandatory for all items
		permissionKeys?: PermissionsEnum[]; //Check permissions and hide item if any given permission is not present
		featureKey?: FeatureEnum; //Check permissions and hide item if any given permission is not present
		withOrganizationShortcuts?: boolean; //Declare if the sidebar item has organization level shortcuts
		hide?: () => boolean; //Hide the menu item if this returns true
	};
}

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-pages',
	styleUrls: ['pages.component.scss'],
	template: `
		<ngx-one-column-layout *ngIf="!!menu && user">
			<gauzy-sidebar-menu [menu]="menu"></gauzy-sidebar-menu>
			<router-outlet></router-outlet>
		</ngx-one-column-layout>
	`
})
export class PagesComponent
	extends TranslationBaseComponent
	implements OnInit, OnDestroy
{
	isEmployee: boolean;
	organization: IOrganization;
	user: IUser;
	menu: NbMenuItem[] = [];
	reportMenuItems: NbMenuItem[] = [];

	constructor(
		private readonly employeeService: EmployeesService,
		public readonly translate: TranslateService,
		private readonly store: Store,
		private readonly reportService: ReportService,
		private readonly selectorService: SelectorService,
		private readonly router: Router,
		private readonly ngxPermissionsService: NgxPermissionsService,
		private readonly usersService: UsersService,
		private readonly authStrategy: AuthStrategy
	) {
		super(translate);
	}

	getMenuItems(): GaMenuItem[] {
		return [
			{
				title: 'Dashboard',
				icon: 'fas fa-th',
				link: '/pages/dashboard',
				pathMatch: 'prefix',
				home: true,
				data: {
					translationKey: 'MENU.DASHBOARD',
					featureKey: FeatureEnum.FEATURE_DASHBOARD
				}
			},
			{
				title: 'Focus',
				icon: 'fas fa-bullseye',
				link: '/pages/dashboard',
				pathMatch: 'prefix',
				home: true,
				data: {
					translationKey: 'MENU.FOCUS',
					featureKey: FeatureEnum.FEATURE_DASHBOARD
				}
			},
			{
				title: 'Applications',
				icon: 'far fa-window-maximize',
				link: '/pages/dashboard',
				pathMatch: 'prefix',
				home: true,
				data: {
					translationKey: 'MENU.APPLICATIONS',
					featureKey: FeatureEnum.FEATURE_DASHBOARD
				}
			},
			{
				title: 'Accounting',
				icon: 'far fa-address-card',
				data: {
					translationKey: 'MENU.ACCOUNTING'
				},
				children: [
					{
						title: 'Estimates',
						icon: 'file-outline',
						link: '/pages/accounting/invoices/estimates',
						data: {
							translationKey: 'MENU.ESTIMATES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.ESTIMATES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_ESTIMATE
						}
					},
					{
						title: 'Estimates Received',
						icon: 'archive-outline',
						link: '/pages/accounting/invoices/received-estimates',
						data: {
							translationKey: 'MENU.ESTIMATES_RECEIVED',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.ESTIMATES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_ESTIMATE_RECEIVED
						}
					},
					{
						title: 'Invoices',
						icon: 'file-text-outline',
						link: '/pages/accounting/invoices',
						pathMatch: 'full',
						data: {
							translationKey: 'MENU.INVOICES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.INVOICES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_INVOICE
						}
					},
					{
						title: 'Invoices Recurring',
						icon: 'flip-outline',
						link: '/pages/accounting/invoices/recurring',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.RECURRING_INVOICES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.INVOICES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_INVOICE_RECURRING
						}
					},
					{
						title: 'Invoices Received',
						icon: 'archive',
						link: '/pages/accounting/invoices/received-invoices',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.INVOICES_RECEIVED',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.INVOICES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_INVOICE_RECEIVED
						}
					},
					{
						title: 'Income',
						icon: 'plus-circle-outline',
						link: '/pages/accounting/income',
						data: {
							translationKey: 'MENU.INCOME',
							permissionKeys: [PermissionsEnum.ORG_INCOMES_VIEW],
							featureKey: FeatureEnum.FEATURE_INCOME
						}
					},
					{
						title: 'Expenses',
						icon: 'minus-circle-outline',
						link: '/pages/accounting/expenses',
						data: {
							translationKey: 'MENU.EXPENSES',
							permissionKeys: [PermissionsEnum.ORG_EXPENSES_VIEW],
							featureKey: FeatureEnum.FEATURE_EXPENSE
						}
					},
					{
						title: 'Expense Recurring',
						icon: 'flip-outline',
						link: '/pages/accounting/expense-recurring',
						data: {
							translationKey:
								'ORGANIZATIONS_PAGE.EXPENSE_RECURRING',
							permissionKeys: [PermissionsEnum.ORG_EXPENSES_VIEW],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_RECURRING_EXPENSE
						}
					},
					{
						title: 'Payments',
						icon: 'clipboard-outline',
						link: '/pages/accounting/payments',
						data: {
							translationKey: 'MENU.PAYMENTS',
							permissionKeys: [PermissionsEnum.ORG_PAYMENT_VIEW],
							featureKey: FeatureEnum.FEATURE_PAYMENT
						}
					}
				]
			},
			{
				title: 'Sales',
				icon: 'fas fa-chart-line',
				link: '/pages/sales',
				data: {
					translationKey: 'MENU.SALES',
					permissionKeys: [PermissionsEnum.ORG_PROPOSALS_VIEW]
				},
				children: [
					{
						title: 'Proposals',
						icon: 'paper-plane-outline',
						link: '/pages/sales/proposals',
						data: {
							translationKey: 'MENU.PROPOSALS',
							permissionKeys: [
								PermissionsEnum.ORG_PROPOSALS_VIEW
							],
							featureKey: FeatureEnum.FEATURE_PROPOSAL
						}
					},
					{
						title: 'Estimates',
						icon: 'file-outline',
						link: '/pages/sales/invoices/estimates',
						data: {
							translationKey: 'MENU.ESTIMATES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.ESTIMATES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_PROPOSAL
						}
					},
					{
						title: 'Invoices',
						icon: 'file-text-outline',
						link: '/pages/sales/invoices',
						data: {
							translationKey: 'MENU.INVOICES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.INVOICES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_INVOICE
						}
					},
					{
						title: 'Invoices Recurring',
						icon: 'flip-outline',
						link: '/pages/sales/invoices/recurring',
						data: {
							translationKey: 'MENU.RECURRING_INVOICES',
							permissionKeys: [
								PermissionsEnum.ALL_ORG_VIEW,
								PermissionsEnum.INVOICES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_INVOICE_RECURRING
						}
					},
					{
						title: 'Payments',
						icon: 'clipboard-outline',
						link: '/pages/sales/payments',
						data: {
							translationKey: 'MENU.PAYMENTS',
							permissionKeys: [PermissionsEnum.ORG_PAYMENT_VIEW],
							featureKey: FeatureEnum.FEATURE_PAYMENT
						}
					},
					{
						title: 'Pipelines',
						icon: 'funnel-outline',
						link: '/pages/sales/pipelines',
						data: {
							translationKey: 'MENU.PIPELINES',
							permissionKeys: [
								PermissionsEnum.VIEW_SALES_PIPELINES
							],
							featureKey: FeatureEnum.FEATURE_PIPELINE
						}
					}
				]
			},
			{
				title: 'Tasks',
				icon: 'fas fa-tasks',
				link: '/pages/tasks',
				data: {
					translationKey: 'MENU.TASKS'
				},
				children: [
					{
						title: 'Dashboard',
						icon: 'list-outline',
						link: '/pages/tasks/dashboard',
						data: {
							translationKey: 'MENU.DASHBOARD',
							featureKey: FeatureEnum.FEATURE_DASHBOARD_TASK
						}
					},
					{
						title: 'My Tasks',
						icon: 'person-outline',
						link: '/pages/tasks/me',
						data: {
							translationKey: 'MENU.MY_TASKS',
							hide: () => !this.isEmployee,
							featureKey: FeatureEnum.FEATURE_MY_TASK
						}
					},
					{
						title: "Team's Tasks",
						icon: 'people-outline',
						link: '/pages/tasks/team',
						data: {
							translationKey: 'MENU.TEAM_TASKS',
							featureKey: FeatureEnum.FEATURE_TEAM_TASK
						}
					}
				]
			},
			{
				title: 'Jobs',
				icon: 'fas fa-briefcase',
				link: '/pages/jobs',
				data: {
					translationKey: 'MENU.JOBS',
					featureKey: FeatureEnum.FEATURE_JOB
				},
				children: [
					{
						title: 'Employee',
						icon: 'people-outline',
						link: '/pages/jobs/employee',
						data: {
							translationKey: 'MENU.EMPLOYEES',
							permissionKeys: [
								PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW
							]
						}
					},
					{
						title: 'Browse',
						icon: 'list-outline',
						link: '/pages/jobs/search',
						data: {
							translationKey: 'MENU.JOBS_SEARCH'
						}
					},
					{
						title: 'Matching',
						icon: 'person-outline',
						link: '/pages/jobs/matching',
						data: {
							translationKey: 'MENU.JOBS_MATCHING',
							permissionKeys: [
								PermissionsEnum.ORG_JOB_MATCHING_VIEW
							]
						}
					},
					{
						title: 'Proposal Template',
						icon: 'file-text-outline',
						link: '/pages/jobs/proposal-template',
						data: {
							translationKey: 'MENU.PROPOSAL_TEMPLATE',
							permissionKeys: [
								PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW
							]
						}
					}
				]
			},
			{
				title: 'Employees',
				icon: 'fas fa-user-friends',
				data: {
					translationKey: 'MENU.EMPLOYEES'
				},
				children: [
					{
						title: 'Manage',
						icon: 'list-outline',
						link: '/pages/employees',
						pathMatch: 'full',
						data: {
							translationKey: 'MENU.MANAGE',
							permissionKeys: [
								PermissionsEnum.ORG_EMPLOYEES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_EMPLOYEES
						}
					},
					{
						title: 'Time & Activity',
						icon: 'trending-up-outline',
						link: '/pages/employees/activity',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.TIME_ACTIVITY',
							featureKey:
								FeatureEnum.FEATURE_EMPLOYEE_TIME_ACTIVITY
						}
					},
					{
						title: 'Timesheets',
						icon: 'clock-outline',
						link: '/pages/employees/timesheets',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.TIMESHEETS',
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_TIMESHEETS
						}
					},
					{
						title: 'Appointments',
						icon: 'calendar-outline',
						link: '/pages/employees/appointments',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.APPOINTMENTS',
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_APPOINTMENT
						}
					},
					{
						title: 'Approvals',
						icon: 'flip-2-outline',
						link: '/pages/employees/approvals',
						data: {
							translationKey: 'MENU.APPROVALS',
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_APPROVAL
						}
					},
					{
						title: 'Employee Levels',
						icon: 'bar-chart-outline',
						link: `/pages/employees/employee-level`,
						data: {
							translationKey: 'MENU.EMPLOYEE_LEVEL',
							permissionKeys: [PermissionsEnum.ALL_ORG_VIEW],
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_LEVEL
						}
					},
					{
						title: 'Positions',
						icon: 'award-outline',
						link: `/pages/employees/positions`,
						data: {
							translationKey: 'MENU.POSITIONS',
							permissionKeys: [PermissionsEnum.ALL_ORG_VIEW],
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_POSITION
						}
					},
					{
						title: 'Time Off',
						icon: 'eye-off-2-outline',
						link: '/pages/employees/time-off',
						data: {
							translationKey: 'MENU.TIME_OFF',
							permissionKeys: [PermissionsEnum.ORG_TIME_OFF_VIEW],
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_TIMEOFF
						}
					},
					{
						title: 'Recurring Expenses',
						icon: 'flip-outline',
						link: '/pages/employees/recurring-expenses',
						data: {
							translationKey: 'MENU.RECURRING_EXPENSE',
							permissionKeys: [
								PermissionsEnum.EMPLOYEE_EXPENSES_VIEW
							],
							featureKey:
								FeatureEnum.FEATURE_EMPLOYEE_RECURRING_EXPENSE
						}
					},
					{
						title: 'Candidates',
						icon: 'person-done-outline',
						link: '/pages/employees/candidates',
						data: {
							translationKey: 'MENU.CANDIDATES',
							permissionKeys: [
								PermissionsEnum.ORG_CANDIDATES_VIEW
							],
							featureKey: FeatureEnum.FEATURE_EMPLOYEE_CANDIDATE
						}
					}
				]
			},
			{
				title: 'Organization',
				icon: 'fas fa-globe-americas',
				data: {
					translationKey: 'MENU.ORGANIZATION',
					withOrganizationShortcuts: true
				},
				children: [
					{
						title: 'Manage',
						icon: 'fas fa-globe-americas',
						pathMatch: 'prefix',
						data: {
							organizationShortcut: true,
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							urlPrefix: `/pages/organizations/edit/`,
							urlPostfix: '',
							translationKey: 'MENU.MANAGE',
							featureKey: FeatureEnum.FEATURE_ORGANIZATION
						}
					},
					{
						title: 'Equipment',
						icon: 'fas fa-border-all',
						link: '/pages/organization/equipment',
						data: {
							permissionKeys: [PermissionsEnum.ALL_ORG_VIEW],
							translationKey: 'MENU.EQUIPMENT',
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_EQUIPMENT
						}
					},
					{
						title: 'Inventory',
						icon: 'fas fa-grip-vertical',
						link: '/pages/organization/inventory',
						pathMatch: 'prefix',
						data: {
							translationKey: 'MENU.INVENTORY',
							permissionKeys: [PermissionsEnum.ALL_ORG_VIEW],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_INVENTORY
						}
					},
					{
						title: 'Tags',
						icon: 'fas fa-tag',
						link: '/pages/organization/tags',
						data: {
							translationKey: 'MENU.TAGS',
							featureKey: FeatureEnum.FEATURE_ORGANIZATION_TAG
						}
					},
					{
						title: 'Vendors',
						icon: 'fas fa-truck',
						link: '/pages/organization/vendors',
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.VENDORS',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey: FeatureEnum.FEATURE_ORGANIZATION_VENDOR
						}
					},
					{
						title: 'Projects',
						icon: 'fas fa-book',
						link: `/pages/organization/projects`,
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.PROJECTS',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey: FeatureEnum.FEATURE_ORGANIZATION_PROJECT
						}
					},
					{
						title: 'Departments',
						icon: ' fas fa-briefcase',
						link: `/pages/organization/departments`,
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.DEPARTMENTS',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_DEPARTMENT
						}
					},
					{
						title: 'Teams',
						icon: 'fas fa-user-friends',
						link: `/pages/organization/teams`,
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.EDIT.TEAMS',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey: FeatureEnum.FEATURE_ORGANIZATION_TEAM
						}
					},
					{
						title: 'Documents',
						icon: 'far fa-file-alt',
						link: `/pages/organization/documents`,
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.DOCUMENTS',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_DOCUMENT
						}
					},
					{
						title: 'Employment Types',
						icon: 'fas fa-layer-group',
						link: `/pages/organization/employment-types`,
						data: {
							translationKey:
								'ORGANIZATIONS_PAGE.EMPLOYMENT_TYPES',
							permissionKeys: [PermissionsEnum.ALL_ORG_EDIT],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_EMPLOYMENT_TYPE
						}
					},
					{
						title: 'Expense Recurring',
						icon: 'fas fa-repeat',
						link: '/pages/organization/expense-recurring',
						data: {
							translationKey:
								'ORGANIZATIONS_PAGE.EXPENSE_RECURRING',
							permissionKeys: [PermissionsEnum.ORG_EXPENSES_VIEW],
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_RECURRING_EXPENSE
						}
					},
					{
						title: 'Help Center',
						icon: 'far fa-question-circle',
						link: '/pages/organization/help-center',
						data: {
							translationKey: 'ORGANIZATIONS_PAGE.HELP_CENTER',
							featureKey:
								FeatureEnum.FEATURE_ORGANIZATION_HELP_CENTER
						}
					}
				]
			},
			{
				title: 'Contacts',
				icon: 'far fa-address-book',
				data: {
					translationKey: 'MENU.CONTACTS',
					permissionKeys: [
						PermissionsEnum.ORG_CONTACT_VIEW,
						PermissionsEnum.ALL_ORG_VIEW
					],
					featureKey: FeatureEnum.FEATURE_CONTACT
				},
				children: [
					{
						title: 'Visitors',
						icon: 'book-open-outline',
						link: `/pages/contacts/visitors`,
						data: {
							translationKey: 'CONTACTS_PAGE.VISITORS'
						}
					},
					{
						title: 'Leads',
						icon: 'book-open-outline',
						link: `/pages/contacts/leads`,
						data: {
							translationKey: 'CONTACTS_PAGE.LEADS'
						}
					},
					{
						title: 'Customers',
						icon: 'book-open-outline',
						link: `/pages/contacts/customers`,
						data: {
							translationKey: 'CONTACTS_PAGE.CUSTOMERS'
						}
					},
					{
						title: 'Clients',
						icon: 'book-open-outline',
						link: `/pages/contacts/clients`,
						data: {
							translationKey: 'CONTACTS_PAGE.CLIENTS'
						}
					}
				]
			},
			{
				title: 'Goals',
				icon: 'fab fa-font-awesome-flag',
				data: {
					translationKey: 'MENU.GOALS'
				},
				children: [
					{
						title: 'Manage',
						link: '/pages/goals',
						pathMatch: 'full',
						icon: 'list-outline',
						data: {
							translationKey: 'MENU.MANAGE',
							featureKey: FeatureEnum.FEATURE_GOAL
						}
					},
					{
						title: 'Report',
						link: '/pages/goals/reports',
						icon: 'file-text-outline',
						data: {
							translationKey: 'MENU.REPORTS',
							featureKey: FeatureEnum.FEATURE_GOAL_REPORT
						}
					},
					{
						title: 'Settings',
						link: '/pages/goals/settings',
						icon: 'settings-outline',
						data: {
							translationKey: 'MENU.SETTINGS',
							featureKey: FeatureEnum.FEATURE_GOAL_SETTING
						}
					}
				]
			},
			{
				title: 'Reports',
				icon: 'fas fa-chart-pie',
				link: '/pages/reports',
				data: {
					translationKey: 'MENU.REPORTS',
					featureKey: FeatureEnum.FEATURE_REPORT
				},
				children: [
					{
						title: 'All Reports',
						link: '/pages/reports/all',
						icon: 'bar-chart-outline',
						data: {
							translationKey: 'MENU.ALL_REPORTS'
						}
					},
					...this.reportMenuItems
				]
			}
		];
	}

	async ngOnInit() {
		await this._createEntryPoint();
		this._applyTranslationOnSmartTable();

		this.store.user$
			.pipe(
				filter((user: IUser) => !!user),
				tap(() => this.checkForEmployee()),
				untilDestroyed(this)
			)
			.subscribe();
		this.store.selectedOrganization$
			.pipe(
				filter((organization: IOrganization) => !!organization),
				distinctUntilChange(),
				tap(
					(organization: IOrganization) =>
						(this.organization = organization)
				),
				tap(() => this.getReportsMenus()),
				untilDestroyed(this)
			)
			.subscribe();
		this.store.userRolePermissions$
			.pipe(
				filter((permissions: IRolePermission[]) =>
					isNotEmpty(permissions)
				),
				map((permissions) =>
					permissions.map(({ permission }) => permission)
				),
				tap((permissions) =>
					this.ngxPermissionsService.loadPermissions(permissions)
				),
				untilDestroyed(this)
			)
			.subscribe(() => {
				this.loadItems(
					this.selectorService.showSelectors(this.router.url)
						.showOrganizationShortcuts
				);
			});
		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.pipe(untilDestroyed(this))
			.subscribe((e) => {
				this.loadItems(
					this.selectorService.showSelectors(e['url'])
						.showOrganizationShortcuts
				);
			});
		this.reportService.menuItems$
			.pipe(distinctUntilChange(), untilDestroyed(this))
			.subscribe((menuItems) => {
				if (menuItems) {
					this.reportMenuItems = chain(menuItems)
						.values()
						.map((item) => {
							return {
								title: item.name,
								link: `/pages/reports/${item.slug}`,
								icon: item.iconClass,
								data: {
									translationKey: `${item.name}`
								}
							};
						})
						.value();
				} else {
					this.reportMenuItems = [];
				}

				this.menu = this.getMenuItems();
				this.loadItems(
					this.selectorService.showSelectors(this.router.url)
						.showOrganizationShortcuts
				);
			});
		this.store.featureOrganizations$
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.loadItems(
					this.selectorService.showSelectors(this.router.url)
						.showOrganizationShortcuts
				);
			});
		this.store.featureTenant$.pipe(untilDestroyed(this)).subscribe(() => {
			this.loadItems(
				this.selectorService.showSelectors(this.router.url)
					.showOrganizationShortcuts
			);
		});
		this.menu = this.getMenuItems();
	}

	async getReportsMenus() {
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		await this.reportService.getReportMenuItems({
			tenantId,
			organizationId
		});
		this.loadItems(
			this.selectorService.showSelectors(this.router.url)
				.showOrganizationShortcuts
		);
	}

	/*
	 * This is app entry point after login
	 */
	private async _createEntryPoint() {
		const id = this.store.userId;
		if (!id) return;

		this.user = await this.usersService.getMe([
			'employee',
			'employee.contact',
			'role',
			'role.rolePermissions',
			'tenant',
			'tenant.featureOrganizations',
			'tenant.featureOrganizations.feature'
		]);

		this.authStrategy.electronAuthentication({
			user: this.user,
			token: this.store.token
		});

		//When a new user registers & logs in for the first time, he/she does not have tenantId.
		//In this case, we have to redirect the user to the onboarding page to create their first organization, tenant, role.
		if (!this.user.tenantId) {
			this.router.navigate(['/onboarding/tenant']);
			return;
		}

		this.store.user = this.user;

		//tenant enabled/disabled features for relatives organizations
		const { tenant, role } = this.user;
		this.store.featureTenant = tenant.featureOrganizations.filter(
			(item) => !item.organizationId
		);

		//only enabled permissions assign to logged in user
		this.store.userRolePermissions = role.rolePermissions.filter(
			(permission) => permission.enabled
		);
	}

	loadItems(withOrganizationShortcuts: boolean) {
		this.menu.forEach((item) => {
			this.refreshMenuItem(item, withOrganizationShortcuts);
		});
	}

	refreshMenuItem(item, withOrganizationShortcuts) {
		item.title = this.getTranslation(item.data.translationKey);
		if (item.data.permissionKeys || item.data.hide) {
			const anyPermission = item.data.permissionKeys
				? item.data.permissionKeys.reduce((permission, key) => {
						return this.store.hasPermission(key) || permission;
				  }, false)
				: true;

			item.hidden =
				!anyPermission || (item.data.hide && item.data.hide());

			if (anyPermission && item.data.organizationShortcut) {
				item.hidden = !withOrganizationShortcuts || !this.organization;
				if (!item.hidden) {
					item.link =
						item.data.urlPrefix +
						this.organization.id +
						item.data.urlPostfix;
				}
			}
		}

		// enabled/disabled features from here
		if (item.data.hasOwnProperty('featureKey') && item.hidden !== true) {
			const { featureKey } = item.data;
			const enabled = !this.store.hasFeatureEnabled(featureKey);
			item.hidden = enabled || (item.data.hide && item.data.hide());
		}

		if (item.children) {
			item.children.forEach((childItem) => {
				this.refreshMenuItem(childItem, withOrganizationShortcuts);
			});
		}
	}

	checkForEmployee() {
		const { tenantId, id: userId } = this.store.user;
		this.employeeService
			.getEmployeeByUserId(userId, [], { tenantId })
			.then(({ success }) => {
				this.isEmployee = success;
			});
	}

	private _applyTranslationOnSmartTable() {
		this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
			this.loadItems(
				this.selectorService.showSelectors(this.router.url)
					.showOrganizationShortcuts
			);
		});
	}

	ngOnDestroy() {}
}
