import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { getContrastColor } from 'libs/utils';

@Component({
	selector: 'ga-picture-name-tags',
	template: `
		<div
			*ngIf="rowData.imageUrl"
			style="display: flex; align-items: center;"
		>
			<div class="image-container">
				<img [src]="rowData.imageUrl" />
			</div>
			<div
				*ngIf="rowData.fullName"
				class="d-block"
				style="margin-left:15px;"
			>
				{{ rowData.fullName }}
			</div>
			<div class="d-block" style="margin-left:15px;">
				{{ rowData.name }}
			</div>
		</div>
		<div
			*ngIf="rowData.name && !rowData.imageUrl"
			style="display: flex; align-items: center;"
		>
			<div *ngIf="rowData.fullName" class="d-block">
				{{ rowData.fullName }}
			</div>
			<div class="d-block">
				{{ rowData.name }}
			</div>
		</div>
		<div class="tags">
			<nb-badge
				*ngFor="let tag of rowData?.tags"
				class="color"
				position="centered"
				[style.background]="tag.color"
				[style.color]="backgroundContrast(tag.color)"
				text="{{ tag.name }}"
			>
			</nb-badge>
		</div>
	`,
	styles: [
		`
			.image-container {
				width: 70px;
				height: 63px;
				display: flex;
				justify-content: center;
			}

			.color {
				position: static;
				margin-top: 5px;
				margin-right: 5px;
				display: inline-block;
			}
			.tags {
				display: flex;
				width: 200px;
				flex-wrap: wrap;
			}

			img {
				height: 100%;
				max-width: 70px;
			}
		`,
	],
})
export class PictureNameTagsComponent implements ViewCell {
	@Input()
	rowData: any;

	value: string | number;

	backgroundContrast(bgColor: string) {
		return getContrastColor(bgColor);
	}
}
