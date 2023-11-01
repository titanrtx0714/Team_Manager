import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	NbCardModule,
	NbSelectModule,
	NbInputModule,
	NbSpinnerModule,
	NbButtonModule,
	NbIconModule,
	NbTooltipModule
} from '@nebular/theme';
import { NgxPermissionsModule } from "ngx-permissions";
import { IntegrationsRoutingModule } from './integrations-routing.module';
import { IntegrationsComponent } from './integrations.component';
import { SharedModule } from '../../@shared/shared.module';
import { TranslateModule } from '../../@shared/translate/translate.module';
import { IntegrationLayoutComponent } from './layout/layout.component';
import { IntegrationListComponent } from './components/integration-list/list.component';
import { HeaderTitleModule } from '../../@shared/components/header-title/header-title.module';
import { GauzyButtonActionModule } from "../../@shared/gauzy-button-action/gauzy-button-action.module";
import { TableComponentsModule } from "../../@shared/table-components";
import { NoDataMessageModule } from '../../@shared/no-data-message/no-data-message.module';

@NgModule({
	imports: [
		CommonModule,
		NbButtonModule,
		NbCardModule,
		NbInputModule,
		NbSelectModule,
		NbSpinnerModule,
		NbTooltipModule,
		IntegrationsRoutingModule,
		SharedModule,
		TranslateModule,
		HeaderTitleModule,
		NbIconModule,
		NgxPermissionsModule.forChild(),
		GauzyButtonActionModule,
		TableComponentsModule,
		NoDataMessageModule
	],
	declarations: [
		IntegrationLayoutComponent,
		IntegrationListComponent,
		IntegrationsComponent,
	],
})
export class IntegrationsModule { }
