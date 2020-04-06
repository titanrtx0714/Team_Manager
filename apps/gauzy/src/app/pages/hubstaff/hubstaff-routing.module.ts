import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubstaffComponent } from './components/hubstaff/hubstaff.component';

const routes: Routes = [
	{
		path: '',
		component: HubstaffComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class HubstaffRoutingModule {}
