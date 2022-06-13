import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { saveAs } from 'file-saver';
import { NbToastrService, NbGlobalPhysicalPosition } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import {
	IImportHistory,
	ImportTypeEnum,
	ImportHistoryStatusEnum
} from '@gauzy/contracts';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TranslationBaseComponent } from '../../../@shared/language-base/translation-base.component';
import { API_PREFIX } from '../../../@core/constants';
import { ImportService, Store } from '../../../@core/services';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-import',
	templateUrl: './import.component.html',
	styleUrls: ['./import.component.scss']
})
export class ImportComponent
	extends TranslationBaseComponent
	implements AfterViewInit, OnInit
{
	history$: Observable<IImportHistory[]> = this.importService.history$;

	uploader: FileUploader;
	hasBaseDropZoneOver: boolean;
	hasAnotherDropZoneOver: boolean;
	importDT: Date = new Date();
	importTypeEnum = ImportTypeEnum;
	importType = ImportTypeEnum.MERGE;
	importStatus = ImportHistoryStatusEnum;
	subject$: Subject<any> = new Subject();
	loading: boolean;
	selectedItem = {
		isSelected: false,
		data: null
	};

	constructor(
		private readonly route: ActivatedRoute,
		private readonly toastrService: NbToastrService,
		private readonly store: Store,
		readonly translateService: TranslateService,
		private readonly importService: ImportService
	) {
		super(translateService);
	}

	ngOnInit() {
		this.store.user$
			.pipe(
				filter((user) => !!user),
				tap(() => this.initUploader()),
				tap(() => this.uploader.clearQueue()),
				untilDestroyed(this)
			)
			.subscribe();
		this.subject$
			.pipe(
				tap(() => (this.loading = true)),
				tap(() => this.getImportHistory()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	ngAfterViewInit() {
		this.route.queryParamMap
			.pipe(
				filter((params) => !!params && !!params.get('importType')),
				tap(
					(params) =>
						(this.importType = params.get(
							'importType'
						) as ImportTypeEnum)
				),
				tap(() => this.initUploader()),
				untilDestroyed(this)
			)
			.subscribe();
		this.subject$.next(true);
	}

	initUploader() {
		this.uploader = new FileUploader({
			url: `${API_PREFIX}/import`,
			itemAlias: 'file',
			authTokenHeader: 'Authorization',
			authToken: `Bearer ${this.store.token}`,
			headers: [
				{
					name: 'Tenant-Id',
					value: `${this.store.user.tenantId}`
				}
			]
		});
		this.uploader.onBuildItemForm = (item, form) => {
			form.append('importType', this.importType);
		};
		this.uploader.onCompleteItem = () => {
			this.subject$.next(true);
		};
		this.hasBaseDropZoneOver = false;
	}

	onImportTypeChange(e: ImportTypeEnum) {
		this.importType = e;
		this.initUploader();
	}

	public dropFile(e: any) {
		if (e[0].name !== 'archive.zip' || Object.values(e).length > 1) {
			this.uploader.clearQueue();
			this.alert();
		}
	}

	fileOverBase(e: any) {
		this.hasBaseDropZoneOver = e;
	}

	public onFileClick(e: any) {
		if (e.target.files[0].name !== 'archive.zip') {
			this.uploader.clearQueue();
			this.alert();
		}
		e.target.value = '';
	}

	alert() {
		this.toastrService.danger(
			this.getTranslation('MENU.IMPORT_EXPORT.CORRECT_FILE_NAME'),
			this.getTranslation('MENU.IMPORT_EXPORT.WRONG_FILE_NAME'),
			{ position: NbGlobalPhysicalPosition.TOP_RIGHT }
		);
	}

	getImportHistory() {
		this.importService.getHistory().pipe(untilDestroyed(this)).subscribe();
	}

	public download(item: any) {
		try {
			saveAs(item.some, 'archive.zip');
		} catch (error) {
			this.toastrService.danger(error, {
				position: NbGlobalPhysicalPosition.TOP_RIGHT
			});
		}
	}

	public selectItem(item: FileItem) {
		this.selectedItem =
			this.selectedItem.data && item === this.selectedItem.data
				? { isSelected: !this.selectedItem.isSelected, data: null }
				: { isSelected: true, data: item };
	}

	public removeItemQueue() {
		try {
			this.uploader.removeFromQueue(this.selectedItem.data);
			this.clear();
			this.subject$.next(true);
		} catch (error) {
			this.toastrService.danger(error, {
				position: NbGlobalPhysicalPosition.TOP_RIGHT
			});
		}
	}

	public cancelItem() {
		try {
			this.uploader.cancelItem(this.selectedItem.data);
			this.subject$.next(true);
		} catch (error) {
			this.toastrService.danger(error, {
				position: NbGlobalPhysicalPosition.TOP_RIGHT
			});
		}
	}

	public uploadItem() {
		try {
			this.uploader.uploadItem(this.selectedItem.data);
			this.subject$.next(true);
		} catch (error) {
			this.toastrService.danger(error, {
				position: NbGlobalPhysicalPosition.TOP_RIGHT
			});
		}
	}

	public clear() {
		this.selectedItem = {
			isSelected: false,
			data: null
		};
	}
}
