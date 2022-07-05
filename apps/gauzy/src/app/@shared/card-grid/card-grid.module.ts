import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { Store } from '../../@core/services/store.service';
import { ThemeModule } from '../../@theme/theme.module';
import { CardGridComponent } from './card-grid.component';
import { CustomViewComponent } from './card-grid-custom.component';
import { TranslateModule } from '../translate/translate.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NodataModule } from '../no-data/no-data.module';

@NgModule({
	imports: [ThemeModule, NbCardModule, TranslateModule, InfiniteScrollModule, NodataModule],
	declarations: [CardGridComponent, CustomViewComponent],
	exports: [CardGridComponent],
	providers: [Store]
})
export class CardGridModule {}
