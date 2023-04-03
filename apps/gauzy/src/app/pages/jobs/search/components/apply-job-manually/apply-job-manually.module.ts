import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { CKEditorModule } from 'ckeditor4-angular';
import { ApplyJobManuallyComponent } from './apply-job-manually.component';
import { TranslateModule } from './../../../../../@shared/translate/translate.module';

@NgModule({
	providers: [],
	declarations: [
		ApplyJobManuallyComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CKEditorModule,
		NbButtonModule,
		NbCardModule,
		NbFormFieldModule,
		NbIconModule,
		NbInputModule,
		TranslateModule
	],
	exports: []
})
export class ApplyJobManuallyModule { }
