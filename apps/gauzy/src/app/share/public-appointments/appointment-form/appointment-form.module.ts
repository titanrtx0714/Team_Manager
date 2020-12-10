import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory, ThemeModule } from '../../../@theme/theme.module';
import { NbCardModule, NbSpinnerModule, NbButtonModule } from '@nebular/theme';
import { AppointmentModule } from '../../../pages/employees/appointment/appointment.module';
import { AppointmentFormRoutingModule } from './appointment-form.routing.module';
import { AppointmentFormComponent } from './appointment-form.component';
import { ManageAppointmentModule } from '../../../pages/employees/appointment/manage-appointment/manage-appointment.module';
@NgModule({
	imports: [
		ThemeModule,
		NbButtonModule,
		NbSpinnerModule,
		NbCardModule,
		AppointmentFormRoutingModule,
		AppointmentModule,
		ManageAppointmentModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	declarations: [AppointmentFormComponent],
	entryComponents: [AppointmentFormComponent],
	exports: [AppointmentFormComponent],
	providers: []
})
export class AppointmentFormModule {}
