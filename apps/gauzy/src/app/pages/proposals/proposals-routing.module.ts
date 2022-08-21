import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProposalsComponent } from './proposals.component';
import { ProposalRegisterComponent } from './proposal-register/proposal-register.component';
import { ProposalDetailsComponent } from './proposal-details/proposal-details.component';
import { ProposalEditComponent } from './proposal-edit/proposal-edit.component';
import { PermissionsEnum } from '@gauzy/contracts';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DateRangePickerResolver } from '../../@theme/components/header/selectors/date-range-picker';

export function redirectTo() {
	return '/pages/dashboard';
}
const PROPOSAL_VIEW_PERMISSION = {
	permissions: {
		only: [PermissionsEnum.ORG_PROPOSALS_VIEW],
		redirectTo
	}
};
const PROPOSAL_EDIT_PERMISSION = {
	permissions: {
		only: [PermissionsEnum.ORG_PROPOSALS_EDIT],
		redirectTo
	}
};

const routes: Routes = [
	{
		path: '',
		component: ProposalsComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			...PROPOSAL_VIEW_PERMISSION
		},
		resolve: {
			dates: DateRangePickerResolver
		}
	},
	{
		path: 'register',
		component: ProposalRegisterComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			...PROPOSAL_EDIT_PERMISSION,
			selectors: {
				project: false,
				employee: false
			},
			datePicker: {
				unitOfTime: 'month'
			}
		},
		resolve: {
			dates: DateRangePickerResolver
		}
	},
	{
		path: 'details/:id',
		component: ProposalDetailsComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			...PROPOSAL_VIEW_PERMISSION
		}
	},
	{
		path: 'edit/:id',
		component: ProposalEditComponent,
		canActivate: [NgxPermissionsGuard],
		data: {
			...PROPOSAL_EDIT_PERMISSION,
			selectors: {
				project: false,
				employee: false
			}
		}
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProposalsRoutingModule {}
