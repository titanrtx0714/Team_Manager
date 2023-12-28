import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbIconModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { Angular2SmartTableModule } from 'angular2-smart-table';
import { IncomeModule } from '../../../pages/income/income.module';
import { ProfitHistoryComponent } from './profit-history.component';
import { ExpenseTableComponent } from './table-components/expense-table.component';
import { IncomeTableComponent } from './table-components/income-table.component';
import { TranslateModule } from '../../translate/translate.module';
import { PaginationModule } from '../../pagination/pagination.module';

@NgModule({
	imports: [
		CommonModule,
		Angular2SmartTableModule,
		IncomeModule,
		NbIconModule,
		NbCardModule,
		NbSpinnerModule,
		TranslateModule,
		PaginationModule
	],
	exports: [ProfitHistoryComponent],
	declarations: [
		ProfitHistoryComponent,
		ExpenseTableComponent,
		IncomeTableComponent
	],
	providers: []
})
export class ProfitHistoryModule { }
