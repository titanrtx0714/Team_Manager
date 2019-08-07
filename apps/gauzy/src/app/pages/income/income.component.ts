import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../@core/services/auth.service';
import { RolesEnum, Income } from '@gauzy/models';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Store } from '../../@core/services/store.service';
import { IncomeService } from '../../@core/services/income.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import { DeleteConfirmationComponent } from '../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { IncomeMutationComponent } from '../../@shared/income/income-mutation/income-mutation.component';
import { DateViewComponent } from './table-components/date-view/date-view.component';

interface SelectedRowModel {
    data: Income,
    isSelected: boolean,
    selected: Income[],
    source: LocalDataSource
}

@Component({
    templateUrl: './income.component.html',
    styleUrls: ['./income.component.scss']
})

export class IncomeComponent implements OnInit, OnDestroy {
    static smartTableSettings = {
        actions: false,
        mode: 'external',
        editable: true,
        noDataMessage: 'No data for the currently selected employee.',
        columns: {
            valueDate: {
                title: 'Date',
                type: 'custom',
                width: '20%',
                renderComponent: DateViewComponent
            },
            clientName: {
                title: 'Client Name',
                type: 'string'
            },
            amount: {
                title: 'Value',
                type: 'number',
                width: '15%'
            },
            notes: {
                title: 'Notes',
                type: 'string'
            }
        },
        pager: {
            display: true,
            perPage: 8
        }
    };

    private _ngDestroy$ = new Subject<void>();

    hasRole: boolean;
    selectedEmployeeId: string;
    smartTableSource = new LocalDataSource();

    selectedIncome: SelectedRowModel;

    get smartTableSettings() {
        return IncomeComponent.smartTableSettings;
    }

    constructor(private authService: AuthService,
        private store: Store,
        private incomeService: IncomeService,
        private dialogService: NbDialogService,
        private fb: FormBuilder) { }

    async ngOnInit() {
        this.hasRole = await this.authService
            .hasRole([RolesEnum.ADMIN, RolesEnum.DATA_ENTRY])
            .pipe(first())
            .toPromise()

        this.store.selectedEmployee$
            .pipe(takeUntil(this._ngDestroy$))
            .subscribe(employee => {
                if (employee && employee.id) {
                    this.selectedEmployeeId = employee.id;
                    this._loadEmployeeIncomeData(employee.id);
                }
            });
    }

    selectIncome(ev: SelectedRowModel) {
        this.selectedIncome = ev;
    }

    async addIncome() {
        const result = await this.dialogService.open(IncomeMutationComponent).onClose.pipe(first()).toPromise();
        if (result) {
            try {
                await this.incomeService.create({
                    amount: result.amount,
                    clientName: result.client.clientName,
                    clientId: result.client.clientId,
                    valueDate: result.valueDate,
                    employeeId: this.selectedEmployeeId,
                    notes: result.notes
                });

                this._loadEmployeeIncomeData();
            } catch (error) {
                console.log(error);
            }
        }
    }

    async editIncome() {
        this.dialogService.open(IncomeMutationComponent, {
            context: {
                income: this.selectedIncome.data
            }
        })
            .onClose
            .pipe(takeUntil(this._ngDestroy$))
            .subscribe(async result => {
                if (result) {
                    try {
                        await this.incomeService
                            .update(this.selectedIncome.data.id, {
                                amount: result.amount,
                                clientName: result.client.clientName,
                                clientId: result.client.clientId,
                                valueDate: result.valueDate,
                                notes: result.notes
                            });

                        this._loadEmployeeIncomeData();
                        this.selectedIncome = null;
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
    }

    async deleteIncome() {
        this.dialogService.open(DeleteConfirmationComponent, {
            context: { recordType: 'Income' }
        })
            .onClose
            .pipe(takeUntil(this._ngDestroy$))
            .subscribe(async result => {
                if (result) {
                    try {
                        await this.incomeService
                            .delete(this.selectedIncome.data.id);

                        this._loadEmployeeIncomeData();
                        this.selectedIncome = null;
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
    }

    private async _loadEmployeeIncomeData(id = this.selectedEmployeeId) {
        const { items } = await this.incomeService.getAll(['employee'], { employee: { id } });

        this.smartTableSource.load(items);
    }

    ngOnDestroy() {
        this._ngDestroy$.next();
        this._ngDestroy$.complete();
    }
}
