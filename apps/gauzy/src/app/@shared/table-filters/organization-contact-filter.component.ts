import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';

@Component({
    template: `
        <ga-contact-select
            [clearable]="true"
            [placeholder]="'PAYMENTS_PAGE.CONTACT' | translate"
            (onChanged)="onChange($event)"
        ></ga-contact-select>
    `,
})
export class OrganizationContactFilterComponent extends DefaultFilter implements OnChanges {

    constructor() {
        super();
    }

    /**
     *
     *
     */
    ngOnChanges(changes: SimpleChanges) { }

    /**
     *
     * @param event
     */
    onChange(event) {
        // this.column.filterFunction(event);
    }
}
