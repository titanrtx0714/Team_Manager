import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from './../../../../@shared/translate/translate.module';
import { WarehouseService } from '../../../../@core/services/warehouse.service';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '../../../../@shared/shared.module';
import {
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbDialogModule,
    NbCheckboxModule,
    NbSelectModule,
    NbTabsetModule,
    NbInputModule,
    NbStepperModule,
    NbTooltipModule,
} from '@nebular/theme';
import { CommonModule } from '@angular/common';
import { HeaderTitleModule } from './../../../../@shared/components/header-title/header-title.module';
import { ThemeModule } from './../../../../@theme/theme.module';
import { WarehousesTableComponent } from './warehouses-table/warehouses-table.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehousesComponent } from './warehouses.component';
import { WarehouseProductsTableComponent } from './warehouse-products-table/warehouse-products-table.component';
import { WarehousesRoutingModule } from './warehouses-routing.module';
import { SelectProductComponent } from './select-product-form/select-product-form.component';
import { ManageQuantityComponent } from './manage-quantity/manage-quantity.component';
import { ManageVariantsQuantityComponent } from './manage-variants-quantity/manage-variants-quantity.component';
import { ManageVariantsQuantityFormComponent } from './manage-variants-quantity-form/manage-variants-quantity-form.component';
import { LeafletMapModule, LocationFormModule } from './../../../../@shared/forms';
import { TagsColorInputModule } from './../../../../@shared/tags/tags-color-input/tags-color-input.module';
import { PaginationModule } from '../../../../@shared/pagination/pagination.module';
import { CardGridModule } from '../../../../@shared/card-grid/card-grid.module';
import { GauzyButtonActionModule } from './../../../../@shared/gauzy-button-action/gauzy-button-action.module';
import { InventoryTableComponentsModule } from '../inventory-table-components';


const NB_MODULES = [
    NbCardModule,
    NbButtonModule,
    NbIconModule,
    NbSpinnerModule,
    NbDialogModule,
    NbCheckboxModule,
    NbSelectModule,
    NbTabsetModule,
    NbInputModule,
    NbStepperModule,
    NbTooltipModule
];


@NgModule({
    declarations: [
        WarehousesTableComponent,
        WarehouseFormComponent,
        WarehousesComponent,
        WarehouseProductsTableComponent,
        SelectProductComponent,
        ManageQuantityComponent,
        ManageVariantsQuantityComponent,
        ManageVariantsQuantityFormComponent,
    ],
    imports: [
        WarehousesRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        Ng2SmartTableModule,
        CommonModule,
        TranslateModule,
        ...NB_MODULES,
        SharedModule,
        HeaderTitleModule,
        ThemeModule,
        LocationFormModule,
        LeafletMapModule,
        TagsColorInputModule,
        PaginationModule,
        CardGridModule,
        GauzyButtonActionModule,
        CardGridModule,
        InventoryTableComponentsModule       
    ],
    providers: [WarehouseService]
})
export class WarehousesModule { }