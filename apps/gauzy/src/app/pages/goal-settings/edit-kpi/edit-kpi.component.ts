import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslationBaseComponent } from '../../../@shared/language-base/translation-base.component';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EmployeesService } from '../../../@core/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
	IEmployee,
	KpiMetricEnum,
	KpiOperatorEnum,
	IKPI,
	CurrenciesEnum,
	KeyResultNumberUnitsEnum
} from '@gauzy/models';
import { Store } from '../../../@core/services/store.service';
import { GoalSettingsService } from '../../../@core/services/goal-settings.service';

@Component({
	selector: 'ga-edit-kpi',
	templateUrl: './edit-kpi.component.html',
	styleUrls: ['./edit-kpi.component.scss']
})
export class EditKpiComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	kpiForm: FormGroup;
	employees: IEmployee[];
	selectedKPI: IKPI;
	type: string;
	helper = '';
	currenciesEnum = CurrenciesEnum;
	numberUnitsEnum: string[] = Object.values(KeyResultNumberUnitsEnum);
	kpiOperatorEnum = KpiOperatorEnum;
	kpiMetricEnum = KpiMetricEnum;
	private _ngDestroy$ = new Subject<void>();
	constructor(
		private fb: FormBuilder,
		readonly translate: TranslateService,
		private dialogRef: NbDialogRef<EditKpiComponent>,
		private employeeService: EmployeesService,
		private store: Store,
		private goalSettingsService: GoalSettingsService
	) {
		super(translate);
	}

	ngOnInit(): void {
		this.kpiForm = this.fb.group({
			name: ['', Validators.required],
			description: [''],
			type: [KpiMetricEnum.NUMERICAL, Validators.required],
			currentValue: [0],
			targetValue: [1],
			lead: ['', Validators.required],
			operator: [
				KpiOperatorEnum.GREATER_THAN_EQUAL_TO,
				Validators.required
			],
			unit: [KeyResultNumberUnitsEnum.ITEMS]
		});
		this.employeeService
			.getAll(['user'])
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((employees) => {
				this.employees = employees.items;
			});
		if (!!this.selectedKPI) {
			if (
				!this.numberUnitsEnum.find(
					(unit) => unit === this.selectedKPI.unit
				)
			) {
				this.numberUnitsEnum.push(this.selectedKPI.unit);
			}
			this.kpiForm.patchValue({
				...this.selectedKPI
			});
			this.kpiForm.patchValue({
				lead: !!this.selectedKPI.lead ? this.selectedKPI.lead.id : null
			});
		}
	}

	helperText(event) {
		this.helper = !!event ? event.target.id : '';
	}

	async saveKeyResult() {
		const kpiData = {
			...this.kpiForm.value,
			organization: this.store.selectedOrganization.id
		};
		if (this.type === 'add') {
			await this.goalSettingsService.createKPI(kpiData).then((res) => {
				if (res) {
					this.closeDialog(res);
				}
			});
		} else {
			await this.goalSettingsService
				.updateKPI(this.selectedKPI.id, kpiData)
				.then((res) => {
					if (res) {
						this.closeDialog(res);
					}
				});
		}
	}

	selectEmployee(event, control) {
		if (control === 'lead') {
			this.kpiForm.patchValue({ lead: event });
		} else {
			this.kpiForm.patchValue({ owner: event });
		}
	}

	closeDialog(data) {
		this.dialogRef.close(data);
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
