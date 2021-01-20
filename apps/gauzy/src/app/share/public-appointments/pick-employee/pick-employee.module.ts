import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { PickEmployeeComponent } from './pick-employee.component';
import { PickEmployeeRoutingModule } from './pick-employee.routing.module';
import {
	NbCardModule,
	NbButtonModule,
	NbToastrModule,
	NbSpinnerModule
} from '@nebular/theme';
import { EmployeeSelectorsModule } from '../../../@theme/components/header/selectors/employee/employee.module';
import { BackNavigationModule } from '../../../@shared/back-navigation/back-navigation.module';
import { EventTypeService } from '../../../@core/services/event-type.service';
import { TranslaterModule } from '../../../@shared/translater/translater.module';

@NgModule({
	imports: [
		ThemeModule,
		NbToastrModule,
		NbSpinnerModule,
		NbButtonModule,
		NbCardModule,
		EmployeeSelectorsModule,
		BackNavigationModule,
		PickEmployeeRoutingModule,
		TranslaterModule
	],
	declarations: [PickEmployeeComponent],
	entryComponents: [PickEmployeeComponent],
	providers: [EventTypeService]
})
export class PickEmployeeModule {}
