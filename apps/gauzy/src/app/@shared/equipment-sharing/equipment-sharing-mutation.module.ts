import { NgModule } from '@angular/core';
import {
	NbIconModule,
	NbCardModule,
	NbButtonModule,
	NbInputModule,
	NbSelectModule,
	NbCheckboxModule,
	NbDatepickerModule,
	NbRadioModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { Store } from '../../@core/services/store.service';
import { EquipmentSharingService } from '../../@core/services/equipment-sharing.service';
import { EquipmentSharingMutationComponent } from './equipment-sharing-mutation.component';
import { EquipmentService } from '../../@core/services/equipment.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { EquipmentSharingPolicyService } from '../../@core/services/equipment-sharing-policy.service';
import { TranslateModule } from '../translate/translate.module';

@NgModule({
	imports: [
		ThemeModule,
		FormsModule,
		NbCardModule,
		NbIconModule,
		NbCheckboxModule,
		ReactiveFormsModule,
		FormsModule,
		NbButtonModule,
		NbInputModule,
		NbSelectModule,
		NbDatepickerModule,
		NgSelectModule,
		NbRadioModule,
		TranslateModule
	],
	declarations: [EquipmentSharingMutationComponent],
	providers: [
		EquipmentSharingService,
		Store,
		EquipmentService,
		EquipmentSharingPolicyService
	]
})
export class EquipmentSharingMutationModule {}
