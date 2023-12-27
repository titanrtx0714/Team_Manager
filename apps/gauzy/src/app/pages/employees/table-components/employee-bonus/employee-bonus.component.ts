import { Component, Input } from '@angular/core';
import { ViewCell } from 'angular2-smart-table';

@Component({
    templateUrl: './employee-bonus.component.html'
})
export class EmployeeBonusComponent implements ViewCell {
    @Input()
    rowData: any;

    value: string | number;
}
