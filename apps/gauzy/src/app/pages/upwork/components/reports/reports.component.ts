import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { TranslationBaseComponent } from 'apps/gauzy/src/app/@shared/language-base/translation-base.component';
import { IncomeExpenseAmountComponent } from 'apps/gauzy/src/app/@shared/table-components/income-amount/income-amount.component';
import { DateViewComponent } from 'apps/gauzy/src/app/@shared/table-components/date-view/date-view.component';
import { UpworkStoreService } from '../../../../@core/services/upwork-store.service';

@Component({
	selector: 'ngx-reports',
	templateUrl: './reports.component.html',
	styleUrls: ['./reports.component.scss']
})
export class ReportsComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	private _ngDestroy$: Subject<void> = new Subject();
	reports$: Observable<any> = this._upworkStoreService.reports$;
	settingsSmartTable: object;

	constructor(
		public translateService: TranslateService,
		private readonly _upworkStoreService: UpworkStoreService
	) {
		super(translateService);
	}

	ngOnInit() {
		this._upworkStoreService.loadReports();
		this._loadSettingsSmartTable();
		this._applyTranslationOnSmartTable();
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}

	private _loadSettingsSmartTable() {
		this.settingsSmartTable = {
			actions: false,
			mode: 'external',
			noDataMessage: this.getTranslation('SM_TABLE.NO_DATA'),
			columns: {
				valueDate: {
					title: this.getTranslation('SM_TABLE.DATE'),
					type: 'custom',
					width: '20%',
					renderComponent: DateViewComponent,
					filter: false
				},
				clientName: {
					title: this.getTranslation('SM_TABLE.CLIENT_NAME'),
					type: 'string',
					valuePrepareFunction: (value, item) => {
						if (item.hasOwnProperty('vendor')) {
							return item.vendor ? item.vendor.name : null;
						}
						return value;
					}
				},
				amount: {
					title: this.getTranslation('SM_TABLE.AMOUNT'),
					type: 'custom',
					width: '15%',
					filter: false,
					renderComponent: IncomeExpenseAmountComponent
				},
				notes: {
					title: this.getTranslation('SM_TABLE.NOTES'),
					type: 'string'
				},
				employee: {
					title: this.getTranslation('SM_TABLE.EMPLOYEE'),
					type: 'string',
					valuePrepareFunction: (item) => {
						const user = item.user || null;
						if (user) {
							return `${user.firstName} ${user.lastName}`;
						}
					}
				}
			},
			pager: {
				display: true,
				perPage: 8
			}
		};
	}

	private _applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this._loadSettingsSmartTable();
			});
	}
}
