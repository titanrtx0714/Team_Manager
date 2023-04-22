import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import {
	NbLayoutModule,
	NbSidebarModule,
	NbMenuModule,
	NbCardModule,
	NbIconModule,
	NbListModule,
	NbSelectModule,
	NbToggleModule,
	NbInputModule,
	NbButtonModule,
	NbAlertModule,
	NbProgressBarModule,
	NbTabsetModule,
	NbToastrService,
	NbAccordionModule,
	NbTooltipModule,
	NbSpinnerModule,
	NbDialogService
} from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { TimeTrackerService } from '../time-tracker/time-tracker.service';

@NgModule({
	declarations: [SettingsComponent],
	imports: [
		CommonModule,
		NbLayoutModule,
		NbSidebarModule,
		NbMenuModule.forRoot(),
		NbCardModule,
		NbIconModule,
		NbListModule,
		NbSelectModule,
		FormsModule,
		NbToggleModule,
		NbInputModule,
		NbButtonModule,
		NbAlertModule,
		NbProgressBarModule,
		NbTabsetModule,
		NbAccordionModule,
		NbTooltipModule,
		NbSpinnerModule
	],
	providers: [
		NbToastrService,
		TimeTrackerService,
		NbDialogService
	],
	exports: [SettingsComponent]
})
export class SettingsModule {}
