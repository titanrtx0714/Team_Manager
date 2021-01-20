import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
	NbCardModule,
	NbButtonModule,
	NbIconModule,
	NbDatepickerModule,
	NbInputModule,
	NbSelectModule,
	NbCheckboxModule,
	NbTooltipModule
} from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { ThemeModule } from '../../@theme/theme.module';
import { TimeOffSettingsMutationComponent } from './settings-mutation/time-off-settings-mutation.component';
import { EmployeeSelectorsModule } from '../../@theme/components/header/selectors/employee/employee.module';
import { TimeOffRequestMutationComponent } from './time-off-request-mutation/time-off-request-mutation.component';
import { FileUploaderModule } from '../file-uploader-input/file-uploader-input.module';
import { TranslaterModule } from '../translater/translater.module';

@NgModule({
	imports: [
		ThemeModule,
		FormsModule,
		NbCardModule,
		ReactiveFormsModule,
		NbButtonModule,
		NbIconModule,
		NgSelectModule,
		NbSelectModule,
		NbDatepickerModule,
		NbInputModule,
		NbCheckboxModule,
		NbTooltipModule,
		EmployeeSelectorsModule,
		FileUploaderModule,
		TranslaterModule
	],
	declarations: [
		TimeOffSettingsMutationComponent,
		TimeOffRequestMutationComponent
	],
	entryComponents: [
		TimeOffSettingsMutationComponent,
		TimeOffRequestMutationComponent
	],
	providers: []
})
export class TimeOffMutationModule {}
