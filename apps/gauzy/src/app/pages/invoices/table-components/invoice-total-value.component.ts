import { Component, Input, OnInit } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { IOrganization } from '@gauzy/contracts';
import { Store } from '../../../@core/services';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-invoice-amount',
	template: `
		<span>
			{{ value | currency: rowData?.currency | position: organization?.currencyPosition }}
		</span>
	`
})
export class InvoiceEstimateTotalValueComponent implements OnInit {

	@Input() value: string;
	@Input() rowData: any;

	public organization: IOrganization;

	constructor(
		private readonly store: Store
	) { }

	ngOnInit(): void {
		this.store.selectedOrganization$
			.pipe(
				filter((organization: IOrganization) => !!organization),
				tap((organization: IOrganization) => {
					this.organization = organization;
				}),
				untilDestroyed(this)
			)
			.subscribe();
	}
}
