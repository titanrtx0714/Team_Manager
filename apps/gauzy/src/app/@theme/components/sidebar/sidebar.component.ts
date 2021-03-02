import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ComponentRef,
	Input,
	OnDestroy,
	ViewChild,
	ViewContainerRef
} from '@angular/core';
import { ISidebarConfig } from '../../../@core/services';

@Component({
	selector: 'ngx-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
	@Input() sidebar: ISidebarConfig;

	@ViewChild('container', { read: ViewContainerRef })
	private container: ViewContainerRef;

	private componentRef: ComponentRef<any>;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver,
		private changeDetectorRef: ChangeDetectorRef
	) {}

	ngAfterViewInit(): void {
		this.loadComponent();
		this.changeDetectorRef.detectChanges();
	}

	private async loadComponent() {
		const renderComponent = this.sidebar.loadComponent();
		const component =
			renderComponent instanceof Promise
				? await renderComponent
				: renderComponent;

		const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
			component
		);

		this.componentRef = this.container.createComponent(componentFactory);
		this.componentRef.changeDetectorRef.markForCheck();
	}

	ngOnDestroy() {
		if (this.componentRef) {
			this.componentRef.destroy();
		}
	}
}
