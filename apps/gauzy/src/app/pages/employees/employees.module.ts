import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NbCardModule, NbButtonModule, NbInputModule, NbIconModule, NbDialogModule, NbTooltipModule, NbBadgeModule, NbSelectModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { OrganizationsService } from '../../@core/services/organizations.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { EmployeeMutationModule } from '../../@shared/employee/employee-mutation/employee-mutation.module';
import { EmployeeEndWorkModule } from '../../@shared/employee/employee-end-work-popup/employee-end-work.module';
import { EmployeeBonusComponent } from './table-components/employee-bonus/employee-bonus.component';
import { EmployeeFullNameComponent } from './table-components/employee-fullname/employee-fullname';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EditEmployeeProfileComponent } from './edit-employee/edit-employee-profile/edit-employee-profile.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmployeeSettingMutationModule } from '../../@shared/employee/employee-setting-mutation/employee-setting-mutation.module';
import { ImageUpladerModule } from '../../@shared/image-uploader/image-uploader.module';
import { EmployeeWorkStatus } from './table-components/employee-work-status/employee-work-status';

const COMPONENTS = [
    EmployeesComponent,
    EmployeeBonusComponent,
    EmployeeFullNameComponent,
    EmployeeWorkStatus,
    EditEmployeeComponent,
    EditEmployeeProfileComponent
];

@NgModule({
    imports: [ 
        EmployeesRoutingModule,
        ThemeModule,
        NbCardModule,
        FormsModule,
        ReactiveFormsModule,
        NbButtonModule,
        NbInputModule,
        NbIconModule,
        Ng2SmartTableModule,
        NbDialogModule.forChild(),
        EmployeeMutationModule,
        EmployeeEndWorkModule,
        NbTooltipModule,
        NgSelectModule,
        EmployeeSettingMutationModule,
        ImageUpladerModule,
        NbBadgeModule,
        NbSelectModule
    ],
    declarations: [
        ...COMPONENTS,
    ],
    entryComponents: [
        EmployeeBonusComponent,
        EmployeeFullNameComponent,
        EmployeeWorkStatus
    ],
    providers: [
        OrganizationsService
    ]
})
export class EmployeesModule { }