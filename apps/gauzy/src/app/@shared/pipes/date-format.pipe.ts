import { Pipe, PipeTransform } from '@angular/core';
import { IOrganization, RegionsEnum } from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import { distinctUntilChange, isEmpty } from '@gauzy/common-angular';
import { Store } from '../../@core/services';

@UntilDestroy({ checkProperties: true })
@Pipe({
	name: 'dateFormat',
	pure: false
})
export class DateFormatPipe implements PipeTransform {
	dateFormat: string = 'd MMMM, y';;
	regionCode: string = RegionsEnum.EN;

	constructor(private readonly store: Store) {
		this.store.selectedOrganization$
			.pipe(
				distinctUntilChange(),
				filter((organization: IOrganization) => !!organization),
				untilDestroyed(this)
			)
			.subscribe((organization: IOrganization) => {
				this.regionCode = organization.regionCode;
				this.dateFormat = organization.dateFormat;
			});
	}

	transform(
		value: Date | string | number | null | undefined,
		locale?: string,
		defaultFormat?: string
	) {
		if (!value) {
			return;
		}

		let date = moment(new Date(value));
		if (!date.isValid()) {
			date = moment.utc(value);
		}
		
		if (isEmpty(locale)) {
			locale = this.regionCode;
		}

		if (date && defaultFormat) {
			/**
			 * Override default format to organization date format as a priority format
			 */
			return date.locale(locale).format(defaultFormat);
		} else if (date && this.dateFormat) {
			return date.locale(locale).format(this.dateFormat);
		}
		return;
	}
}
