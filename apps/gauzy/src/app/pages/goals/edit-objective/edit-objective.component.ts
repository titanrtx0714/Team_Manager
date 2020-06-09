import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Employee } from '@gauzy/models';
import { EmployeesService } from '../../../@core/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: 'ga-edit-objective',
	templateUrl: './edit-objective.component.html',
	styleUrls: ['./edit-objective.component.scss']
})
export class EditObjectiveComponent implements OnInit, OnDestroy {
	objectiveForm: FormGroup;
	employees: Employee[];
	private _ngDestroy$ = new Subject<void>();

	constructor(
		private dialogRef: NbDialogRef<EditObjectiveComponent>,
		private fb: FormBuilder,
		private employeeService: EmployeesService
	) {}

	ngOnInit(): void {
		this.objectiveForm = this.fb.group({
			name: ['', Validators.required],
			description: [''],
			owner: ['', Validators.required],
			lead: [''],
			deadline: ['Quarterly', Validators.required]
		});
		this.employeeService
			.getAll(['user'])
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((employees) => {
				this.employees = employees.items;
			});
	}

	test(event, control) {
		if (control == 'lead') {
			this.objectiveForm.patchValue({ lead: event });
		} else {
			this.objectiveForm.patchValue({ owner: event });
		}
		console.log(this.objectiveForm);
	}

	saveObjective() {
		this.closeDialog(this.objectiveForm);
	}

	closeDialog(data = null) {
		this.dialogRef.close(data);
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
