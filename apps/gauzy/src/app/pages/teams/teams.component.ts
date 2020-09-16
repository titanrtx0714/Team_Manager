import { Component, OnInit, ViewChild } from '@angular/core';
import {
	IEmployee,
	IOrganization,
	IOrganizationTeamCreateInput,
	IOrganizationTeam,
	ITag,
	RolesEnum,
	ComponentLayoutStyleEnum
} from '@gauzy/models';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '../../@core/services/store.service';
import { EmployeesService } from '../../@core/services';
import { OrganizationTeamsService } from '../../@core/services/organization-teams.service';
import { TranslationBaseComponent } from '../../@shared/language-base/translation-base.component';
import { DeleteConfirmationComponent } from '../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { ComponentEnum } from '../../@core/constants/layout.constants';
import { LocalDataSource } from 'ng2-smart-table';
import { NotesWithTagsComponent } from '../../@shared/table-components/notes-with-tags/notes-with-tags.component';
import { EmployeeWithLinksComponent } from '../../@shared/table-components/employee-with-links/employee-with-links.component';
@Component({
	selector: 'ga-teams',
	templateUrl: './teams.component.html',
	styleUrls: ['./teams.component.scss']
})
export class TeamsComponent extends TranslationBaseComponent implements OnInit {
	private _ngDestroy$ = new Subject<void>();
	selectedOrg: IOrganization;
	@ViewChild('teamTable') teamTable;
	organizationId: string;
	showAddCard: boolean;
	disableButton = true;
	selectedTeam: any;
	showTable: boolean;
	teams: IOrganizationTeam[];
	employees: IEmployee[] = [];
	isGridEdit: boolean;
	teamToEdit: IOrganizationTeam;
	loading = true;
	tags: ITag[] = [];
	viewComponentName: ComponentEnum;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	settingsSmartTable: object;
	smartTableSource = new LocalDataSource();
	constructor(
		private readonly organizationTeamsService: OrganizationTeamsService,
		private employeesService: EmployeesService,
		private readonly toastrService: NbToastrService,
		private dialogService: NbDialogService,
		private readonly store: Store,
		readonly translateService: TranslateService,
		private route: ActivatedRoute,
		private router: Router
	) {
		super(translateService);
		this.setView();
	}

	async ngOnInit() {
		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((organization) => {
				if (organization) {
					this.organizationId = organization.id;
					this.loadTeams();
					this.loadEmployees();
					this.loadSmartTable();
					this._applyTranslationOnSmartTable();
				}
			});
		this.route.queryParamMap
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((params) => {
				if (params.get('openAddDialog')) {
					this.showAddCard = !this.showAddCard;
					this.loadTeams();
				}
			});
	}
	setView() {
		this.viewComponentName = ComponentEnum.TEAMS;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((componentLayout) => {
				this.dataLayoutStyle = componentLayout;
				this.selectedTeam =
					this.dataLayoutStyle === 'CARDS_GRID'
						? null
						: this.selectedTeam;
			});
	}
	async addOrEditTeam(team: IOrganizationTeamCreateInput) {
		if (team.name && team.name.trim().length && team.members.length) {
			if (this.teamToEdit) {
				try {
					await this.organizationTeamsService.update(
						this.teamToEdit.id,
						team
					);

					this.toastrService.primary(
						this.getTranslation(
							'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_TEAM.EDIT_EXISTING_TEAM',
							{
								name: team.name
							}
						),
						this.getTranslation('TOASTR.TITLE.SUCCESS')
					);

					this.loadTeams();
				} catch (error) {
					console.error(error);
				}

				this.showAddCard = false;
			} else {
				try {
					await this.organizationTeamsService.create(team);

					this.toastrService.primary(
						this.getTranslation(
							'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_TEAM.ADD_NEW_TEAM',
							{
								name: team.name
							}
						),
						this.getTranslation('TOASTR.TITLE.SUCCESS')
					);

					this.loadTeams();
				} catch (error) {
					console.error(error);
				}
			}
		} else {
			// TODO translate
			this.toastrService.danger(
				this.getTranslation(
					'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_TEAM.INVALID_TEAM_NAME'
				),
				this.getTranslation(
					'TOASTR.MESSAGE.NEW_ORGANIZATION_TEAM_INVALID_NAME'
				)
			);
		}

		this.showAddCard = false;
		this.teamToEdit = null;
	}

	async removeTeam(id?: string, name?: string) {
		const result = await this.dialogService
			.open(DeleteConfirmationComponent, {
				context: {
					recordType: 'Team'
				}
			})
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			try {
				await this.organizationTeamsService.delete(
					this.selectedTeam ? this.selectedTeam.id : id
				);

				this.toastrService.primary(
					this.getTranslation(
						'NOTES.ORGANIZATIONS.EDIT_ORGANIZATIONS_TEAM.REMOVE_TEAM',
						{
							name: this.selectedTeam
								? this.selectedTeam.team_name
								: name
						}
					),
					this.getTranslation('TOASTR.TITLE.SUCCESS')
				);

				this.loadTeams();
			} catch (error) {
				console.error(error);
			}
		}
	}

	editTeam(team: IOrganizationTeam) {
		this.showAddCard = !this.showAddCard;
		this.teamToEdit = team ? team : this.selectedTeam;
		this.isGridEdit = team ? false : true;
		this.showAddCard = true;
		// TODO: Scroll the page to the top!
	}

	cancel() {
		this.showAddCard = !this.showAddCard;
		this.teamToEdit = null;
	}

	private async loadEmployees() {
		if (!this.organizationId) {
			return;
		}

		const { items } = await this.employeesService
			.getAll(['user', 'tags'], {
				organization: { id: this.organizationId }
			})
			.pipe(first())
			.toPromise();
		this.employees = items;
	}
	public getTagsByEmployeeId(id: string) {
		const employee = this.employees.find((empl) => empl.id === id);

		return employee ? employee.tags : [];
	}

	openEmployees(id) {
		this.router.navigate([`/pages/employees/edit/${id}`]);
	}

	async loadTeams() {
		if (!this.organizationId) {
			return;
		}
		const { items: teams } = await this.organizationTeamsService.getAll(
			['members', 'tags', 'members.role'],
			{
				organizationId: this.organizationId
			}
		);
		if (teams) {
			const result = [];
			teams.forEach((team: IOrganizationTeam) => {
				team.managers = team.members.filter(
					(member) =>
						member.role && member.role.name === RolesEnum.MANAGER
				);
				team.members = team.members.filter((member) => !member.role);
			});

			this.teams = [...teams].sort(
				(a, b) => b.members.length - a.members.length
			);

			this.teams.forEach((team) =>
				result.push({
					id: team.id,
					team_name: team.name,
					members: team.members.map((item) => item.employee),
					managers: team.managers.map((item) => item.employee),
					tags: team.tags
				})
			);
			this.smartTableSource.load(result);
		}
		this.loading = false;
	}

	selectTeam({ isSelected, data }) {
		const selectedTeam = isSelected ? data : null;
		if (this.teamTable) {
			this.teamTable.grid.dataSet.willSelect = false;
		}
		this.disableButton = !isSelected;
		this.selectedTeam = selectedTeam;
	}
	async loadSmartTable() {
		this.settingsSmartTable = {
			actions: false,
			columns: {
				team_name: {
					title: this.getTranslation('ORGANIZATIONS_PAGE.NAME'),
					type: 'string'
				},
				members: {
					title: this.getTranslation(
						'ORGANIZATIONS_PAGE.EDIT.TEAMS_PAGE.MEMBERS'
					),
					type: 'custom',
					renderComponent: EmployeeWithLinksComponent,
					filter: false
				},
				managers: {
					title: this.getTranslation(
						'ORGANIZATIONS_PAGE.EDIT.TEAMS_PAGE.MANAGERS'
					),
					type: 'custom',
					renderComponent: EmployeeWithLinksComponent,
					filter: false
				},
				notes: {
					title: this.getTranslation('MENU.TAGS'),
					type: 'custom',
					class: 'align-row',
					renderComponent: NotesWithTagsComponent
				}
			}
		};
	}
	_applyTranslationOnSmartTable() {
		this.translateService.onLangChange.subscribe(() => {
			this.loadSmartTable();
		});
	}
}
