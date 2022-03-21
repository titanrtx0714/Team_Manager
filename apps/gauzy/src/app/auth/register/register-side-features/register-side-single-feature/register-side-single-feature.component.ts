import { Component, Input } from '@angular/core';
import { IRegisterSideFeature } from "@gauzy/contracts";


@Component({
  selector: 'ngx-register-side-single-feature',
  templateUrl: './register-side-single-feature.component.html',
  styleUrls: ['./register-side-single-feature.component.scss'],
})
export class NgxRegisterSideSingleFeatureComponent {
  constructor () {}

  @Input() feature: IRegisterSideFeature | null = null;
}
