import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsColorInputComponent } from './tags-color-input.component';
import { NbBadgeModule, NbSelectModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TagsService } from '../../../@core/services/tags.service';
import { TranslaterModule } from '../../translater/translater.module';

@NgModule({
	imports: [
		CommonModule,
		NbSelectModule,
		NbBadgeModule,
		FormsModule,
		NgSelectModule,
		TranslaterModule
	],
	exports: [TagsColorInputComponent],
	declarations: [TagsColorInputComponent],
	providers: [TagsService]
})
export class TagsColorInputModule {}
