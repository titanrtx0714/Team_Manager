import { AfterViewInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { combineLatest } from 'rxjs';
import { debounceTime, filter, tap } from 'rxjs/operators';
import { Subject, firstValueFrom } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentLayoutStyleEnum, IOrganization, IWarehouse } from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/common-angular';
import { DeleteConfirmationComponent } from './../../../../../@shared/user/forms';
import { API_PREFIX, ComponentEnum } from './../../../../../@core/constants';
import { Store, ToastrService, WarehouseService } from './../../../../../@core/services';
import { ContactRowComponent, EnabledStatusComponent, ItemImgTagsComponent } from '../../table-components';
import { IPaginationBase, PaginationFilterBaseComponent } from './../../../../../@shared/pagination/pagination-filter-base.component';
import { ServerDataSource } from './../../../../../@core/utils/smart-table/server.data-source';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-warehouses',
	templateUrl: './warehouses-table.component.html',
	styleUrls: ['./warehouses-table.component.scss']
})
export class WarehousesTableComponent
	extends PaginationFilterBaseComponent
	implements AfterViewInit, OnInit, OnDestroy {

	settingsSmartTable: object;
	loading: boolean;
	selectedWarehouse: IWarehouse;
	smartTableSource: ServerDataSource;
	warehouses: IWarehouse[] = [];
	disableButton: boolean = true;
	viewComponentName: ComponentEnum;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	componentLayoutStyleEnum = ComponentLayoutStyleEnum;

	public organization: IOrganization;
	warehouses$: Subject<any> = this.subject$;

	warehousesTable: Ng2SmartTableComponent;
	@ViewChild('warehousesTable') set content(content: Ng2SmartTableComponent) {
		if (content) {
			this.warehousesTable = content;
			this.onChangedSource();
		}
	}

	/*
	* Actions Buttons directive 
	*/
	@ViewChild('actionButtons', { static: true }) actionButtons: TemplateRef<any>;

	constructor(
		public readonly translateService: TranslateService,
		private readonly dialogService: NbDialogService,
		private readonly warehouseService: WarehouseService,
		private readonly toastrService: ToastrService,
		private readonly router: Router,
		private readonly store: Store,
		private readonly http: HttpClient
	) {
		super(translateService);
		this.setView();
	}

	ngOnInit(): void {
		this._applyTranslationOnSmartTable();
		this._loadSmartTableSettings();
	}

	ngAfterViewInit(): void {
		this.pagination$
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				tap(() => this.warehouses$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();

		this.warehouses$
			.pipe(
				debounceTime(300),
				tap(() => this.loading = true),
				tap(() => this.getWarehouses()),
				tap(() => this.clearItem()),
				untilDestroyed(this)
			)
			.subscribe();

		const storeOrganization$ = this.store.selectedOrganization$;
		combineLatest([storeOrganization$])
			.pipe(
				debounceTime(300),
				filter(([organization]) => !!organization),
				tap(([organization]) => (this.organization = organization)),
				distinctUntilChange(),
				tap(() => this.warehouses$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	setView() {
		this.viewComponentName = ComponentEnum.WAREHOUSE;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(
				distinctUntilChange(),
				tap((componentLayout) => this.dataLayoutStyle = componentLayout),
				filter((componentLayout) => componentLayout === ComponentLayoutStyleEnum.CARDS_GRID),
				tap(() => this.refreshPagination()),
				tap(() => this.warehouses$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/*
	 * Table on changed source event
	 */
	onChangedSource() {
		this.warehousesTable.source.onChangedSource
			.pipe(
				untilDestroyed(this),
				tap(() => this.clearItem())
			)
			.subscribe();
	}

	async _loadSmartTableSettings() {
		const pagination: IPaginationBase = this.getPagination();
		this.settingsSmartTable = {
			actions: false,
			editable: true,
			pager: {
				display: false,
				perPage: pagination ? pagination.itemsPerPage : 10
			},
			columns: {
				name: {
					title: this.getTranslation('INVENTORY_PAGE.LOGO'),
					type: 'custom',
					renderComponent: ItemImgTagsComponent
				},
				email: {
					title: this.getTranslation('INVENTORY_PAGE.EMAIL'),
					type: 'string'
				},
				contact: {
					title: this.getTranslation('INVENTORY_PAGE.CONTACT'),
					type: 'custom',
					renderComponent: ContactRowComponent
				},
				description: {
					title: this.getTranslation('INVENTORY_PAGE.DESCRIPTION'),
					type: 'string'
				},
				active: {
					title: this.getTranslation('INVENTORY_PAGE.ACTIVE'),
					type: 'custom',
					renderComponent: EnabledStatusComponent
				}
			}
		};
	}

	private _applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(
				tap(() => this._loadSmartTableSettings()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	onCreateWarehouse() {
		this.router.navigate([
			'/pages/organization/inventory/warehouses/create'
		]);
	}

	onUpdateWarehouse(selectedItem?: IWarehouse) {
		if (selectedItem) {
			this.selectWarehouse({
				isSelected: true,
				data: selectedItem
			});
		}
		this.router.navigate([
			'/pages/organization/inventory/warehouses/edit', this.selectedWarehouse.id
		]);
	}

	async onDelete(selectedItem?: IWarehouse) {
		if (selectedItem) {
			this.selectWarehouse({
				isSelected: true,
				data: selectedItem
			});
		}
		if (!this.selectedWarehouse) {
			return;
		}

		const result = await firstValueFrom(
			this.dialogService
				.open(DeleteConfirmationComponent)
				.onClose);

		if (result) {
			await this.warehouseService
				.deleteFeaturedImage(this.selectedWarehouse.id)
				.then((res) => {
					if (res && res.affected == 1) {
						const { name } = this.selectedWarehouse;
						this.toastrService.success('INVENTORY_PAGE.WAREHOUSE_WAS_DELETED', {
							name
						});
					}
				})
				.finally(() => {
					this.warehouses$.next(true);
				});
		}
	}

	/*
	* Register Smart Table Source Config 
	*/
	setSmartTableSource() {
		const { tenantId } = this.store.user;
		const { id: organizationId } = this.organization;

		this.smartTableSource = new ServerDataSource(this.http, {
			endPoint: `${API_PREFIX}/warehouses/pagination`,
			relations: ['logo', 'contact'],
			where: {
				...{ organizationId, tenantId },
				...this.filters.where
			},
			resultMap: (warehouse: IWarehouse) => {
				return Object.assign({}, warehouse);
			},
			finalize: () => {
				this.setPagination({
					...this.getPagination(),
					totalItems: this.smartTableSource.count()
				});
				this.loading = false;
			}
		});
	}

	/**
	 * GET warehouse smart table source
	 */
	private async getWarehouses() {
		try {
			this.setSmartTableSource();
			const { activePage, itemsPerPage } = this.getPagination();

			this.smartTableSource.setPaging(
				activePage,
				itemsPerPage,
				false
			);
			
			if (this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID) {
				await this.smartTableSource.getElements();
				this.warehouses = this.smartTableSource.getData();

				this.setPagination({
					...this.getPagination(),
					totalItems: this.smartTableSource.count()
				});
			}
		} catch (error) {
			this.toastrService.danger(error);
		}
	}

	selectWarehouse({ isSelected, data }) {
		this.disableButton = !isSelected;
		this.selectedWarehouse = isSelected ? data : null;
	}

	/*
	 * Clear selected item
	 */
	clearItem() {
		this.selectWarehouse({
			isSelected: false,
			data: null
		});
		this.deselectAll();
	}

	/*
	 * Deselect all table rows
	 */
	deselectAll() {
		if (this.warehousesTable && this.warehousesTable.grid) {
			this.warehousesTable.grid.dataSet['willSelect'] = 'false';
			this.warehousesTable.grid.dataSet.deselectAll();
		}
	}

	ngOnDestroy() { }
}
