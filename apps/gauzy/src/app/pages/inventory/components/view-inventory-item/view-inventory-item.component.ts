import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from 'apps/gauzy/src/app/@core/services/product.service';
import { Store } from 'apps/gauzy/src/app/@core/services/store.service';
import { GalleryComponent } from 'apps/gauzy/src/app/@shared/gallery/gallery.component';
import { GalleryService } from 'apps/gauzy/src/app/@shared/gallery/gallery.service';
import { TranslationBaseComponent } from 'apps/gauzy/src/app/@shared/language-base/translation-base.component';
import { LocalDataSource } from 'ng2-smart-table';
import { IImageAsset, IProductTranslated } from 'packages/contracts/dist';
import { combineLatest } from 'rxjs';
import { EnabledStatusComponent } from '../table-components/enabled-row.component';
import { ImageRowComponent } from '../table-components/image-row.component';

@UntilDestroy()
@Component({
	selector: 'ngx-view-inventory-item',
	templateUrl: './view-inventory-item.component.html',
	styleUrls: ['./view-inventory-item.component.scss']
})
export class InventoryItemViewComponent
	extends TranslationBaseComponent
	implements OnInit {
	inventoryItem: IProductTranslated;

	@ViewChild('variantTable') variantTable;

	settingsSmartTable: object;
	smartTableSource = new LocalDataSource();

	constructor(
		readonly translateService: TranslateService,
		private productService: ProductService,
		private route: ActivatedRoute,
		private readonly store: Store,
		private galleryService: GalleryService,
		private nbDialogService: NbDialogService
	) {
		super(translateService);
	}

	ngOnInit(): void {
		combineLatest([this.route.params, this.store.preferredLanguage$])
			.pipe(untilDestroyed(this))
			.subscribe(async ([params, languageCode]) => {
				this.inventoryItem = await this.productService.getOneTranslated(
					params.id,
					[
						'category',
						'type',
						'options',
						'variants',
						'tags',
						'gallery',
						'featuredImage'
					],
					languageCode
				);

				this.loadSmartTable();
				this.smartTableSource.load(this.inventoryItem.variants);
			});
	}

	onGalleryItemClick(galleryItem: IImageAsset) {
		const mappedImages = this.inventoryItem.gallery.map((image) => {
			return {
				thumbUrl: image.url,
				fullUrl: image.url
			};
		});

		this.galleryService.appendItems(mappedImages);

		this.nbDialogService.open(GalleryComponent, {
			context: {
				items: mappedImages,
				item: mappedImages.find(
					(image) => image.thumbUrl == galleryItem.url
				)
			},
			dialogClass: 'fullscreen'
		});
	}

	async loadSmartTable() {
		this.settingsSmartTable = {
			actions: false,
			columns: {
				image: {
					title: this.getTranslation('INVENTORY_PAGE.IMAGE'),
					type: 'custom',
					renderComponent: ImageRowComponent
				},
				options: {
					title: this.getTranslation('INVENTORY_PAGE.OPTIONS'),
					type: 'string',
					valuePrepareFunction: (_, variant) => {
						return variant.options && variant.options.length > 0
							? variant.options
									.map((option) => option.name)
									.join(', ')
							: this.getTranslation(
									'INVENTORY_PAGE.NO_OPTIONS_LABEL'
							  );
					}
				},
				internalReference: {
					title: this.getTranslation('INVENTORY_PAGE.CODE'),
					type: 'string'
				},
				quantity: {
					title: this.getTranslation('INVENTORY_PAGE.QUANTITY'),
					type: 'string'
				},
				enabled: {
					title: this.getTranslation('INVENTORY_PAGE.ENABLED'),
					type: 'custom',
					renderComponent: EnabledStatusComponent
				}
			}
		};
	}
}
