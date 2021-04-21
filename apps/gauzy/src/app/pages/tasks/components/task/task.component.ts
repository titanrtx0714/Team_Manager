import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
	Router,
	NavigationEnd,
	RouterEvent,
	ActivatedRoute
} from '@angular/router';
import * as _ from 'underscore';
import { Observable } from 'rxjs';
import { first, map, tap, filter, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource, Ng2SmartTableComponent } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import {
	ITask,
	IOrganizationProject,
	ComponentLayoutStyleEnum,
	TaskListTypeEnum,
	IOrganization,
	IOrganizationTeam,
	ISelectedEmployee
} from '@gauzy/contracts';
import { TranslationBaseComponent } from '../../../../@shared/language-base/translation-base.component';
import { DeleteConfirmationComponent } from '../../../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { MyTaskDialogComponent } from './../my-task-dialog/my-task-dialog.component';
import { TeamTaskDialogComponent } from '../team-task-dialog/team-task-dialog.component';
import { ComponentEnum } from '../../../../@core/constants/layout.constants';
import { AddTaskDialogComponent } from '../../../../@shared/tasks/add-task-dialog/add-task-dialog.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	MyTasksStoreService,
	OrganizationTeamsService,
	Store,
	TasksStoreService,
	TeamTasksStoreService
} from './../../../../@core/services';
import {
	AssignedToComponent,
	DateViewComponent,
	EmployeeWithLinksComponent,
	NotesWithTagsComponent,
	StatusViewComponent,
	TaskEstimateComponent,
	TaskTeamsComponent
} from './../../../../@shared/table-components';
import { ALL_PROJECT_SELECTED } from './../../../../@shared/project-select/project/default-project';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-task',
	templateUrl: './task.component.html',
	styleUrls: ['task.component.scss']
})
export class TaskComponent
	extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	settingsSmartTable: object;
	loading = false;
	smartTableSource = new LocalDataSource();
	form: FormGroup;
	disableButton = true;
	availableTasks$: Observable<ITask[]>;
	tasks$: Observable<ITask[]>;
	myTasks$: Observable<ITask[]>;
	teamTasks$: Observable<ITask[]>;
	selectedTask: ITask;
	view: string;
	viewComponentName: ComponentEnum;
	teams: IOrganizationTeam[] = [];
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	organization: IOrganization;
	selectedProject$: Observable<IOrganizationProject>;
	viewMode: TaskListTypeEnum = TaskListTypeEnum.GRID;
	defaultProject = ALL_PROJECT_SELECTED;

	tasksTable: Ng2SmartTableComponent;
	@ViewChild('tasksTable') set content(content: Ng2SmartTableComponent) {
		if (content) {
			this.tasksTable = content;
			this.onChangedSource();
		}
	}

	constructor(
		private readonly dialogService: NbDialogService,
		private readonly _taskStore: TasksStoreService,
		private readonly _myTaskStore: MyTasksStoreService,
		private readonly _teamTaskStore: TeamTasksStoreService,
		readonly translateService: TranslateService,
		private readonly router: Router,
		private readonly _store: Store,
		private readonly route: ActivatedRoute,
		private readonly organizationTeamsService: OrganizationTeamsService
	) {
		super(translateService);
		this.tasks$ = this._taskStore.tasks$;
		this.myTasks$ = this._myTaskStore.myTasks$;
		this.teamTasks$ = this._teamTaskStore.tasks$;
		this.setView();
	}

	ngOnInit() {
		this._loadTableSettings();
		this._applyTranslationOnSmartTable();

		this._store.selectedEmployee$
			.pipe(
				filter((employee) => !!employee),
				untilDestroyed(this)
			)
			.subscribe((selectedEmployee: ISelectedEmployee) => {
				if (selectedEmployee.id && this.organization) {
					this.loadTeams(selectedEmployee.id);
					this.storeInstance.fetchTasks(
						this.organization,
						selectedEmployee.id
					);
				}
			});
		this._store.selectedOrganization$
			.pipe(
				filter((organization) => !!organization),
				untilDestroyed(this)
			)
			.subscribe((organization) => {
				if (organization) {
					this.organization = organization;
					this.loadTeams();
					this.storeInstance.fetchTasks(this.organization);
				}
			});
		this.route.queryParamMap
			.pipe(
				filter((params) => !!params),
				debounceTime(1000),
				untilDestroyed(this)
			)
			.subscribe((params) => {
				if (params.get('openAddDialog') === 'true') {
					this.createTaskDialog();
				}
			});
		this.router.events
			.pipe(untilDestroyed(this))
			.subscribe((event: RouterEvent) => {
				if (event instanceof NavigationEnd) {
					this.setView();
				}
			});
		this.selectedProject$ = this._store.selectedProject$.pipe(
			tap((project) => this.selectProject(project)),
			tap((selectedProject: IOrganizationProject) => {
				if (!!selectedProject) {
					this.viewMode = selectedProject.taskListType as TaskListTypeEnum;
				} else {
					this.viewMode = TaskListTypeEnum.GRID;
				}
			})
		);
	}

	selectProject(project: IOrganizationProject | null): void {
		this.initTasks();
		this.viewMode = !!project
			? (project.taskListType as TaskListTypeEnum)
			: TaskListTypeEnum.GRID;

		if (!!project) {
			this.availableTasks$ = this.availableTasks$.pipe(
				map((tasks: ITask[]) =>
					tasks.filter(
						(task: ITask) =>
							task?.project?.id === project.id ||
							project.id === ALL_PROJECT_SELECTED.id
					)
				)
			);
		}
	}

	private initTasks(): void {
		const pathName = window.location.href;
		if (pathName.indexOf('tasks/me') !== -1) {
			this.availableTasks$ = this.myTasks$;
			return;
		}
		if (pathName.indexOf('tasks/team') !== -1) {
			this.availableTasks$ = this.teamTasks$;
			return;
		}
		this.availableTasks$ = this.tasks$;
	}

	setView() {
		this.initTasks();
		const pathName = window.location.href;
		if (pathName.indexOf('tasks/me') !== -1) {
			this._myTaskStore.fetchTasks();
			this.view = 'my-tasks';
			this.viewComponentName = ComponentEnum.MY_TASKS;
		} else if (pathName.indexOf('tasks/team') !== -1) {
			this.view = 'team-tasks';
			this.viewComponentName = ComponentEnum.TEAM_TASKS;
		} else {
			this.view = 'tasks';
			this.viewComponentName = ComponentEnum.ALL_TASKS;
		}
		this._store
			.componentLayout$(this.viewComponentName)
			.pipe(untilDestroyed(this))
			.subscribe(
				(componentLayout) => (this.dataLayoutStyle = componentLayout)
			);
	}

	/*
	 * Table on changed source event
	 */
	onChangedSource() {
		this.tasksTable.source.onChangedSource
			.pipe(
				untilDestroyed(this),
				tap(() => this.clearItem())
			)
			.subscribe();
	}

	private _applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this._loadTableSettings();
			});
	}

	private _loadTableSettings() {
		this.settingsSmartTable = {
			actions: false,
			columns: {
				description: {
					title: this.getTranslation('TASKS_PAGE.TASKS_TITLE'),
					type: 'custom',
					filter: true,
					class: 'align-row',
					renderComponent: NotesWithTagsComponent
				},
				projectName: {
					title: this.getTranslation('TASKS_PAGE.TASKS_PROJECT'),
					type: 'string',
					filter: false
				},
				creator: {
					title: this.getTranslation('TASKS_PAGE.TASKS_CREATOR'),
					type: 'string',
					filter: false
				},
				...this.getColumnsByPage(),
				estimate: {
					title: this.getTranslation('TASKS_PAGE.ESTIMATE'),
					type: 'custom',
					filter: false,
					renderComponent: TaskEstimateComponent
				},
				dueDate: {
					title: this.getTranslation('TASKS_PAGE.DUE_DATE'),
					type: 'custom',
					filter: false,
					renderComponent: DateViewComponent
				},
				status: {
					title: this.getTranslation('TASKS_PAGE.TASKS_STATUS'),
					type: 'custom',
					width: '15%',
					filter: false,
					renderComponent: StatusViewComponent
				}
			}
		};
	}

	private getColumnsByPage() {
		if (this.isTasksPage()) {
			return {
				employees: {
					title: this.getTranslation('TASKS_PAGE.TASK_MEMBERS'),
					type: 'custom',
					filter: false,
					renderComponent: EmployeeWithLinksComponent
				},
				teams: {
					title: this.getTranslation('TASKS_PAGE.TASK_TEAMS'),
					type: 'custom',
					filter: false,
					renderComponent: TaskTeamsComponent
				}
			};
		} else if (this.isMyTasksPage()) {
			return {
				assignTo: {
					title: this.getTranslation('TASKS_PAGE.TASK_ASSIGNED_TO'),
					type: 'custom',
					filter: false,
					renderComponent: AssignedToComponent
				}
			};
		} else if (this.isTeamTaskPage()) {
			return {
				assignTo: {
					title: this.getTranslation('TASKS_PAGE.TASK_ASSIGNED_TO'),
					type: 'custom',
					filter: {
						type: 'list',
						config: {
							selectText: this.getTranslation(
								'TASKS_PAGE.SELECT'
							),
							list: (this.teams || []).map((team) => {
								if (team) {
									return {
										title: team.name,
										value: team.name
									};
								}
							})
						}
					},
					renderComponent: AssignedToComponent
				}
			};
		} else {
			return {};
		}
	}

	async createTaskDialog() {
		let dialog;
		if (this.isTasksPage()) {
			dialog = this.dialogService.open(AddTaskDialogComponent, {
				context: {}
			});
		} else if (this.isMyTasksPage()) {
			dialog = this.dialogService.open(MyTaskDialogComponent, {
				context: {}
			});
		} else if (this.isTeamTaskPage()) {
			dialog = this.dialogService.open(TeamTaskDialogComponent, {
				context: {}
			});
		}
		if (dialog) {
			const data = await dialog.onClose.pipe(first()).toPromise();

			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;

				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { id: organizationId, tenantId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});

				this.storeInstance.createTask(payload);
				this.clearItem();
			}
		}
	}

	async editTaskDialog(selectedItem?: ITask) {
		if (selectedItem) {
			this.selectTask({
				isSelected: true,
				data: selectedItem
			});
		}
		let dialog;
		if (this.isTasksPage()) {
			dialog = this.dialogService.open(AddTaskDialogComponent, {
				context: {
					selectedTask: this.selectedTask
				}
			});
		} else if (this.isMyTasksPage()) {
			dialog = this.dialogService.open(MyTaskDialogComponent, {
				context: {
					selectedTask: this.selectedTask
				}
			});
		} else if (this.isTeamTaskPage()) {
			dialog = this.dialogService.open(TeamTaskDialogComponent, {
				context: {
					selectedTask: this.selectedTask
				}
			});
		}
		if (dialog) {
			const data = await dialog.onClose.pipe(first()).toPromise();

			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;

				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { id: organizationId, tenantId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});

				this.storeInstance.editTask({
					...payload,
					id: this.selectedTask.id
				});
				this.clearItem();
			}
		}
	}

	async duplicateTaskDialog(selectedItem?: ITask) {
		if (selectedItem) {
			this.selectTask({
				isSelected: true,
				data: selectedItem
			});
		}
		let dialog;
		if (this.isTasksPage()) {
			dialog = this.dialogService.open(AddTaskDialogComponent, {
				context: {
					task: this.selectedTask
				}
			});
		} else if (this.isMyTasksPage()) {
			const selectedTask: ITask = Object.assign({}, this.selectedTask);
			// while duplicate my task, default selected employee should be logged in employee
			selectedTask.members = null;
			dialog = this.dialogService.open(MyTaskDialogComponent, {
				context: {
					task: selectedTask
				}
			});
		} else if (this.isTeamTaskPage()) {
			dialog = this.dialogService.open(TeamTaskDialogComponent, {
				context: {
					task: this.selectedTask
				}
			});
		}
		if (dialog) {
			const data = await dialog.onClose.pipe(first()).toPromise();

			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;

				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { id: organizationId, tenantId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});

				this.storeInstance.createTask(payload);
				this.clearItem();
			}
		}
	}

	async deleteTask(selectedItem?: ITask) {
		if (selectedItem) {
			this.selectTask({
				isSelected: true,
				data: selectedItem
			});
		}
		const result = await this.dialogService
			.open(DeleteConfirmationComponent)
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			this.storeInstance.delete(this.selectedTask.id);
			this.clearItem();
		}
	}

	selectTask({ isSelected, data }) {
		this.disableButton = !isSelected;
		this.selectedTask = isSelected ? data : null;
	}

	async loadTeams(employeeId?: string) {
		if (!this.organization) {
			return;
		}
		const { tenantId } = this._store.user;
		const { id: organizationId } = this.organization;
		this.teams = (
			await this.organizationTeamsService.getMyTeams(
				['members'],
				{ organizationId, tenantId },
				employeeId
			)
		).items;
		this._loadTableSettings();
	}

	isTasksPage() {
		return this.view === 'tasks';
	}

	isMyTasksPage() {
		return this.view === 'my-tasks';
	}

	isTeamTaskPage() {
		return this.view === 'team-tasks';
	}

	openTasksSettings(selectedProject: IOrganizationProject): void {
		if (selectedProject.id == this.defaultProject.id) {
			return;
		}

		this.router.navigate(['/pages/tasks/settings', selectedProject.id], {
			state: selectedProject
		});
	}

	/**
	 * return store instace as per page
	 */
	get storeInstance() {
		if (this.isTasksPage()) {
			return this._taskStore;
		} else if (this.isMyTasksPage()) {
			return this._myTaskStore;
		} else if (this.isTeamTaskPage()) {
			return this._teamTaskStore;
		}
	}

	/*
	 * Clear selected item
	 */
	clearItem() {
		this.selectTask({
			isSelected: false,
			data: null
		});
		this.deselectAll();
	}

	/*
	 * Deselect all table rows
	 */
	deselectAll() {
		if (this.tasksTable && this.tasksTable.grid) {
			this.tasksTable.grid.dataSet['willSelect'] = 'false';
			this.tasksTable.grid.dataSet.deselectAll();
		}
	}

	ngOnDestroy(): void {}
}
