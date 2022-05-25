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
	implements OnInit, OnDestroy, AfterViewInit
{
	@ViewChild('locationFormDirective')
	locationFormDirective: LocationFormComponent;

	@ViewChild('leafletTemplate')
	leafletTemplate: LeafletMapComponent;

	readonly locationForm: FormGroup = LocationFormComponent.buildForm(this.fb);

	locationFormBlank: boolean;
	hoverState: boolean;
	countries: ICountry[];
	defaultValueDateTypes: string[] = Object.values(DefaultValueDateTypeEnum);
	defaultBonusTypes: string[] = Object.values(BonusTypeEnum);
	listOfZones = timezone.tz.names().filter((zone) => zone.includes('/'));
	weekdays: string[] = Object.values(WeekDaysEnum);
	regionCodes = Object.keys(RegionsEnum);
	regionCode: string;
	numberFormats = ['USD', 'BGN', 'ILS'];
	listOfDateFormats = DEFAULT_DATE_FORMATS;
	orgMainForm: FormGroup;
	orgBonusForm: FormGroup;
	orgSettingsForm: FormGroup;
	tags: ITag[] = [];
	country: ICountry;
	user: IUser;
	retriveEmail: string;
	dummyImage = DUMMY_PROFILE_IMAGE;

	@Input('onboarding') onboarding?: boolean;

	@Output()
	createOrganization = new EventEmitter();

	@Output() closeForm = new EventEmitter();

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
				tap(() => this._initializedForm()),
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
				tap(() => this._initializedForm()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngAfterViewInit() {
		this.cdr.detectChanges();
	}

	private _initializedForm() {
		this.orgMainForm = this.fb.group({
			imageUrl: [],
			currency: [ENV.DEFAULT_CURRENCY || CurrenciesEnum.USD],
			name: [
				retrieveNameFromEmail(this.user?.email || this.retriveEmail),
				Validators.required
			],
			officialName: [],
			taxId: [],
			tags: []
		});
		this.orgBonusForm = this.fb.group({
			bonusType: [],
			bonusPercentage: [{ value: null, disabled: true }]
		});
		this.orgSettingsForm = this.fb.group({
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

		const bonusType = <FormControl>this.orgBonusForm.get('bonusType');
		const bonusPercentage = <FormControl>(
			this.orgBonusForm.get('bonusPercentage')
		);
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

		this.locationForm.valueChanges.subscribe((value) => {
			if (value.hasOwnProperty('loc')) {
				delete value['loc'];
			}
			const values = Object.values(value).filter((item) => item);
			this.locationFormBlank = values.length === 0 ? true : false;
		});
		this.cdr.detectChanges();
	}

	handleImageUploadError(error) {
		this.toastrService.danger(error);
	}

	loadDefaultBonusPercentage(bonusType: BonusTypeEnum) {
		const bonusPercentageControl = this.orgBonusForm.get(
			'bonusPercentage'
		) as FormControl;
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

	toggleExpiry(checked) {
		const inviteExpiryControl = this.orgSettingsForm.get(
			'inviteExpiryPeriod'
		) as FormControl;
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

		const consolidatedFormValues = {
			...this.orgMainForm.value,
			contact,
			...this.orgBonusForm.value,
			...this.orgSettingsForm.value
		};
		this.createOrganization.emit(consolidatedFormValues);
	}

	selectedTagsEvent(currentSelection: ITag[]) {
		this.orgMainForm.get('tags').setValue(currentSelection);
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
		const {
			loc: { coordinates }
		} = this.locationFormDirective.getValue();
		const [lat, lng] = coordinates;

		if (this.leafletTemplate) {
			this.leafletTemplate.addMarker(new LatLng(lat, lng));
		}
	}

	/*
	 * Leaflet Map Click Event Emitter
	 */
	onMapClicked(latlng: LatLng) {
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
	patchUsingLocationState(state: any) {
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
