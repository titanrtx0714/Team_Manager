import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Organization } from '@gauzy/models';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { EmployeesService } from '../../../@core/services';
import { OrganizationsService } from '../../../@core/services/organizations.service';
import { Store } from '../../../@core/services/store.service';
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
	selectedOrgFromHeader: Organization;
	employeesCount: number;
	private _ngDestroy$ = new Subject<void>();

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private organizationsService: OrganizationsService,
		private employeesService: EmployeesService,
		private store: Store,
		readonly translateService: TranslateService
	) {
		super(translateService);
	}

	async ngOnInit() {
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

	//Open the public page in a new tab
	editPublicPage() {
		window.open(
			'/share/organization/' + this.selectedOrg.profile_link,
			'_blank'
		);
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}

	private async loadEmployeesCount() {
		const { total } = await this.employeesService
			.getAll([], { organization: { id: this.selectedOrg.id } })
			.pipe(first())
			.toPromise();

		this.employeesCount = total;
	}
}
