import { NgModule } from '@angular/core';
import {
	NbBadgeModule,
	NbButtonModule,
	NbCardModule,
	NbCheckboxModule,
	NbDialogModule,
	NbIconModule,
	NbInputModule,
	NbRouteTabsetModule,
	NbSelectModule,
	NbSpinnerModule,
	NbTooltipModule,
	NbRadioModule
} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { ApprovalsComponent } from './approvals.component';
import { SharedModule } from '../../@shared/shared.module';
import { ApprovalsRoutingModule } from './approvals-routing.module';
import { RequestApprovalService } from '../../@core/services/request-approval.service';
import { RequestApprovalMutationModule } from '../../@shared/approvals/approvals-mutation.module';
import { RequestApprovalActionComponent } from './table-components/request-approval-action/request-approval-action.component';
import { CardGridModule } from '../../@shared/card-grid/card-grid.module';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslaterModule } from '../../@shared/translater/translater.module';

@NgModule({
	imports: [
		CommonModule,
		SharedModule,
		ThemeModule,
		NbBadgeModule,
		NbButtonModule,
		NbCardModule,
		NbCheckboxModule,
		NbDialogModule.forChild(),
		NbIconModule,
		NbInputModule,
		NbRouteTabsetModule,
		NbSelectModule,
		NbSpinnerModule,
		Ng2SmartTableModule,
		CardGridModule,
		NbTooltipModule,
		NbRadioModule,
		ApprovalsRoutingModule,
		RequestApprovalMutationModule,
		TranslaterModule,
		NgxPermissionsModule.forChild()
	],
	declarations: [ApprovalsComponent, RequestApprovalActionComponent],
	entryComponents: [],
	providers: [RequestApprovalService]
})
export class ApprovalsModule {}
