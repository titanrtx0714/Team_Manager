import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrganizationsService } from '../../@core/services/organizations.service';
import { OrganizationsFullnameComponent } from './table-components/organizations-fullname/organizations-fullname.component';
import { Organization } from '@gauzy/models';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { OrganizationsLogoComponent } from './table-components/organizations-logo/organizations-logo.component';
import { OrganizationsMutationComponent } from '../../@shared/organizations/organizations-mutation/organizations-mutation.component';
import { first } from 'rxjs/operators';
import { DeleteConfirmationComponent } from '../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EmployeesService } from '../../@core/services';

interface SelectedRow {
	data: Organization;
	isSelected: boolean;
	selected: Organization[];
	source: LocalDataSource;
}

@Component({
	templateUrl: './organizations.component.html',
	styleUrls: ['./organizations.component.scss']
})
export class OrganizationsComponent implements OnInit, OnDestroy {
	settingsSmartTable = {
		actions: false,
		columns: {
			imageUrl: {
				title: 'Logo',
				type: 'custom',
				width: '100px',
				renderComponent: OrganizationsLogoComponent
			},
			name: {
				title: 'Name',
				type: 'custom',
				renderComponent: OrganizationsFullnameComponent
			},
			totalEmployees: {
				title: 'Employees',
				type: 'number',
				width: '200px'
			},
			currency: {
				title: 'Currency',
				type: 'string',
				width: '200px'
			},
			status: {
				title: 'Status',
				type: 'boolean',
				width: '200px'
			}
		},
		pager: {
			display: true,
			perPage: 8
		}
	};

	selectedOrganization: Organization;
	smartTableSource = new LocalDataSource();

	constructor(
		private organizationsService: OrganizationsService,
		private toastrService: NbToastrService,
		private dialogService: NbDialogService,
		private router: Router,
		private employeesService: EmployeesService,
		private translateService: TranslateService
	) {}

	ngOnInit() {
		this._loadSmartTable();
	}

	selectOrganization(data: SelectedRow) {
		if (data.isSelected) {
			this.selectedOrganization = data.data;
		} else {
			this.selectedOrganization = null;
		}
	}

	async addOrganization() {
		const result = await this.dialogService
			.open(OrganizationsMutationComponent)
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				await this.organizationsService.create(result);
				this.toastrService.info('Organization created.', 'Success');
				this._loadSmartTable();
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
		}
	}

	async editOrganization() {
		this.router.navigate([
			'/pages/organizations/edit/' + this.selectedOrganization.id
		]);
	}

	async deleteOrganization() {
		const result = await this.dialogService
			.open(DeleteConfirmationComponent, {
				context: {
					recordType: 'Organization'
				}
			})
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				await this.organizationsService.delete(
					this.selectedOrganization.id
				);
				this.toastrService.info('Organization deleted.', 'Success');
				this._loadSmartTable();
			} catch (error) {
				this.toastrService.danger(
					error.error.message || error.message,
					'Error'
				);
			}
		}
	}

	private async _loadSmartTable() {
		try {
			const { items } = await this.organizationsService.getAll();

			for (const org of items) {
				const data = await this.employeesService
					.getAll([], { organization: { id: org.id } })
					.pipe(first())
					.toPromise();

				const isActive = org.isActive;

				isActive ? (org.status = 'Active') : (org.status = 'Archived');

				const activeEmployees = data.items.filter((i) => i.isActive);
				org.totalEmployees = activeEmployees.length;
			}

			this.smartTableSource.load(items);
		} catch (error) {
			this.toastrService.danger(
				error.error.message || error.message,
				'Error'
			);
		}
	}

	ngOnDestroy() {}
}
