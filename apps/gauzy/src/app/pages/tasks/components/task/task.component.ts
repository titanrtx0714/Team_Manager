import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { combineLatest, firstValueFrom, Observable, Subject } from 'rxjs';
import { first, tap, filter, debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
import {
	ITask,
	IOrganizationProject,
	ComponentLayoutStyleEnum,
	TaskListTypeEnum,
	IOrganization,
	ISelectedEmployee
} from '@gauzy/contracts';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChange } from '@gauzy/common-angular';
import { DeleteConfirmationComponent } from '../../../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { MyTaskDialogComponent } from './../my-task-dialog/my-task-dialog.component';
import { TeamTaskDialogComponent } from '../team-task-dialog/team-task-dialog.component';
import { AddTaskDialogComponent } from '../../../../@shared/tasks/add-task-dialog/add-task-dialog.component';
import { API_PREFIX, ComponentEnum } from '../../../../@core/constants';
import {
	ErrorHandlingService,
	MyTasksStoreService,
	Store,
	TasksStoreService,
	TeamTasksStoreService
} from './../../../../@core/services';
import {
	AssignedToComponent,
	DateViewComponent,
	NotesWithTagsComponent,
	StatusViewComponent
} from './../../../../@shared/table-components';
import { ALL_PROJECT_SELECTED } from './../../../../@shared/project-select/project/default-project';
import { ServerDataSource } from './../../../../@core/utils/smart-table/server.data-source';
import {
	OrganizationTeamFilterComponent,
	TaskStatusFilterComponent
} from './../../../../@shared/table-filters';
import { PaginationFilterBaseComponent } from './../../../../@shared/pagination/pagination-filter-base.component';
import { InputFilterComponent } from './../../../../@shared/table-filters/input-filter.component';
import { CreateByComponent } from '../../../../@shared/table-components/create-by/create-by.component';
import { ProjectComponent } from 'apps/gauzy/src/app/@shared/table-components/project/project.component';
import { EmployeesMergedTeamsComponent } from '../../../../@shared/table-components/employees-merged-teams/employees-merged-teams.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ngx-tasks',
	templateUrl: './task.component.html',
	styleUrls: ['task.component.scss']
})
export class TaskComponent
	extends PaginationFilterBaseComponent
	implements OnInit, OnDestroy
{
	settingsSmartTable: object;
	loading: boolean;
	smartTableSource: ServerDataSource;
	disableButton: boolean;
	availableTasks$: Observable<ITask[]>;
	tasks$: Observable<ITask[]> = this._taskStore.tasks$;
	myTasks$: Observable<ITask[]> = this._myTaskStore.myTasks$;
	teamTasks$: Observable<ITask[]> = this._teamTaskStore.tasks$;
	selectedTask: ITask;
	viewComponentName: ComponentEnum;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	componentLayoutStyleEnum = ComponentLayoutStyleEnum;
	organization: IOrganization;
	viewMode: TaskListTypeEnum = TaskListTypeEnum.GRID;
	taskListTypeEnum = TaskListTypeEnum;
	defaultProject = ALL_PROJECT_SELECTED;
	subject$: Subject<any> = new Subject();
	selectedEmployee: ISelectedEmployee;
	selectedProject: IOrganizationProject;

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
		private readonly httpClient: HttpClient,
		private readonly _errorHandlingService: ErrorHandlingService
	) {
		super(translateService);
		this.setView();
	}

	ngOnInit() {
		this._loadTableSettings();
		this._applyTranslationOnSmartTable();
		this.subject$
			.pipe(
				debounceTime(400),
				tap(() => (this.loading = true)),
				tap(() => this.clearItem()),
				tap(() => this.getTasks()),
				untilDestroyed(this)
			)
			.subscribe();
		this.pagination$
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				tap(() => this.subject$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
		const storeOrganization$ = this._store.selectedOrganization$;
		const storeEmployee$ = this._store.selectedEmployee$;
		const storeProject$ = this._store.selectedProject$;
		combineLatest([storeOrganization$, storeEmployee$, storeProject$])
			.pipe(
				debounceTime(300),
				filter(
					([organization, employee]) => !!organization && !!employee
				),
				distinctUntilChange(),
				tap(([organization, employee, project]) => {
					this.organization = organization;
					this.selectedEmployee = employee;
					this.selectedProject = project;
					this.viewMode = !!project
						? (project.taskListType as TaskListTypeEnum)
						: TaskListTypeEnum.GRID;
				}),
				tap(() => this.refreshPagination()),
				tap(() => this.subject$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
		this.route.queryParamMap
			.pipe(
				filter(
					(params) =>
						!!params && params.get('openAddDialog') === 'true'
				),
				debounceTime(1000),
				tap(() => this.createTaskDialog()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	private initTasks(): void {
		const pathName = window.location.href;
		if (pathName.indexOf('tasks/me') !== -1) {
			this.viewComponentName = ComponentEnum.MY_TASKS;
			this.availableTasks$ = this.myTasks$;
			return;
		}
		if (pathName.indexOf('tasks/team') !== -1) {
			this.viewComponentName = ComponentEnum.TEAM_TASKS;
			this.availableTasks$ = this.teamTasks$;
			return;
		}
		this.viewComponentName = ComponentEnum.ALL_TASKS;
		this.availableTasks$ = this.tasks$;
	}

	setView() {
		this.initTasks();
		this._store
			.componentLayout$(this.viewComponentName)
			.pipe(
				distinctUntilChange(),
				tap(
					(componentLayout) =>
						(this.dataLayoutStyle = componentLayout)
				),
				filter(
					(componentLayout) =>
						componentLayout === ComponentLayoutStyleEnum.CARDS_GRID
				),
				tap(() => this.refreshPagination()),
				tap(() => this.subject$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
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
			.pipe(
				tap(() => this._loadTableSettings()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/*
	 * Register Smart Table Source Config
	 */
	setSmartTableSource() {
		const { tenantId } = this._store.user;
		const { id: organizationId } = this.organization;

		const request = {};
		if (this.selectedProject && this.selectedProject.id) {
			request['projectId'] = this.selectedProject.id;
			if (this.viewMode === TaskListTypeEnum.SPRINT) {
				request['organizationSprintId'] = null;
			}
		}

		const relations = [];
		let join: any = {};
		let endPoint: string;

		if (this.viewComponentName == ComponentEnum.ALL_TASKS) {
			endPoint = `${API_PREFIX}/tasks/pagination`;
			relations.push(
				...[
					'project',
					'tags',
					'teams',
					'teams.members',
					'teams.members.employee',
					'teams.members.employee.user',
					'creator',
					'organizationSprint'
				]
			);
			join = {
				alias: 'task',
				leftJoinAndSelect: {
					members: 'task.members',
					user: 'members.user'
				}
			};
		}
		if (this.viewComponentName == ComponentEnum.TEAM_TASKS) {
			if (this.selectedEmployee && this.selectedEmployee.id) {
				request['employeeId'] = this.selectedEmployee.id;
			}
			endPoint = `${API_PREFIX}/tasks/team`;
		}
		if (this.viewComponentName == ComponentEnum.MY_TASKS) {
			if (this.selectedEmployee && this.selectedEmployee.id) {
				request['employeeId'] = this.selectedEmployee.id;
			}
			endPoint = `${API_PREFIX}/tasks/me`;
		}

		this.smartTableSource = new ServerDataSource(this.httpClient, {
			endPoint,
			relations,
			join,
			where: {
				...{ organizationId, tenantId },
				...request,
				...this.filters.where
			},
			resultMap: (task: ITask) => {
				return Object.assign({}, task, {
					projectName: task.project ? task.project : undefined,
					employees: task.members ? task.members : undefined,
					assignTo: this._teamTaskStore._getTeamNames(task),
					creator: task.creator ? task.creator : undefined,
					employeesMergedTeams: [task.members, task.teams]
				});
			},
			finalize: () => {
				const tasks = this.smartTableSource.getData();
				this.storeInstance.loadAllTasks(tasks);
				this.loading = false;
			}
		});
	}

	async getTasks() {
		try {
			this.setSmartTableSource();
			const { activePage, itemsPerPage } = this.pagination;
			this.smartTableSource.setPaging(activePage, itemsPerPage, false);
			await this.smartTableSource.getElements();
			const tasks = this.smartTableSource.getData();
			if (
				this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID ||
				this.viewMode === TaskListTypeEnum.SPRINT
			) {
				// Initiate GRID view pagination
				this.storeInstance.loadAllTasks(tasks);
				this.loading = false;
			}
			this.setPagination({
				...this.getPagination(),
				totalItems: this.smartTableSource.count()
			});
		} catch (error) {
			this._errorHandlingService.handleError(error);
		}
	}

	private _loadTableSettings() {
		this.settingsSmartTable = {
			actions: false,
			pager: {
				display: false
			},
			columns: {
				id: {
					title: 'ID',
					type: 'string',
					width: '5%'
				},
				description: {
					title: this.getTranslation('TASKS_PAGE.TASKS_TITLE'),
					type: 'custom',
					class: 'align-row',
					renderComponent: NotesWithTagsComponent,
					filter: {
						type: 'custom',
						component: InputFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'title', search: value });
					}
				},
				projectName: {
					title: this.getTranslation('TASKS_PAGE.TASKS_PROJECT'),
					type: 'custom',
					renderComponent: ProjectComponent,
					filter: {
						type: 'custom',
						component: InputFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'projectName', search: value });
					}
				},
				createdAt: {
					title: this.getTranslation('SM_TABLE.CREATED_AT'),
					type: 'custom',
					filter: {
						type: 'custom',
						component: InputFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'createdAt', search: value });
					},
					renderComponent: DateViewComponent
				},
				creator: {
					title: this.getTranslation('TASKS_PAGE.TASKS_CREATOR'),
					type: 'custom',
					renderComponent: CreateByComponent,
					filter: {
						type: 'custom',
						component: InputFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'creator', search: value });
					}
				},
				...this.getColumnsByPage(),
				dueDate: {
					title: this.getTranslation('TASKS_PAGE.DUE_DATE'),
					type: 'custom',
					filter: {
						type: 'custom',
						component: InputFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'dueDate', search: value });
					},
					renderComponent: DateViewComponent
				},
				status: {
					title: this.getTranslation('TASKS_PAGE.TASKS_STATUS'),
					type: 'custom',
					width: '5%',
					renderComponent: StatusViewComponent,
					filter: {
						type: 'custom',
						component: TaskStatusFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({ field: 'status', search: value });
					}
				}
			}
		};
	}

	private getColumnsByPage() {
		if (this.isTasksPage()) {
			return {
				employeesMergedTeams: {
					title:
						this.getTranslation('TASKS_PAGE.TASK_MEMBERS') +
						'/' +
						this.getTranslation('TASKS_PAGE.TASK_TEAMS'),
					type: 'custom',
					filter: true,
					renderComponent: EmployeesMergedTeamsComponent
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
					width: '12%',
					renderComponent: AssignedToComponent,
					filter: {
						type: 'custom',
						component: OrganizationTeamFilterComponent
					},
					filterFunction: (value) => {
						this.setFilter({
							field: 'members',
							search: value ? [value.id] : []
						});
					}
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
			const data: any = await firstValueFrom(
				dialog.onClose.pipe(first())
			);
			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;
				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { tenantId } = this._store.user;
				const { id: organizationId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});
				this.storeInstance
					.createTask(payload)
					.pipe(
						tap(() => this.subject$.next(true)),
						untilDestroyed(this)
					)
					.subscribe();
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
			const data: any = await firstValueFrom(
				dialog.onClose.pipe(first())
			);

			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;

				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { tenantId } = this._store.user;
				const { id: organizationId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});

				this.storeInstance
					.editTask({ ...payload, id: this.selectedTask.id })
					.pipe(
						tap(() => this.subject$.next(true)),
						untilDestroyed(this)
					)
					.subscribe();
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
					selectedTask: this.selectedTask
				}
			});
		} else if (this.isMyTasksPage()) {
			const selectedTask: ITask = Object.assign({}, this.selectedTask);
			// while duplicate my task, default selected employee should be logged in employee
			selectedTask.members = null;
			dialog = this.dialogService.open(MyTaskDialogComponent, {
				context: {
					selectedTask: selectedTask
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
			const data: any = await firstValueFrom(
				dialog.onClose.pipe(first())
			);

			if (data) {
				const { estimateDays, estimateHours, estimateMinutes } = data;
				const estimate =
					estimateDays * 24 * 60 * 60 +
					estimateHours * 60 * 60 +
					estimateMinutes * 60;

				estimate ? (data.estimate = estimate) : (data.estimate = null);

				const { tenantId } = this._store.user;
				const { id: organizationId } = this.organization;
				const payload = Object.assign(data, {
					organizationId,
					tenantId
				});
				this.storeInstance
					.createTask(payload)
					.pipe(
						tap(() => this.subject$.next(true)),
						untilDestroyed(this)
					)
					.subscribe();
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
		const result = await firstValueFrom(
			this.dialogService
				.open(DeleteConfirmationComponent)
				.onClose.pipe(first())
		);
		if (result) {
			this.storeInstance
				.delete(this.selectedTask.id)
				.pipe(
					tap(() => this.subject$.next(true)),
					untilDestroyed(this)
				)
				.subscribe();
		}
	}

	selectTask({ isSelected, data }) {
		this.disableButton = !isSelected;
		this.selectedTask = isSelected ? data : null;
	}

	isTasksPage() {
		return this.viewComponentName === ComponentEnum.ALL_TASKS;
	}

	isMyTasksPage() {
		return this.viewComponentName === ComponentEnum.MY_TASKS;
	}

	isTeamTaskPage() {
		return this.viewComponentName === ComponentEnum.TEAM_TASKS;
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
	 * return store instance as per page
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
