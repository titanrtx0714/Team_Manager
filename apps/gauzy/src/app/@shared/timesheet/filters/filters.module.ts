import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersComponent } from './filters.component';
import { FormsModule } from '@angular/forms';
import { EmployeeMultiSelectModule } from '../../employee/employee-multi-select/employee-multi-select.module';
import {
	NbButtonModule,
	NbPopoverModule,
	NbSelectModule,
	NbDatepickerModule,
	NbIconModule
} from '@nebular/theme';
import { NgxSliderModule } from '../../slider/slider.module';

@NgModule({
	declarations: [FiltersComponent],
	exports: [FiltersComponent],
	imports: [
		CommonModule,
		FormsModule,
		EmployeeMultiSelectModule,
		NbButtonModule,
		NbPopoverModule,
		NbSelectModule,
		NbDatepickerModule,
		NbIconModule,
		NgxSliderModule
	]
})
export class FiltersModule {}
