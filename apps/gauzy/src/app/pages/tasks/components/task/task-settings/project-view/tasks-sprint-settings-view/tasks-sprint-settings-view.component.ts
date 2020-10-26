import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import {
	IOrganizationSprint,
	IOrganizationProject,
	IOrganization
} from '@gauzy/models';
import { SprintStoreService } from '../../../../../../../@core/services/organization-sprint-store.service';
import { ItemActionType } from '../../../../../../../@shared/components/editable-grid/gauzy-editable-grid.component';
import { Store } from '../../../../../../../@core/services/store.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-tasks-sprint-settings-view',
	templateUrl: './tasks-sprint-settings-view.component.html'
})
export class TasksSprintSettingsViewComponent implements OnInit, OnDestroy {
	@Input() project: IOrganizationProject;
	sprints$: Observable<IOrganizationSprint[]> = this.store.sprints$.pipe(
		map((sprints: IOrganizationSprint[]): IOrganizationSprint[] =>
			sprints.filter(
				(sprint: IOrganizationSprint) =>
					sprint.projectId === this.project.id
			)
		),
		map((sprints: IOrganizationSprint[]): IOrganizationSprint[] => {
			return sprints.sort((sprint, nextSprint) =>
				sprint.startDate < nextSprint.startDate ? -1 : 1
			);
		})
	);
	moment: any = moment;
	organization: IOrganization;

	constructor(
		private store: SprintStoreService,
		private storeSerive: Store
	) {}

	ngOnInit(): void {
		this.storeSerive.selectedOrganization$
			.pipe(
				filter((organization) => !!organization),
				tap((organization) => (this.organization = organization)),
				tap(() =>
					this.store.fetchSprints({
						organizationId: this.organization.id,
						tenantId: this.storeSerive.user.tenantId,
						projectId: this.project.id
					})
				),
				untilDestroyed(this)
			)
			.subscribe();
	}

	sprintAction({
		actionType,
		data
	}: {
		actionType: ItemActionType;
		data: IOrganizationSprint;
	}): void {
		switch (actionType) {
			case 'create':
				const createSprintInput: IOrganizationSprint = {
					...data,
					organizationId: this.project.organizationId,
					tenantId: this.storeSerive.user.tenantId,
					projectId: this.project.id
				};
				this.store
					.createSprint(createSprintInput)
					.pipe(untilDestroyed(this))
					.subscribe();
				break;

			case 'edit':
				this.store
					.updateSprint(data)
					.pipe(untilDestroyed(this))
					.subscribe();
				break;

			case 'delete':
				this.store
					.deleteSprint(data.id)
					.pipe(untilDestroyed(this))
					.subscribe();
				break;
		}
	}

	ngOnDestroy(): void {}
}
