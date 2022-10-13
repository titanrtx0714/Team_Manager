import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { formatDate, Location } from '@angular/common';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';
import {
	BonusTypeEnum,
	ICountry,
	DefaultValueDateTypeEnum,
	RegionsEnum,
	WeekDaysEnum,
	ITag,
	ICurrency,
	IUser,
	CurrenciesEnum,
	DEFAULT_DATE_FORMATS
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LatLng } from 'leaflet';
import { filter, tap } from 'rxjs/operators';
import { retrieveNameFromEmail } from '@gauzy/common-angular';
import * as moment from 'moment';
import * as timezone from 'moment-timezone';
import { LocationFormComponent } from '../../forms/location';
import { LeafletMapComponent } from '../../forms/maps';
import { environment as ENV } from './../../../../environments/environment';
import { Store, ToastrService } from '../../../@core/services';
import { DUMMY_PROFILE_IMAGE } from '../../../@core/constants';
import { FormHelpers } from '../../forms';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-organizations-step-form',
	templateUrl: './organizations-step-form.component.html',
	styleUrls: [
		'./organizations-step-form.component.scss',
		'../../../@shared/user/edit-profile-form/edit-profile-form.component.scss'
	]
})
export class OrganizationsStepFormComponent
	implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('locationFormDirective')
	locationFormDirective: LocationFormComponent;

	@ViewChild('leafletTemplate')
	leafletTemplate: LeafletMapComponent;

	FormHelpers: typeof FormHelpers = FormHelpers;

	locationFormBlank: boolean = true;
	hoverState: boolean;
	countries: ICountry[] = [];
	defaultValueDateTypes: string[] = Object.values(DefaultValueDateTypeEnum);
	defaultBonusTypes: string[] = Object.values(BonusTypeEnum);
	listOfZones = timezone.tz.names().filter((zone) => zone.includes('/'));
	weekdays: string[] = Object.values(WeekDaysEnum);
	regionCodes = Object.keys(RegionsEnum);
	regionCode: string;
	numberFormats = ['USD', 'BGN', 'ILS'];
	listOfDateFormats = DEFAULT_DATE_FORMATS;

	user: IUser;
	retriveEmail: string;
	dummyImage = DUMMY_PROFILE_IMAGE;

	@Output() createOrganization = new EventEmitter();
	@Output() closeForm = new EventEmitter();

	/*
	* Getter & Setter for onboarding
	*/
	_isOnboarding: boolean = false;
	get isOnboarding(): boolean {
		return this._isOnboarding;
	}
	@Input() set isOnboarding(value: boolean) {
		this._isOnboarding = value;
	}

	/*
	* Getter & Setter for onboarding
	*/
	_closable: boolean = false;
	get closable(): boolean {
		return this._closable;
	}
	@Input() set closable(value: boolean) {
		this._closable = value;
	}

	/*
	* Organization Main Mutation Form
	*/
	public readonly orgMainForm: FormGroup = OrganizationsStepFormComponent.buildOrgMainForm(this.fb);
	static buildOrgMainForm(fb: FormBuilder): FormGroup {
		return fb.group({
			imageUrl: [],
			currency: [ENV.DEFAULT_CURRENCY || CurrenciesEnum.USD],
			name: [null, Validators.required],
			officialName: [],
			taxId: [],
			tags: []
		});
	}

	/**
	* Location Mutation Form
	*/
	readonly locationForm: FormGroup = LocationFormComponent.buildForm(this.fb);

	/*
	* Organization Bonus Form
	*/
	public readonly orgBonusForm: FormGroup = OrganizationsStepFormComponent.buildOrgBonusForm(this.fb);
	static buildOrgBonusForm(fb: FormBuilder): FormGroup {
		return fb.group({
			bonusType: [],
			bonusPercentage: [
				{ value: null, disabled: true }
			]
		});
	}

	/*
	* Organization Settings Form
	*/
	public readonly orgSettingsForm: FormGroup = OrganizationsStepFormComponent.buildOrgSettingsForm(this.fb);
	static buildOrgSettingsForm(fb: FormBuilder): FormGroup {
		return fb.group({
			timeZone: [],
			startWeekOn: [],
			defaultValueDateType: [
				DefaultValueDateTypeEnum.TODAY,
				Validators.required
			],
			regionCode: [],
			numberFormat: [],
			dateFormat: [],
			fiscalStartDate: [
				formatDate(
					new Date(`01/01/${new Date().getFullYear()}`),
					'yyyy-MM-dd',
					'en'
				)
			],
			fiscalEndDate: [
				formatDate(
					new Date(`12/31/${new Date().getFullYear()}`),
					'yyyy-MM-dd',
					'en'
				)
			],
			invitesAllowed: [true],
			inviteExpiryPeriod: [7, [Validators.min(1)]]
		});
	}

	/*
	* Employee Feature Form
	*/
	readonly employeeFeatureForm: FormGroup = OrganizationsStepFormComponent.buildEmployeeFeatureForm(this.fb);
	static buildEmployeeFeatureForm(fb: FormBuilder): FormGroup {
		return fb.group({
			registerAsEmployee: [true],
			startedWorkOn: [new Date(), Validators.required]
		});
	}

	constructor(
		private readonly fb: FormBuilder,
		private readonly toastrService: ToastrService,
		private readonly cdr: ChangeDetectorRef,
		private readonly store: Store,
		private readonly _activatedRoute: ActivatedRoute,
		private readonly location: Location
	) {}

	ngOnInit() {
		this.store.user$
			.pipe(
				filter((user) => !!user),
				tap((user: IUser) => (this.user = user)),
				tap(({ email }) => (this.retriveEmail = email)),
				tap(() => this._setFormValues()),
				filter(() => !!this.location.getState()),
				tap(() =>
					this.patchUsingLocationState(this.location.getState())
				)
			)
			.subscribe();
		this._activatedRoute.queryParams
			.pipe(
				filter(({ email }) => !!email),
				tap(({ email }) => (this.retriveEmail = email)),
				tap(() => this._setFormValues()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngAfterViewInit() {
		/**
		 * organization bonus controls value changes
		 */
		const bonusType = <FormControl>this.orgBonusForm.get('bonusType');
		const bonusPercentage = <FormControl>this.orgBonusForm.get('bonusPercentage');
		bonusType.valueChanges.subscribe((value) => {
			if (value) {
				bonusPercentage.setValidators([
					Validators.required,
					Validators.min(0),
					Validators.max(100)
				]);
			} else {
				bonusPercentage.setValidators(null);
			}
			bonusPercentage.updateValueAndValidity();
		});

		/**
		 * location controls value changes
		 */
		const locationForm = <FormGroup>this.locationForm;
		locationForm.valueChanges.subscribe((value) => {
			if (value.hasOwnProperty('loc')) {
				delete value['loc'];
			}
			const values = Object.values(value).filter((item) => item);
			this.locationFormBlank = values.length === 0 ? true : false;
		});

		if (!this.isOnboarding) {
			/**
			 * Employee feature controls value changes
			 */
			const registerAsEmployee = <FormControl>this.employeeFeatureForm.get('registerAsEmployee');
			const startedWorkOn = <FormControl>this.employeeFeatureForm.get('startedWorkOn');

			registerAsEmployee.disable();
			startedWorkOn.disable();

			registerAsEmployee.valueChanges.subscribe((value: boolean) => {
				console.log(value, startedWorkOn);
				if (value) {
					startedWorkOn.setValidators([Validators.required]);
				} else {
					startedWorkOn.setValidators(null);
				}
				startedWorkOn.updateValueAndValidity();
			});
		}
		this.cdr.detectChanges();
	}

	private _setFormValues() {
		this.orgMainForm.patchValue({
			name: retrieveNameFromEmail(this.user?.email || this.retriveEmail)
		});
		this.orgMainForm.updateValueAndValidity();
	}

	handleImageUploadError(error) {
		this.toastrService.danger(error);
	}

	loadDefaultBonusPercentage(bonusType: BonusTypeEnum) {
		const bonusPercentageControl = <FormControl>this.orgBonusForm.get('bonusPercentage');
		switch (bonusType) {
			case BonusTypeEnum.PROFIT_BASED_BONUS:
				bonusPercentageControl.setValue(75);
				bonusPercentageControl.enable();
				break;
			case BonusTypeEnum.REVENUE_BASED_BONUS:
				bonusPercentageControl.setValue(10);
				bonusPercentageControl.enable();
				break;
			default:
				bonusPercentageControl.setValue(null);
				bonusPercentageControl.disable();
				break;
		}
		bonusPercentageControl.updateValueAndValidity();
	}

	toggleExpiry(checked: boolean) {
		const inviteExpiryControl = <FormControl>this.orgSettingsForm.get('inviteExpiryPeriod');
		checked ? inviteExpiryControl.enable() : inviteExpiryControl.disable();
	}

	numberFormatPreview(format: string) {
		const number = 12345.67;
		let code: string;
		switch (format) {
			case CurrenciesEnum.BGN:
				code = 'bg';
				break;
			case CurrenciesEnum.USD:
				code = 'en';
				break;
			case CurrenciesEnum.ILS:
				code = 'he';
				break;
		}
		return number.toLocaleString(`${code}`, {
			style: 'currency',
			currency: `${format}`,
			currencyDisplay: 'symbol'
		});
	}

	dateFormatPreview(format: string) {
		this.orgSettingsForm.valueChanges
			.pipe(untilDestroyed(this))
			.subscribe((val) => {
				this.regionCode = val.regionCode;
			});

		moment.locale(this.regionCode);
		return moment().format(format);
	}

	getTimeWithOffset(zone: string) {
		let cutZone = zone;
		if (zone.includes('/')) {
			cutZone = zone.split('/')[1];
		}

		const offset = timezone.tz(zone).format('zZ');

		return '(' + offset + ') ' + cutZone;
	}

	addOrganization() {
		const location = this.locationFormDirective.getValue();
		const { coordinates } = location['loc'];
		delete location['loc'];

		const [latitude, longitude] = coordinates;
		const contact = {
			...location,
			...{ latitude, longitude }
		};

		let consolidatedFormValues = {
			...this.orgMainForm.value,
			...this.orgBonusForm.value,
			...this.orgSettingsForm.value,
			contact,
		};
		if (this.isOnboarding) {
			consolidatedFormValues = {
				...consolidatedFormValues,
				...this.employeeFeatureForm.value
			}
		}
		this.createOrganization.emit(consolidatedFormValues);
	}

	submitEmployeeFeature() {
		if (this.employeeFeatureForm.invalid) {
			return;
		}
		this.addOrganization();
	}

	selectedTagsEvent(tags: ITag[]) {
		this.orgMainForm.get('tags').setValue(tags);
		this.orgMainForm.get('tags').updateValueAndValidity();
	}

	/*
	 * On Changed Currency Event Emitter
	 */
	currencyChanged($event: ICurrency) {}

	/*
	 * Google Place and Leaflet Map Coordinates Changed Event Emitter
	 */
	onCoordinatesChanges(
		$event: google.maps.LatLng | google.maps.LatLngLiteral
	) {
		if (!this.locationFormDirective) {
			return;
		}
		const { loc: { coordinates } } = this.locationFormDirective.getValue();
		const [lat, lng] = coordinates;

		if (this.leafletTemplate) {
			this.leafletTemplate.addMarker(new LatLng(lat, lng));
		}
	}

	/*
	 * Leaflet Map Click Event Emitter
	 */
	onMapClicked(latlng: LatLng) {
		if (!this.locationFormDirective) {
			return;
		}
		const { lat, lng }: LatLng = latlng;
		const location = this.locationFormDirective.getValue();
		this.locationFormDirective.setValue({
			...location,
			country: '',
			loc: {
				type: 'Point',
				coordinates: [lat, lng]
			}
		});
		this.locationFormDirective.onCoordinatesChanged();
	}

	/**
	 * GET location old state & patch form value
	 * We are using such functionality for create new organization from header selector
	 *
	 * @param state
	 */
	patchUsingLocationState(state: {
        [key: string]: any;
    }) {
		if (!this.orgMainForm) {
			return;
		}
		this.orgMainForm.patchValue({ ...state });
		this.orgMainForm.updateValueAndValidity();
	}

	/*
	 * Google Place Geometry Changed Event Emitter
	 */
	onGeometrySend(geometry: any) {}

	close() {
		this.closeForm.emit();
	}

	ngOnDestroy() {}
}
