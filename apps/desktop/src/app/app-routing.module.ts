import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { NgModule } from '@angular/core';
import { SetupComponent } from './pages/setup/setup.component';
import { TimeTrackerComponent } from './pages/time-tracker/time-tracker.component';
import { ScreenCaptureComponent } from './pages/screen-capture/screen-capture.component';

const routes: Routes = [
	{
		path: '',
		component: SetupComponent
	},
	{
		path: 'time-tracker',
		component: TimeTrackerComponent
	},
	{
		path: 'screen-capture',
		component: ScreenCaptureComponent
	}
];

const config: ExtraOptions = {
	useHash: true
};

@NgModule({
	imports: [RouterModule.forRoot(routes, config)],
	exports: [RouterModule]
})
export class AppRoutingModule {}
