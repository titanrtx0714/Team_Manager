import { NgModule } from '@angular/core';
import { NbCardModule, NbRouteTabsetModule } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { CustomSmtpComponent } from './custom-smtp.component';
import { CustomSmtpRoutingModule } from './custom-smtp-routing.module';
import { SMTPModule } from '../../../@shared/smtp/smtp.module';
import { TranslaterModule } from '../../../@shared/translater/translater.module';

@NgModule({
	imports: [
		CustomSmtpRoutingModule,
		ThemeModule,
		NbCardModule,
		NbRouteTabsetModule,
		TranslaterModule,
		SMTPModule
	],
	declarations: [CustomSmtpComponent],
	providers: []
})
export class CustomSmtpModule {}
