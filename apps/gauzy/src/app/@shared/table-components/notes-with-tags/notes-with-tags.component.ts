import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { Color } from '@kurkle/color';
import { NbThemeService } from '@nebular/theme';

@Component({
	selector: 'ga-notes-with-tags',
	templateUrl: './notes-with-tags.component.html',
	styleUrls: ['./notes-with-tags.component.scss']
})
export class NotesWithTagsComponent implements ViewCell, OnInit {
	@Input()
	rowData: any;

	@Input()
	value: string | number;

	@Input()
	layout?: ComponentLayoutStyleEnum | undefined;

	private textColor!: string;

	constructor(private themeService: NbThemeService) {}

	ngOnInit(): void {
		this.themeService.getJsTheme().subscribe((theme) => {
			this.textColor = theme.variables.fgText.toString();
		});
	}

	backgroundContrast(bgColor: string) {
		const color = new Color(bgColor);
		const threshold = color.rgb
			? color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114
			: null;
		if (threshold && threshold < 150) {
			return '#ffffff';
		} else if (threshold && threshold > 200) {
			return '#000000';
		} else {
      return this.textColor;
    }
	}
}
