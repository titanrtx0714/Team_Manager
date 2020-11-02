import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	PermissionsEnum,
	InvitationTypeEnum,
	ComponentLayoutStyleEnum,
	IOrganization,
	ICandidateViewModel
} from '@gauzy/models';
import { TranslateService } from '@ngx-translate/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { first, filter } from 'rxjs/operators';
import { Store } from '../../@core/services/store.service';
import { TranslationBaseComponent } from '../../@shared/language-base/translation-base.component';
import { CandidateStatusComponent } from './table-components/candidate-status/candidate-status.component';
import { CandidatesService } from '../../@core/services/candidates.service';
import { CandidateMutationComponent } from '../../@shared/candidate/candidate-mutation/candidate-mutation.component';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { InviteMutationComponent } from '../../@shared/invite/invite-mutation/invite-mutation.component';
import {
	Router,
	ActivatedRoute,
	RouterEvent,
	NavigationEnd
} from '@angular/router';
import { ErrorHandlingService } from '../../@core/services/error-handling.service';
import { PictureNameTagsComponent } from '../../@shared/table-components/picture-name-tags/picture-name-tags.component';
import { CandidateSourceComponent } from './table-components/candidate-source/candidate-source.component';
import { CandidateSourceService } from '../../@core/services/candidate-source.service';
import { CandidateFeedbacksService } from '../../@core/services/candidate-feedbacks.service';
import { ArchiveConfirmationComponent } from '../../@shared/user/forms/archive-confirmation/archive-confirmation.component';
import { CandidateActionConfirmationComponent } from '../../@shared/user/forms/candidate-action-confirmation/candidate-action-confirmation.component';
import { ComponentEnum } from '../../@core/constants/layout.constants';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy({ checkProperties: true })
@Component({
	templateUrl: './candidates.component.html',
	styleUrls: ['./candidates.component.scss']
})
export class CandidatesComponent
	extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	organizationName: string;
	settingsSmartTable: object;
	sourceSmartTable = new LocalDataSource();
	selectedCandidate: ICandidateViewModel;
	selectedOrganizationId: string;
	private _ngDestroy$ = new Subject<void>();
	candidateName = 'Candidate';
	candidateSource: string;
	candidateRating: number;
	includeArchived = false;
	loading = true;
	hasEditPermission = false;
	hasInviteEditPermission = false;
	hasInviteViewOrEditPermission = false;
	organizationInvitesAllowed = false;
	viewComponentName: ComponentEnum;
	disableButton = true;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;
	candidateData: ICandidateViewModel[];
	selectedOrganization: IOrganization;

	@ViewChild('candidatesTable') candidatesTable;
	constructor(
		private candidatesService: CandidatesService,
		private dialogService: NbDialogService,
		private toastrService: NbToastrService,
		private store: Store,
		private router: Router,
		private route: ActivatedRoute,
		private translate: TranslateService,
		private errorHandler: ErrorHandlingService,
		private candidateSourceService: CandidateSourceService,
		private candidateFeedbacksService: CandidateFeedbacksService
	) {
		super(translate);
		this.setView();
	}

	async ngOnInit() {
		this.store.userRolePermissions$
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.hasEditPermission = this.store.hasPermission(
					PermissionsEnum.ORG_CANDIDATES_EDIT
				);

				this.hasInviteEditPermission = this.store.hasPermission(
					PermissionsEnum.ORG_INVITE_EDIT
				);
				this.hasInviteViewOrEditPermission =
					this.store.hasPermission(PermissionsEnum.ORG_INVITE_VIEW) ||
					this.hasInviteEditPermission;
			});
		this.store.selectedOrganization$
			.pipe(
				filter((organization) => !!organization),
				untilDestroyed(this)
			)
			.subscribe((organization) => {
				if (organization) {
					this.selectedOrganization = organization;
					this.selectedOrganizationId = organization.id;
					this.organizationInvitesAllowed =
						organization.invitesAllowed;
					this.loadPage();
				}
			});
		this.route.queryParamMap
			.pipe(untilDestroyed(this))
			.subscribe((params) => {
				if (params.get('openAddDialog')) {
					this.add();
				}
			});
		this.router.events
			.pipe(untilDestroyed(this))
			.subscribe((event: RouterEvent) => {
				if (event instanceof NavigationEnd) {
					this.setView();
				}
			});

		this._loadSmartTableSettings();
		this._applyTranslationOnSmartTable();
	}
	goTo(page: string) {
		this.router.navigate([`/pages/employees/candidates/${page}`]);
	}
	setView() {
		this.viewComponentName = ComponentEnum.CANDIDATES;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(untilDestroyed(this))
			.subscribe((componentLayout) => {
				this.dataLayoutStyle = componentLayout;
			});
	}

	selectCandidateTmp({ isSelected, data }) {
		const selectedCandidate = isSelected ? data : null;
		if (this.candidatesTable) {
			this.candidatesTable.grid.dataSet.willSelect = false;
		}
		this.disableButton = !isSelected;
		this.selectedCandidate = selectedCandidate;
		if (this.selectedCandidate) {
			const checkName = this.selectedCandidate.fullName.trim();
			this.candidateName = checkName ? checkName : 'Candidate';
		}
	}
	async add() {
		const dialog = this.dialogService.open(CandidateMutationComponent);

		const response = await dialog.onClose.pipe(first()).toPromise();

		if (response) {
			response.map((data) => {
				if (data.user.firstName || data.user.lastName) {
					this.candidateName =
						data.user.firstName + ' ' + data.user.lastName;
				}
				this.toastrService.primary(
					this.candidateName.trim() +
						' added to ' +
						data.organization.name,
					'Success'
				);
			});

			this.loadPage();
		}
	}
	edit(selectedItem?: ICandidateViewModel) {
		if (selectedItem) {
			this.selectCandidateTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.router.navigate([
			'/pages/employees/candidates/edit/' +
				this.selectedCandidate.id +
				'/profile'
		]);
	}
	async archive(selectedItem?: ICandidateViewModel) {
		if (selectedItem) {
			this.selectCandidateTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.dialogService
			.open(ArchiveConfirmationComponent, {
				context: {
					recordType:
						this.selectedCandidate.fullName +
						' ' +
						this.getTranslation(
							'FORM.ARCHIVE_CONFIRMATION.CANDIDATE'
						)
				}
			})
			.onClose.pipe(untilDestroyed(this))
			.subscribe(async (result) => {
				if (result) {
					try {
						await this.candidatesService.setCandidateAsArchived(
							this.selectedCandidate.id
						);

						this.toastrService.primary(
							this.candidateName + '  set as archived.',
							'Success'
						);

						this.loadPage();
					} catch (error) {
						this.errorHandler.handleError(error);
					}
				}
			});
	}
	async invite() {
		const dialog = this.dialogService.open(InviteMutationComponent, {
			context: {
				invitationType: InvitationTypeEnum.CANDIDATE,
				selectedOrganizationId: this.selectedOrganizationId,
				currentUserId: this.store.userId,
				selectedOrganization: this.selectedOrganization
			}
		});
		await dialog.onClose.pipe(first()).toPromise();
	}
	manageInvites() {
		this.router.navigate(['/pages/employees/candidates/invites']);
	}
	manageInterviews() {
		this.router.navigate(['/pages/employees/candidates/interviews']);
	}

	private async loadPage() {
		const { tenantId } = this.store.user;
		this.selectedCandidate = null;
		const { items } = await this.candidatesService
			.getAll(['user', 'source', 'tags', 'feedbacks'], {
				organizationId: this.selectedOrganizationId,
				tenantId
			})
			.pipe(first())
			.toPromise();

		let candidatesVm = [];
		const result = [];
		for (const candidate of items) {
			result.push({
				fullName: `${candidate.user.firstName} ${candidate.user.lastName}`,
				email: candidate.user.email,
				id: candidate.id,
				source: candidate.source,
				rating: candidate.ratings,
				status: candidate.status,
				isArchived: candidate.isArchived,
				imageUrl: candidate.user.imageUrl,
				tags: candidate.tags
			});
		}

		if (!this.includeArchived) {
			result.forEach((candidate) => {
				if (!candidate.isArchived) {
					candidatesVm.push(candidate);
				}
			});
		} else {
			candidatesVm = result;
		}

		this.candidateData = candidatesVm;
		this.sourceSmartTable.load(candidatesVm);
		if (this.candidatesTable) {
			this.candidatesTable.grid.dataSet.willSelect = false;
		}

		const { name } = this.store.selectedOrganization;
		this.organizationName = name;
		this.loading = false;
	}

	private _loadSmartTableSettings() {
		this.settingsSmartTable = {
			actions: false,
			columns: {
				fullName: {
					title: this.getTranslation('SM_TABLE.FULL_NAME'),
					type: 'custom',
					renderComponent: PictureNameTagsComponent,
					class: 'align-row'
				},
				email: {
					title: this.getTranslation('SM_TABLE.EMAIL'),
					type: 'email',
					class: 'email-column'
				},
				source: {
					title: this.getTranslation('SM_TABLE.SOURCE'),
					type: 'custom',
					class: 'text-center',
					width: '200px',
					renderComponent: CandidateSourceComponent,
					filter: false
				},

				status: {
					title: this.getTranslation('SM_TABLE.STATUS'),
					type: 'custom',
					class: 'text-center',
					width: '200px',
					renderComponent: CandidateStatusComponent,
					filter: false
				}
			},
			pager: {
				display: true,
				perPage: 8
			}
		};
	}

	changeIncludeArchived(checked: boolean) {
		this.includeArchived = checked;
		this.loadPage();
	}
	async reject(selectedItem?: ICandidateViewModel) {
		if (selectedItem) {
			this.selectCandidateTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.dialogService
			.open(CandidateActionConfirmationComponent, {
				context: {
					recordType: this.selectedCandidate.fullName,
					isReject: true
				}
			})
			.onClose.pipe(untilDestroyed(this))
			.subscribe(async (result) => {
				if (result) {
					try {
						await this.candidatesService.setCandidateAsRejected(
							this.selectedCandidate.id
						);

						this.toastrService.success(
							this.candidateName + '  set as rejected.',
							'Success'
						);

						this.loadPage();
					} catch (error) {
						this.errorHandler.handleError(error);
					}
				}
			});
	}
	async hire(selectedItem?: ICandidateViewModel) {
		if (selectedItem) {
			this.selectCandidateTmp({
				isSelected: true,
				data: selectedItem
			});
		}
		this.dialogService
			.open(CandidateActionConfirmationComponent, {
				context: {
					recordType: this.selectedCandidate.fullName,
					isReject: false
				}
			})
			.onClose.pipe(untilDestroyed(this))
			.subscribe(async (result) => {
				if (result) {
					try {
						await this.candidatesService.setCandidateAsHired(
							this.selectedCandidate.id
						);

						this.toastrService.success(
							this.candidateName + '  set as hired.',
							'Success'
						);

						this.loadPage();
					} catch (error) {
						this.errorHandler.handleError(error);
					}
				}
			});
	}
	private _applyTranslationOnSmartTable() {
		this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
			this._loadSmartTableSettings();
		});
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
