import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { filter, tap } from 'rxjs/operators';
import { combineLatest, debounceTime, firstValueFrom, Subject } from 'rxjs';
import { Angular2SmartTableComponent } from 'angular2-smart-table';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
	IOrganization,
	PermissionsEnum,
	ComponentLayoutStyleEnum,
	CrudActionEnum,
	IEmployee,
	ITag,
	IOrganizationProject
} from '@gauzy/contracts';
import { distinctUntilChange } from '@gauzy/common-angular';
import {
	ErrorHandlingService,
	OrganizationProjectsService,
	OrganizationProjectStore,
	Store,
	ToastrService
} from '../../../../@core/services';
import { API_PREFIX, ComponentEnum } from '../../../../@core/constants';
import {
	ContactLinksComponent,
	DateViewComponent,
	EmployeesMergedTeamsComponent,
	ProjectOrganizationComponent,
	ProjectOrganizationEmployeesComponent,
	ProjectOrganizationGridDetailsComponent,
	TagsOnlyComponent
} from '../../../../@shared/table-components';
import { DeleteConfirmationComponent } from '../../../../@shared/user/forms';
import { ServerDataSource } from '../../../../@core/utils/smart-table';
import { PaginationFilterBaseComponent } from '../../../../@shared/pagination/pagination-filter-base.component';
import { VisibilityComponent } from '../../../../@shared/table-components/visibility/visibility.component';
import { ProjectOrganizationGridComponent } from '../../../../@shared/table-components';
import { TagsColorFilterComponent } from '../../../../@shared/table-filters';
import { CardGridComponent } from '../../../../@shared/card-grid/card-grid.component';

@UntilDestroy({ checkProperties: true })
@Component({
	selector: 'ga-project-list',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.scss']
})
export class ProjectListComponent extends PaginationFilterBaseComponent implements OnInit {

	public loading: boolean = false;
	public disableButton: boolean = true;
	public settingsSmartTable: any;
	public viewComponentName: ComponentEnum;
	public dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	public componentLayoutStyleEnum = ComponentLayoutStyleEnum;
	public selectedEmployeeId: IEmployee['id'] | null;
	public selectedProject: IOrganizationProject;
	public organization: IOrganization;
	public smartTableSource: ServerDataSource;
	public projects: IOrganizationProject[] = [];
	public project$: Subject<boolean> = this.subject$;
	private _refresh$: Subject<boolean> = new Subject();

	/** */
	projectsTable: Angular2SmartTableComponent;
	@ViewChild('projectsTable') set content(content: Angular2SmartTableComponent) {
		if (content) {
			this.projectsTable = content;
			this.onChangedSource();
		}
	}

	/** */
	private _grid: CardGridComponent;
	@ViewChild('grid') set grid(content: CardGridComponent) {
		if (content) {
			this._grid = content;
		}
	}

	constructor(
		public readonly translateService: TranslateService,
		private readonly _httpClient: HttpClient,
		private readonly _router: Router,
		private readonly _errorHandlingService: ErrorHandlingService,
		private readonly _organizationProjectsService: OrganizationProjectsService,
		private readonly _toastrService: ToastrService,
		private readonly _store: Store,
		private readonly _dialogService: NbDialogService,
		private readonly _organizationProjectStore: OrganizationProjectStore
	) {
		super(translateService);
		this.setView();
	}

	ngOnInit(): void {
		this._loadSmartTableSettings();
		this._applyTranslationOnSmartTable();

		const storeOrganization$ = this._store.selectedOrganization$;
		const storeEmployee$ = this._store.selectedEmployee$;
		combineLatest([storeOrganization$, storeEmployee$])
			.pipe(
				distinctUntilChange(),
				filter(([organization]) => !!organization),
				tap(([organization, employee]) => {
					this.organization = organization;
					this.selectedEmployeeId = employee ? employee.id : null;
				}),
				tap(() => this._refresh$.next(true)),
				tap(() => this.project$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
		this.project$
			.pipe(
				debounceTime(150),
				tap(() => (this.loading = true)),
				tap(() => this.loadProjects()),
				untilDestroyed(this)
			)
			.subscribe();
		this.pagination$
			.pipe(
				debounceTime(100),
				distinctUntilChange(),
				tap(() => this.project$.next(true)),
				untilDestroyed(this)
			)
			.subscribe();
		this._refresh$
			.pipe(
				filter(() => this.dataLayoutStyle === ComponentLayoutStyleEnum.CARDS_GRID),
				tap(() => this.refreshPagination()),
				tap(() => (this.projects = [])),
				untilDestroyed(this)
			)
			.subscribe();
	}

	setView() {
		this.viewComponentName = ComponentEnum.PROJECTS;

		// Subscribe to changes in component layout style
		this._store
			.componentLayout$(this.viewComponentName)
			.pipe(
				tap((componentLayout: ComponentLayoutStyleEnum) => {
					this.dataLayoutStyle = componentLayout;
					this._loadSmartTableSettings();
					this.refreshPagination();
				}),
				debounceTime(300),
				untilDestroyed(this) // Automatically unsubscribe on component destruction
			)
			.subscribe((componentLayout: ComponentLayoutStyleEnum) => {
				// Handle specific actions for the grid layout
				if (componentLayout === this.componentLayoutStyleEnum.CARDS_GRID) {
					this.projects = [];
					this.project$.next(true);
				}
			});
	}

	/**
	 * Remove a project after confirming deletion.
	 * @param selectedItem The project to be removed.
	 */
	async removeProject(selectedItem: IOrganizationProject) {
		if (!selectedItem) {
			return;
		}

		this.selectProject({
			isSelected: true,
			data: selectedItem
		});

		try {
			const result = await firstValueFrom(
				this._dialogService.open(DeleteConfirmationComponent, {
					context: {
						recordType: 'Project'
					}
				}).onClose
			);

			if (result) {
				const { id, name } = this.selectedProject;
				await this._organizationProjectsService.delete(id);

				this._organizationProjectStore.organizationProjectAction = {
					project: this.selectedProject,
					action: CrudActionEnum.DELETED
				};

				this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.REMOVE_PROJECT', {
					name
				});

				this.cancel();
				this._refresh$.next(true);
				this.project$.next(true);
			}
		} catch (error) {
			console.error('Error while removing project', error?.message);
			this._errorHandlingService.handleError(error);
		}
	}

	/**
	 * Cancels the current selection of a project.
	 */
	cancel() {
		this.selectProject({
			isSelected: false,
			data: null
		});
	}

	/**
	 * Registers the Smart Table Source configuration.
	 */
	setSmartTableSource() {
		if (!this.organization) {
			return;
		}

		const { tenantId } = this._store.user;
		const { id: organizationId } = this.organization;

		this.smartTableSource = new ServerDataSource(this._httpClient, {
			endPoint: `${API_PREFIX}/organization-projects/pagination`,
			relations: ['organizationContact', 'organization', 'members', 'members.user', 'tags', 'teams'],
			join: {
				alias: 'organization_project',
				leftJoin: {
					tags: 'organization_project.tags'
				}
			},
			where: {
				organizationId,
				tenantId,
				...(this.selectedEmployeeId
					? {
						members: {
							id: this.selectedEmployeeId
						}
					}
					: {}),
				...(this.filters.where ? this.filters.where : {})
			},
			resultMap: (project: IOrganizationProject) => {
				return Object.assign({}, project, {
					...this.privatePublicProjectMapper(project),
					employeesMergedTeams: [project.members]
				});
			},
			finalize: () => {
				if (this._isGridCardLayout) {
					const projects = this.smartTableSource.getData();
					this.projects.push(...projects);
				}
				this.setPagination({
					...this.getPagination(),
					totalItems: this.smartTableSource.count()
				});
			}
		});
	}

	/**
	 * Checks if the current data layout style is grid card layout.
	 * @returns `true` if the layout is grid card, `false` otherwise.
	 */
	private get _isGridCardLayout(): boolean {
		return this.dataLayoutStyle === this.componentLayoutStyleEnum.CARDS_GRID;
	}

	/**
	 * Loads and initializes the list of organization projects.
	 */
	async loadProjects(): Promise<void> {
		try {
			if (!this.organization) {
				return;
			}

			const { activePage, itemsPerPage } = this.getPagination();

			this.setSmartTableSource();
			this.smartTableSource.setPaging(activePage, itemsPerPage, false);
			await this.loadGridLayoutData();
			this.loading = false;
		} catch (error) {
			console.error('Error loading organization projects:', error);
			this.loading = false;
		}
	}

	/**
	 * Loads grid layout data for organization projects.
	 */
	private async loadGridLayoutData() {
		if (this._isGridCardLayout) {
			await this.smartTableSource.getElements();
		}
	}

	/**
	 * Maps an organization project based on user permissions and project visibility.
	 * @param project The project to be mapped.
	 * @returns The mapped project.
	 */
	private privatePublicProjectMapper(project: IOrganizationProject): IOrganizationProject {
		const hasAccessToPrivateProjects = this._store.hasPermission(PermissionsEnum.ACCESS_PRIVATE_PROJECTS);

		if (hasAccessToPrivateProjects) {
			return project;
		} else {
			return project.public ? project : this.filterProjectMembers(project);
		}
	}

	/**
	 * Filters project members to include only the ones that match the current user's ID.
	 * @param project The project with members.
	 * @returns The project with filtered members.
	 */
	private filterProjectMembers(project: IOrganizationProject): IOrganizationProject {
		project.members = project.members.filter((member: IEmployee) => member.id === this._store.userId);
		return project;
	}

	/**
	 * Load and configure the settings for the Smart Table component.
	 */
	private _loadSmartTableSettings(): void {
		const pagination = this.getPagination();
		this.settingsSmartTable = {
			noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.PROJECT'),
			actions: false,
			pager: {
				display: false,
				perPage: pagination ? this.pagination.itemsPerPage : this.minItemPerPage
			},
			columns: { ...this.columnsSmartTableMapper() }
		};
	}

	/**
	 * Map and configure the columns for the Smart Table component based on the data layout style.
	 * @returns The configured columns for the Smart Table.
	 */
	private columnsSmartTableMapper(): any {
		let columns: any;

		switch (this.dataLayoutStyle) {
			case this.componentLayoutStyleEnum.TABLE:
				columns = {
					project: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.NAME'),
						type: 'custom',
						renderComponent: ProjectOrganizationComponent
					},
					public: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.VISIBILITY'),
						type: 'custom',
						filter: false,
						renderComponent: VisibilityComponent,
						onComponentInitFunction: (instance: any) => {
							instance.visibilityChange.subscribe({
								next: (visibility: boolean) => {
									this.updateProjectVisibility(instance.rowData.id, visibility);
								},
								error: (err: any) => {
									console.warn(err);
								}
							});
						}
					},
					organizationContact: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.CONTACT'),
						type: 'custom',
						class: 'text-center',
						renderComponent: ContactLinksComponent
					},
					startDate: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.START_DATE'),
						type: 'custom',
						filter: false,
						renderComponent: DateViewComponent,
						class: 'text-center'
					},
					endDate: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.END_DATE'),
						type: 'custom',
						filter: false,
						renderComponent: DateViewComponent,
						class: 'text-center'
					},
					employeesMergedTeams: {
						title: this.getTranslation('ORGANIZATIONS_PAGE.EDIT.MEMBERS'),
						type: 'custom',
						renderComponent: EmployeesMergedTeamsComponent
					},
					tags: {
						title: this.getTranslation('SM_TABLE.TAGS'),
						type: 'custom',
						renderComponent: TagsOnlyComponent,
						width: '10%',
						filter: {
							type: 'custom',
							component: TagsColorFilterComponent
						},
						filterFunction: (tags: ITag[]) => {
							const tagIds = [];
							for (const tag of tags) {
								tagIds.push(tag.id);
							}
							this.setFilter({ field: 'tags', search: tagIds });
						},
						sort: false
					}
				};
				break;
			case this.componentLayoutStyleEnum.CARDS_GRID:
				columns = {
					project: {
						title: 'Image',
						type: 'custom',
						renderComponent: ProjectOrganizationGridComponent
					},
					organizationContact: {
						title: 'Image',
						type: 'custom',
						class: 'text-center',
						renderComponent: ProjectOrganizationGridDetailsComponent
					},
					employeesMergedTeams: {
						title: 'Image',
						type: 'custom',
						renderComponent: ProjectOrganizationEmployeesComponent
					}
				};
				break;
			default:
				console.log('Problem with a Layout view');
				break;
		}
		return columns;
	}

	/**
	 * Handles the selection of a project.
	 * @param isSelected Indicates whether the project is selected.
	 * @param data The selected project data.
	 */
	async selectProject({ isSelected, data }): Promise<void> {
		try {
			this.disableButton = !isSelected;
			this.selectedProject = isSelected ? data : null;

			if (this._isGridCardLayout && this._grid) {
				if (this._grid.customComponentInstance().constructor === ProjectOrganizationGridComponent) {
					this.disableButton = true;
					const projectOrganizationGrid: ProjectOrganizationGridComponent = this._grid.customComponentInstance<ProjectOrganizationGridComponent>();
					await this.updateProjectVisibility(data.id, !projectOrganizationGrid.visibility);
				}
			}
		} catch (error) {
			console.error('Error selecting project:', error);
		}
	}

	/**
	 * Apply translation changes to the Smart Table settings.
	 */
	private _applyTranslationOnSmartTable(): void {
		this.translateService.onLangChange
			.pipe(
				tap(() => this._loadSmartTableSettings()),
				untilDestroyed(this)
			)
			.subscribe();
	}

	/**
	 * Update the visibility of a project.
	 * @param projectId The ID of the project to update.
	 * @param visibility The new visibility status (true for public, false for private).
	 */
	private async updateProjectVisibility(projectId: string, visibility: boolean) {
		try {
			await this._organizationProjectsService.edit({
				public: visibility,
				id: projectId,
			});
			const successMessage = visibility ? this.getTranslation('BUTTONS.PRIVATE') : this.getTranslation('BUTTONS.PUBLIC');

			this._toastrService.success('NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_PROJECTS.VISIBILITY', {
				name: successMessage,
			});
		} catch (error) {
			console.error('Error while updating project visibility', error?.message);
			this._errorHandlingService.handleError(error);
		}
	}

	/**
	 * Subscribe to the onChangedSource event of the projects table source.
	 */
	onChangedSource(): void {
		this.projectsTable.source.onChangedSource
			.pipe(
				untilDestroyed(this),
				tap(() => this.clearItem())
			)
			.subscribe();
	}

	/**
	 * Clear the selected item and deselect all table rows.
	 */
	clearItem(): void {
		this.selectProject({
			isSelected: false,
			data: null
		});
		this.deselectAll();
	}

	/**
	 * Deselect all table rows.
	 */
	deselectAll(): void {
		if (this.projectsTable && this.projectsTable.grid) {
			this.projectsTable.grid.dataSet['willSelect'] = 'indexed';
			this.projectsTable.grid.dataSet.deselectAll();
		}
	}

	/**
	 * Navigate to the create project page.
	 */
	navigateToCreateProject(): void {
		this._router.navigate(['/pages/organization/projects', 'create']);
	}

	/**
	 * Navigate to the edit project page for the specified project.
	 * @param project The project to edit.
	 */
	navigateToEditProject(project: IOrganizationProject): void {
		this._router.navigate([`/pages/organization/projects`, project.id, 'edit']);
	}
}
