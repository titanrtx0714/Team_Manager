import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NbSelectModule } from '@nebular/theme';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ThemeModule } from '../../../@theme/theme.module';
import { UserSelectComponent } from './user-multi-select.component';

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	imports: [
		ThemeModule,
		NbSelectModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		})
	],
	declarations: [UserSelectComponent],
	entryComponents: [UserSelectComponent],
	exports: [UserSelectComponent],
	providers: []
})
export class UserMultiSelectModule {}
