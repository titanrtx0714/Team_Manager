import { NgModule } from '@angular/core';
import { CandidateInterviewInfoComponent } from './candidate-interview-info.component';
import {
	NbIconModule,
	NbButtonModule,
	NbCardModule,
	NbTabsetModule
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsModule } from '@angular/forms';
import { CandidateInterviewMutationModule } from '../candidate-interview-mutation/candidate-interview-mutation.module';
import { TranslaterModule } from '../../translater/translater.module';

@NgModule({
	imports: [
		ThemeModule,
		FormsModule,
		NbCardModule,
		NbButtonModule,
		NbIconModule,
		NbTabsetModule,
		CandidateInterviewMutationModule,
		TranslaterModule
	],
	exports: [CandidateInterviewInfoComponent],
	declarations: [CandidateInterviewInfoComponent],
	entryComponents: [CandidateInterviewInfoComponent]
})
export class CandidateInterviewInfoModule {}
