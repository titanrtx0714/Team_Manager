import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbFormFieldModule, NbIconModule, NbInputModule, NbSpinnerModule } from '@nebular/theme';
import { CKEditorModule } from 'ckeditor4-angular';
import { FileUploadModule } from 'ng2-file-upload';
import { ApplyJobManuallyComponent } from './apply-job-manually.component';
import { JobTableComponentsModule } from '../../../table-components';
import { DirectivesModule } from './../../../../../@shared/directives/directives.module';
import { TranslateModule } from './../../../../../@shared/translate/translate.module';
import { EmployeeMultiSelectModule } from './../../../../../@shared/employee/employee-multi-select/employee-multi-select.module';
import { ProposalTemplateSelectModule } from './../../../../../@shared/proposal-template-select/proposal-template-select.module';
import { EmployeeSelectorsModule } from './../../../../../@theme/components/header/selectors/employee';

@NgModule({
	providers: [],
	declarations: [ApplyJobManuallyComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CKEditorModule,
		FileUploadModule,
		NbButtonModule,
		NbCardModule,
		NbFormFieldModule,
		NbIconModule,
		NbInputModule,
		NbSpinnerModule,
		TranslateModule,
		EmployeeMultiSelectModule,
		ProposalTemplateSelectModule,
		JobTableComponentsModule,
		DirectivesModule,
		EmployeeSelectorsModule
	],
	exports: []
})
export class ApplyJobManuallyModule { }
