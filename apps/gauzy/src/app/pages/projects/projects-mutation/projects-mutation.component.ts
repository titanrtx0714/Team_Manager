import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
	CurrenciesEnum,
	Employee,
	Organization,
	OrganizationContact,
	OrganizationProjects,
	ProjectBillingEnum,
	Tag,
	ProjectOwnerEnum,
	TaskListTypeEnum
} from '@gauzy/models';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TranslationBaseComponent } from '../../../@shared/language-base/translation-base.component';
import { Store } from '../../../@core/services/store.service';
import { ErrorHandlingService } from '../../../@core/services/error-handling.service';
import { OrganizationContactService } from '../../../@core/services/organization-contact.service';

@Component({
	selector: 'ga-projects-mutation',
	templateUrl: './projects-mutation.component.html'
})
export class ProjectsMutationComponent extends TranslationBaseComponent
	implements OnInit {
	@Input()
	employees: Employee[];
	@Input()
	organization: Organization;
	@Input()
	project: OrganizationProjects;

	@Output()
	canceled = new EventEmitter();
	@Output()
	addOrEditProject = new EventEmitter();

	form: FormGroup;
	members: string[];
	selectedEmployeeIds: string[];
	billings: string[] = Object.values(ProjectBillingEnum);
	currencies: string[] = Object.values(CurrenciesEnum);
	defaultCurrency: string;
	public: Boolean = true;
	tags: Tag[] = [];
	organizationId: string;
	organizationContacts: Object[] = [];
	owners: string[] = Object.values(ProjectOwnerEnum);
	taskViewModeTypes: TaskListTypeEnum[] = Object.values(TaskListTypeEnum);
	showSprintManage = false;

	constructor(
		private readonly fb: FormBuilder,
		private readonly organizationContactService: OrganizationContactService,
		private readonly toastrService: NbToastrService,
		private store: Store,
		readonly translateService: TranslateService,
		private errorHandler: ErrorHandlingService,
		private readonly router: Router
	) {
		super(translateService);
	}

	ngOnInit() {
		this._initializeForm();
		this._getOrganizationContacts();
	}

	private async _getOrganizationContacts() {
		this.organizationId = this.store.selectedOrganization.id;
		const { items } = await this.organizationContactService.getAll([], {
			organizationId: this.store.selectedOrganization.id
		});
		items.forEach((i) => {
			this.organizationContacts = [
				...this.organizationContacts,
				{ name: i.name, organizationContactId: i.id }
			];
		});
	}

	changeProjectOwner(owner: ProjectOwnerEnum) {
		const clientControl = this.form.get('client');
		if (owner === ProjectOwnerEnum.INTERNAL) {
			clientControl.setValue('');
		}
	}

	private _initializeForm() {
		if (!this.organization) {
			return;
		}

		if (this.project) {
			this.selectedEmployeeIds = this.project.members.map(
				(member) => member.id
			);
		}

		this.defaultCurrency = this.organization.currency || 'USD';
		this.form = this.fb.group({
			tags: [this.project ? (this.tags = this.project.tags) : ''],
			public: this.project ? this.project.public : this.public,
			name: [this.project ? this.project.name : '', Validators.required],
			organizationContact: [
				this.project && this.project.organizationContact
					? this.project.organizationContact
					: ''
			],
			billing: [this.project ? this.project.billing : 'RATE'],
			currency: [
				{
					value: this.project
						? this.project.currency
						: this.defaultCurrency,
					disabled: true
				}
			],
			startDate: [this.project ? this.project.startDate : null],
			endDate: [this.project ? this.project.endDate : null],
			owner: [this.project ? this.project.owner : 'CLIENT'],
			taskViewMode: [this.project ? this.project.taskListType : 'GRID']
		});
	}

	togglePublic(state: boolean) {
		this.public = state;
	}

	onMembersSelected(members: string[]) {
		this.members = members;
	}

	cancel() {
		this.canceled.emit();
	}

	async submitForm() {
		if (this.form.valid) {
			this.addOrEditProject.emit({
				action: !this.project ? 'add' : 'edit',
				project: {
					tags: this.tags,
					public: this.form.value['public'],
					id: this.project ? this.project.id : undefined,
					organizationId: this.organization.id,
					name: this.form.value['name'],
					organizationContact: this.form.value['organizationContact']
						.organizationContactId,
					billing: this.form.value['billing'],
					currency:
						this.form.value['currency'] || this.defaultCurrency,
					startDate: this.form.value['startDate'],
					endDate: this.form.value['endDate'],
					owner: this.form.value['owner'],
					taskListType: this.form.value['taskViewMode'],
					members: (this.members || this.selectedEmployeeIds || [])
						.map((id) => this.employees.find((e) => e.id === id))
						.filter((e) => !!e)
				}
			});
			this.selectedEmployeeIds = [];
			this.members = [];
		}
	}

	selectedTagsEvent(ev) {
		this.tags = ev;
	}

	addNewOrganizationContact = (
		name: string
	): Promise<OrganizationContact> => {
		try {
			this.toastrService.primary(
				this.getTranslation(
					'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_CONTACTS.ADD_CONTACT',
					{
						name: name
					}
				),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
			return this.organizationContactService.create({
				name,
				organizationId: this.organizationId
			});
		} catch (error) {
			this.errorHandler.handleError(error);
		}
	};

	openTasksSettings(): void {
		this.router.navigate(['/pages/tasks/settings', this.project.id], {
			state: this.project
		});
	}
}
