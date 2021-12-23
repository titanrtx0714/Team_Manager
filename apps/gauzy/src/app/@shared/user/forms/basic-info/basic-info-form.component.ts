import {
	Component,
	ViewChild,
	ElementRef,
	Input,
	OnInit,
	AfterViewInit
} from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { RolesEnum, ITag, ITenant, IUser } from '@gauzy/contracts';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '../../../language-base/translation-base.component';
import { AuthService, EmployeesService, RoleService, Store } from './../../../../@core/services';
import { CompareDateValidator } from './../../../../@core/validators';
import { FormHelpers } from '../../../forms/helpers';

@Component({
	selector: 'ga-user-basic-info-form',
	templateUrl: 'basic-info-form.component.html',
	styleUrls: ['basic-info-form.component.scss']
})
export class BasicInfoFormComponent
	extends TranslationBaseComponent
	implements OnInit, AfterViewInit {

	@ViewChild('imagePreview')
	imagePreviewElement: ElementRef;

	@Input() public isEmployee: boolean;
	@Input() public isCandidate: boolean;
	@Input() public isSuperAdmin: boolean;
	@Input() public createdById: string;
	@Input() public selectedTags: ITag[];

	//Fields for the form
	form: any;
	imageUrl: any;
	username: any;
	firstName: any;
	lastName: any;
	email: any;
	password: any;
	off: any;
	role: any;
	tenant: ITenant;
	offerDate: any;
	acceptDate: any;
	appliedDate: any;
	hiredDate: any;
	rejectDate: any;
	source: any;
	tags: ITag[] = [];
	items: any;
	createEmployee: any;

	FormHelpers: typeof FormHelpers = FormHelpers;
	excludes: RolesEnum[] = [];

	constructor(
		private readonly fb: FormBuilder,
		private readonly authService: AuthService,
		private readonly roleService: RoleService,
		private readonly employeesService: EmployeesService,
		public readonly translateService: TranslateService,
		private readonly store: Store
	) {
		super(translateService);
	}

	ngOnInit(): void {
		this.excludes = [
			RolesEnum.EMPLOYEE
		];
		if (!this.isSuperAdmin) {
			this.excludes.push(RolesEnum.SUPER_ADMIN);
		}
		this.loadFormData();
	}

	public enableEmployee() {
		return (
			(this.form.get('role').value).name === RolesEnum.SUPER_ADMIN ||
			(this.form.get('role').value).name === RolesEnum.ADMIN
		);
	}

	loadFormData = () => {
		this.form = this.fb.group(
			{
				username: [''],
				firstName: [''],
				lastName: [''],
				email: [
					'',
					Validators.compose([Validators.required, Validators.email])
				],
				imageUrl: [
					'',
					Validators.compose([
						Validators.pattern(
							new RegExp(
								`(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`,
								'g'
							)
						)
					])
				],
				password: [
					'',
					Validators.compose([
						Validators.required,
						Validators.minLength(4)
					])
				],
				startedWorkOn: [''],
				role: [
					'',
					this.isCandidate || this.isEmployee
						? null
						: Validators.required
				],
				offerDate: [],
				acceptDate: [],
				appliedDate: [],
				hiredDate: [],
				rejectDate: [],
				source: [''],
				tags: [this.selectedTags],
				createEmployee: [false]
			},
			{ 
				validators: [
					CompareDateValidator.validateDate('offerDate', 'acceptDate'),
					CompareDateValidator.validateDate('offerDate', 'rejectDate')
				] 
			}
		);

		this.imageUrl = this.form.get('imageUrl');
		this.username = this.form.get('username');
		this.firstName = this.form.get('firstName');
		this.lastName = this.form.get('lastName');
		this.email = this.form.get('email');
		this.password = this.form.get('password');
		this.role = this.form.get('role');
		this.offerDate = this.form.get('offerDate');
		this.acceptDate = this.form.get('acceptDate');
		this.appliedDate = this.form.get('appliedDate');
		this.hiredDate = this.form.get('hiredDate');
		this.source = this.form.get('source');
		this.rejectDate = this.form.get('rejectDate');
		this.tags = this.form.get('tags').value || [];
		this.createEmployee = this.form.get('createEmployee');
	};

	get showImageMeta() {
		return this.imageUrl && this.imageUrl.value !== '';
	}

	async registerUser(
		defaultRoleName: RolesEnum,
		organizationId?: string,
		createdById?: string
	) {
		if (this.form.valid) {
			const { tenant } = this.store.user;
			const role = await firstValueFrom(
				this.roleService.getRoleByName({
					name: (this.role.value).name || defaultRoleName,
					tenantId: tenant.id
				})
			);

			const user: IUser = {
				firstName: this.firstName.value,
				lastName: this.lastName.value,
				email: this.email.value,
				username: this.username.value || null,
				imageUrl: this.imageUrl.value,
				role,
				tenant,
				tags: this.form.get('tags').value
			};

			if (this.createEmployee.value) {
				return await firstValueFrom(
					this.employeesService.create({
						user,
						organization: this.store.selectedOrganization,
						password: this.password.value
					})
				);
			} else {
				return await firstValueFrom(
					this.authService.register({
						user,
						password: this.password.value,
						confirmPassword: this.password.value,
						organizationId,
						createdById
					})
				);
			}
		}

		return;
	}

	deleteImg() {
		this.imageUrl.setValue('');
	}

	selectedTagsHandler(currentSelection: ITag[]) {
		this.form.get('tags').setValue(currentSelection);
		this.form.get('tags').updateValueAndValidity();
	}

	ngAfterViewInit() {
		this._setupLogoUrlValidation();
	}

	private _setupLogoUrlValidation() {
		this.imagePreviewElement.nativeElement.onload = () => {
			this.imageUrl.setErrors(null);
		};

		this.imagePreviewElement.nativeElement.onerror = () => {
			if (this.showImageMeta) {
				this.imageUrl.setErrors({ invalidUrl: true });
			}
		};
	}
}
