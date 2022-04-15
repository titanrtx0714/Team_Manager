import { Component, OnInit, OnDestroy, AfterViewInit, Input, ViewChild } from '@angular/core';
import { combineLatest, of as observableOf, Subject, switchMap } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { DaterangepickerDirective as DateRangePickerDirective, LocaleConfig } from 'ngx-daterangepicker-material';
import * as moment from 'moment';
import { IDateRangePicker } from '@gauzy/contracts';
import { distinctUntilChange, isNotEmpty } from '@gauzy/common-angular';
import { TranslateService } from '@ngx-translate/core';
import { DateRangePickerBuilderService, OrganizationsService, Store } from './../../../../../@core/services';
import { Arrow } from './arrow/context/arrow.class';
import { Next, Previous } from './arrow/strategies';
import { TranslationBaseComponent } from './../../../../../@shared/language-base';
import { DateRangeKeyEnum } from './date-range-picker.setting';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-date-range-picker',
	templateUrl: './date-range-picker.component.html',
	styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent extends TranslationBaseComponent 
	implements AfterViewInit, OnInit, OnDestroy {

	public maxDate: moment.Moment;
	public futureDateAllowed: boolean;

	/**
	 * Local store date range 
	 */
	private range$: Subject<IDateRangePicker> = new Subject();

	/**
	 * declaration of arrow variables
	 */
	private arrow: Arrow = new Arrow();
	private next: Next = new Next();
	private previous: Previous = new Previous();

	/**
	 * ngx-daterangepicker-material local configuration
	 */
	_locale: LocaleConfig = {
		displayFormat: 'DD.MM.YYYY', // could be 'YYYY-MM-DDTHH:mm:ss.SSSSZ'
		format: 'DD.MM.YYYY', // default is format value
		direction: 'ltr'
	};
	get locale(): LocaleConfig {
		return this._locale;
	}
	set locale(locale: LocaleConfig) {
		this._locale = locale;
	}

	/**
	 * Define ngx-daterangepicker-material range configuration
	 */
	public ranges: any;

	/**
	 * show or hide arrows button, show by default
	 */
	@Input()
	arrows: boolean = true;

	/*
	* Getter & Setter for dynamic unitOfTime
	*/
	_unitOfTime: moment.unitOfTime.Base = 'month';
	get unitOfTime(): moment.unitOfTime.Base {
		return this._unitOfTime;
	}
	@Input() set unitOfTime(value: moment.unitOfTime.Base) {
		if (value) {
			this._unitOfTime = value;
		}
		const defaultSelectedDateRange = {
			startDate: moment().startOf(this.unitOfTime).toDate(),
			endDate: moment().endOf(this.unitOfTime).toDate(),
			isCustomDate: false
		}
		this.selectedDateRange = this.rangePicker = defaultSelectedDateRange;
	}

	/*
	* Getter & Setter for dynamic selected date range
	*/
	_selectedDateRange: IDateRangePicker;
	get selectedDateRange(): IDateRangePicker {
		return this._selectedDateRange;
	}
	@Input() set selectedDateRange(range: IDateRangePicker) {
		if (isNotEmpty(range)) {
			this._selectedDateRange = range;
			this.range$.next(range);
		}		
	}

	/*
	* Getter & Setter for dynamic selected internal date range
	*/
	private _rangePicker: IDateRangePicker;
	public get rangePicker(): IDateRangePicker {
		return this._rangePicker;
	}
	public set rangePicker(range: IDateRangePicker) {
		if (isNotEmpty(range)) {
			this._rangePicker = range;
		}		
	}

	/*
	* Getter & Setter for lock date picker
	*/
	_isLockDatePicker: boolean = false;
	get isLockDatePicker(): boolean {
		return this._isLockDatePicker;
	}
	@Input() set isLockDatePicker(isLock: boolean) {
		this._isLockDatePicker = isLock;
	}

	@ViewChild(DateRangePickerDirective, { static: false }) dateRangePickerDirective: DateRangePickerDirective;

	constructor(
		private readonly store: Store,
		public readonly translateService: TranslateService,
		private readonly organizationService: OrganizationsService,
		private readonly dateRangePickerBuilderService: DateRangePickerBuilderService
	) {
		super(translateService);
	}

	ngOnInit() {
		const storeOrganization$ = this.store.selectedOrganization$;
		const storeUnitOfTime$ = this.dateRangePickerBuilderService.pickerRangeUnitOfTime$;
		const storeLockingUnit$ = this.dateRangePickerBuilderService.isLockDatePickerUnit$;

		combineLatest([storeOrganization$, storeUnitOfTime$, storeLockingUnit$])
			.pipe(
				filter(([organization]) => !!organization),
				switchMap(([organization, unitOfTime, isLockDatePicker]) => combineLatest([
					this.organizationService.getById(organization.id),
					observableOf(unitOfTime),
					observableOf(isLockDatePicker),
				])),
				tap(([organization, unitOfTime, isLockDatePicker]) => {
					this.futureDateAllowed = organization.futureDateAllowed;
					this.unitOfTime = (unitOfTime || 'month') as moment.unitOfTime.Base;
					this.isLockDatePicker = isLockDatePicker;
				}),
				tap(() => {
					this.createDateRangeMenus();
					this.setFutureStrategy();
				}),
				tap(([organization]) => {
					if (organization.timeZone) {
						let format: string; 
						if (moment.tz.zonesForCountry('US').includes(organization.timeZone)) {
							format = 'MM.DD.YYYY';
						} else {
							format = 'DD.MM.YYYY';
						}
						this.locale = {
							...this.locale,
							displayFormat: format,
							format: format
						}
					}
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngAfterViewInit() {
		this.range$
			.pipe(
				distinctUntilChange(),
				tap((range: IDateRangePicker) => {
					this.store.selectedDateRange = range;
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/**
	 * Create Date Range Translated Menus 
	 */
	createDateRangeMenus() {
		this.ranges = new Object();
		this.ranges[DateRangeKeyEnum.TODAY] = [moment(), moment()];
		this.ranges[DateRangeKeyEnum.YESTERDAY] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
		this.ranges[DateRangeKeyEnum.CURRENT_WEEK] = [moment().startOf('week'), moment().endOf('week')];
		this.ranges[DateRangeKeyEnum.LAST_WEEK] = [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')];
		this.ranges[DateRangeKeyEnum.CURRENT_MONTH] = [moment().startOf('month'), moment().endOf('month')];
		this.ranges[DateRangeKeyEnum.LAST_MONTH] = [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')];
	}

	/**
	 * Allowed/Disallowed future max date strategy.
	 */
	setFutureStrategy() {
		const isSameOrAfter = moment(this.selectedDateRange.endDate).isSameOrAfter(moment());
		if (this.futureDateAllowed) {
			this.maxDate = null;
		} else if (!this.futureDateAllowed && isSameOrAfter) {
			this.maxDate = moment();
			this.selectedDateRange = {
				...this.selectedDateRange,
				endDate: moment().toDate()
			}
		}
	}

	/**
	 * get next selected range
	 */
	nextRange() {
		if (this.isNextDisabled()) {
			return;
		}
		this.arrow.setStrategy = this.next;
		const nextRange = this.arrow.execute(this.rangePicker, this.unitOfTime);
		this.selectedDateRange = this.rangePicker = {
			...this.selectedDateRange,
			...nextRange
		};
		this.setFutureStrategy();
	}

   /**
   * get previous selected range
   */
	previousRange() {
		this.arrow.setStrategy = this.previous;
		const previousRange = this.arrow.execute(this.rangePicker, this.unitOfTime);
		this.selectedDateRange = this.rangePicker = {
			...this.selectedDateRange,
			...previousRange
		};
	}

	/**
	 * Is check to disabled Next Button or Not
	 * 
	 * @returns 
	 */
	isNextDisabled() {
		if (!this.selectedDateRange) {
			return true;
		}
		const { startDate, endDate } = this.selectedDateRange;
		if (startDate && endDate) {
			return this.futureDateAllowed
				? false
				: moment(this.selectedDateRange.endDate).isSameOrAfter(moment(), 'day');
		} else {
			return true;
		}
	}

	/**
	 * listen event on ngx-daterangepicker-material
	 * @param event
	 */
	onDatesUpdated(event: any) {
		if (this.dateRangePickerDirective) {
			const { startDate, endDate } = event;
			if (startDate && endDate) {
				const range = {} as IDateRangePicker;
				if (!this.isLockDatePicker) {
					range['startDate'] = startDate.toDate();
					range['endDate'] = endDate.toDate();
					range['isCustomDate'] = this.isCustomDate(event);
				} else {

				}
				this.selectedDateRange = this.rangePicker = range;
			}
		}
	}

	/**
	 * listen range click event on ngx-daterangepicker-material
	 * @param event
	 */
	rangeClicked(range: any) {
		const { label } = range 
		switch (label) {
			case DateRangeKeyEnum.TODAY:
			case DateRangeKeyEnum.YESTERDAY:
				this.unitOfTime = 'day';
				break;
			case DateRangeKeyEnum.CURRENT_WEEK:
			case DateRangeKeyEnum.LAST_WEEK:
				this.unitOfTime = 'week';
				break;
			case DateRangeKeyEnum.CURRENT_MONTH:
			case DateRangeKeyEnum.LAST_MONTH:
				this.unitOfTime = 'month';
				break;
			default:
				break;
		}
	}

	/**
	 * Check is custom date
	 * 
	 * @param dateRange 
	 * @returns 
	 */
	isCustomDate(dateRange: any): boolean {
		let isCustomRange = true;

		const ranges = this.dateRangePickerDirective.ranges;
		for (const range in ranges) {
			if (this.ranges[range]) {
				const [startDate, endDate] = this.ranges[range];
				// ignore times when comparing dates if time picker is not enabled
				if (
					dateRange.startDate.format('YYYY-MM-DD') === startDate.format('YYYY-MM-DD') &&
					dateRange.endDate.format('YYYY-MM-DD') === endDate.format('YYYY-MM-DD')
				) {
					isCustomRange = false;
					break;
				}
			}
		}
		return isCustomRange;
	}

	/**
	 * Open Date Picker On Calender Click
	 */
	openDatepicker() {
		this.dateRangePickerDirective.toggle();
	}
	
	ngOnDestroy() {}
}