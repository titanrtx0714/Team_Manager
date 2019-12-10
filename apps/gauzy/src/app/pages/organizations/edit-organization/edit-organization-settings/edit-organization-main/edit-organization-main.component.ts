import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrenciesEnum, Organization } from '@gauzy/models';
import { NbToastrService } from '@nebular/theme';
import { first } from 'rxjs/operators';
import { EmployeesService } from '../../../../../@core/services';
import { OrganizationsService } from '../../../../../@core/services/organizations.service';

@Component({
	selector: 'ga-edit-org-main',
	templateUrl: './edit-organization-main.component.html',
	styleUrls: ['./edit-organization-main.component.scss']
})
export class EditOrganizationMainComponent implements OnInit {
	@Input()
	organization: Organization;

	imageUrl: string;
	hoverState: boolean;
	employeesCount: number;

	form: FormGroup;

	currencies: string[] = Object.values(CurrenciesEnum);

	constructor(
		private fb: FormBuilder,
		private employeesService: EmployeesService,
		private organizationService: OrganizationsService,
		private toastrService: NbToastrService
	) {}

	updateImageUrl(url: string) {
		this.imageUrl = url;
	}

	handleImageUploadError(event: any) {}

	ngOnInit(): void {
		this._initializedForm();
		this.imageUrl = this.organization.imageUrl;
		this.loadEmployeesCount();
	}

	private async loadEmployeesCount() {
		const { total } = await this.employeesService
			.getAll([], { organization: { id: this.organization.id } })
			.pipe(first())
			.toPromise();

		this.employeesCount = total;
	}

	async updateOrganizationSettings() {
		this.organizationService.update(this.organization.id, {
			imageUrl: this.imageUrl,
			...this.form.getRawValue()
		});
		this.toastrService.primary(
			this.organization.name + ' organization main info updated.',
			'Success'
		);
		this.goBack();
	}

	goBack() {
		const currentURL = window.location.href;
		window.location.href = currentURL.substring(
			0,
			currentURL.indexOf('/settings')
		);
	}

	private _initializedForm() {
		this.form = this.fb.group({
			currency: [this.organization.currency, Validators.required],
			name: [this.organization.name, Validators.required],
			officialName: [this.organization.officialName],
			taxId: [this.organization.taxId]
		});
	}
}
