import
{
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import
{
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import
{
    AccountingTemplateTypeEnum,
    AlignmentOptions,
    BonusTypeEnum,
    CrudActionEnum,
    CurrenciesEnum,
    CurrencyPosition,
    DEFAULT_ACTIVITY_PROOF_DURATIONS,
    DEFAULT_DATE_FORMATS,
    DEFAULT_INACTIVITY_TIME_LIMITS,
    DEFAULT_INVITE_EXPIRY_PERIOD,
    DEFAULT_PROFIT_BASED_BONUS,
    DEFAULT_REVENUE_BASED_BONUS,
    DEFAULT_TIME_FORMATS,
    DEFAULT_TASK_NOTIFY_PERIOD,
    DEFAULT_PROOF_COMPLETION_TYPE,
    DefaultValueDateTypeEnum,
    IAccountingTemplate,
    IKeyValuePair,
    IOrganization,
    RegionsEnum,
    WeekDaysEnum,
    IOrganizationTaskSetting,
    TaskProofOfCompletionTypeEnum,
    DEFAULT_AUTO_CLOSE_ISSUE_PERIOD,
} from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, filter, map, tap } from 'rxjs/operators';
import
{
    NbAccordionComponent,
    NbAccordionItemComponent,
    NbThemeService,
} from '@nebular/theme';
import { isEmpty } from '@gauzy/common-angular';
import
{
    AccountingTemplateService,
    OrganizationEditStore,
    OrganizationsService,
    Store,
    ToastrService,
} from './../../../../../@core/services';
import { NotesWithTagsComponent } from './../../../../../@shared/table-components';
import { OrganizationTaskSettingService } from 'apps/gauzy/src/app/@core/services/organization-task-setting.service';

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'ga-edit-org-other-settings',
    templateUrl: './edit-organization-other-settings.component.html',
    styleUrls: ['./edit-organization-other-settings.component.scss'],
})
export class EditOrganizationOtherSettingsComponent
    extends NotesWithTagsComponent
    implements AfterViewInit, OnInit, OnDestroy
{
    @ViewChild('accordion') set content(content: NbAccordionComponent)
    {
        if (content)
        {
            this.accordion = content;
            this.cdr.detectChanges();
        }
    }

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly fb: FormBuilder,
        private readonly cdr: ChangeDetectorRef,
        private readonly organizationService: OrganizationsService,
        private readonly organizationTaskSettingService: OrganizationTaskSettingService,
        private readonly toastrService: ToastrService,
        private readonly organizationEditStore: OrganizationEditStore,
        public readonly translateService: TranslateService,
        private readonly store: Store,
        private readonly accountingTemplateService: AccountingTemplateService,
        public readonly themeService: NbThemeService
    )
    {
        super(themeService, translateService);
    }

    public get isTrackInactivity(): boolean
    {
        return this.form.get('allowTrackInactivity').value;
    }

    public organization: IOrganization;
    public organizationTaskSetting: IOrganizationTaskSetting;
    defaultOrganizationSelection: IKeyValuePair[] = [
        { key: 'Yes', value: true },
        { key: 'No', value: false },
    ];
    defaultValueDateTypes: string[] = Object.values(DefaultValueDateTypeEnum);
    defaultAlignmentTypes: string[] = Object.values(AlignmentOptions);
    defaultCurrencyPosition: string[] = Object.values(CurrencyPosition);
    defaultBonusTypes: string[] = Object.values(BonusTypeEnum);
    defaultTaskProofOfCompletionTypes: string[] = Object.values(
        TaskProofOfCompletionTypeEnum
    );
    invoiceTemplates: IAccountingTemplate[] = [];
    estimateTemplates: IAccountingTemplate[] = [];
    receiptTemplates: IAccountingTemplate[] = [];
    selectedInvoiceTemplate: IAccountingTemplate;
    selectedEstimateTemplate: IAccountingTemplate;
    selectedReceiptTemplate: IAccountingTemplate;

    listOfDateFormats = DEFAULT_DATE_FORMATS;
    listOfTimeFormats = DEFAULT_TIME_FORMATS;
    listOfInactivityLimits = DEFAULT_INACTIVITY_TIME_LIMITS;
    listOfActivityProofDuration = DEFAULT_ACTIVITY_PROOF_DURATIONS;
    numberFormats = ['USD', 'BGN', 'ILS'];
    numberFormat: string;
    weekdays: WeekDaysEnum[] = Object.values(WeekDaysEnum);
    regionCodes = Object.keys(RegionsEnum);
    regionCode: string;
    regions = Object.values(RegionsEnum);

    /*
     * Organization Mutation Form
     */
    public form: FormGroup = EditOrganizationOtherSettingsComponent.buildForm(
        this.fb
    );

    /*
     * Organization Task Setting
     */
    public taskSettingForm: FormGroup =
        EditOrganizationOtherSettingsComponent.buildTaskSettingForm(this.fb);

    /**
     * Nebular Accordion Main Component
     */
    accordion: NbAccordionComponent;

    /**
     * Nebular Accordion Item Components
     */
    @ViewChild('general') general: NbAccordionItemComponent;
    @ViewChild('design') design: NbAccordionItemComponent;
    @ViewChild('accounting') accounting: NbAccordionItemComponent;
    @ViewChild('bonus') bonus: NbAccordionItemComponent;
    @ViewChild('invites') invites: NbAccordionItemComponent;
    @ViewChild('dateLimit') dateLimit: NbAccordionItemComponent;
    @ViewChild('timer') timer: NbAccordionItemComponent;
    @ViewChild('integrations') integrations: NbAccordionItemComponent;
    @ViewChild('taskSetting') taskSetting: NbAccordionItemComponent;

    static buildForm(fb: FormBuilder): FormGroup
    {
        return fb.group({
            name: [],
            currency: [],
            defaultValueDateType: [null, Validators.required],
            regionCode: [],
            defaultAlignmentType: [],
            brandColor: [],
            dateFormat: [],
            timeZone: [],
            startWeekOn: [],
            defaultStartTime: [],
            defaultEndTime: [],
            numberFormat: [],
            bonusType: [],
            bonusPercentage: [],
            invitesAllowed: [false],
            inviteExpiryPeriod: [],
            fiscalStartDate: [
                formatDate(
                    new Date(`01/01/${new Date().getFullYear()}`),
                    'yyyy-MM-dd',
                    'en'
                ),
            ],
            fiscalEndDate: [
                formatDate(
                    new Date(`12/31/${new Date().getFullYear()}`),
                    'yyyy-MM-dd',
                    'en'
                ),
            ],
            futureDateAllowed: [false],
            allowManualTime: [],
            allowModifyTime: [],
            allowDeleteTime: [],
            allowTrackInactivity: [],
            inactivityTimeLimit: [1],
            activityProofDuration: [1],
            requireReason: [],
            requireDescription: [],
            requireProject: [],
            requireTask: [],
            requireClient: [],
            timeFormat: [12],
            separateInvoiceItemTaxAndDiscount: [],
            defaultInvoiceEstimateTerms: [],
            fiscalInformation: [],
            currencyPosition: [CurrencyPosition.LEFT],
            discountAfterTax: [],
            convertAcceptedEstimates: [false],
            daysUntilDue: [],
            invoiceTemplate: [],
            estimateTemplate: [],
            receiptTemplate: [],
            isDefault: [],
            isRemoveIdleTime: [false],
            allowScreenshotCapture: [true],
            upworkOrganizationId: [null],
        });
    }

    static buildTaskSettingForm(fb: FormBuilder): FormGroup
    {
        return fb.group({
            isTasksPrivacyEnabled: [],
            isTasksMultipleAssigneesEnabled: [],
            isTasksManualTimeEnabled: [],
            isTasksGroupEstimationEnabled: [],
            isTasksEstimationInHoursEnabled: [],
            isTasksEstimationInStoryPointsEnabled: [],
            isTasksProofOfCompletionEnabled: [],
            tasksProofOfCompletionType: [], // Enum
            isTasksLinkedEnabled: [],
            isTasksCommentsEnabled: [],
            isTasksHistoryEnabled: [],
            isTasksAcceptanceCriteriaEnabled: [],
            isTasksDraftsEnabled: [],
            isTasksNotifyLeftEnabled: [],
            tasksNotifyLeftPeriodDays: [],
            isTasksAutoCloseEnabled: [],
            tasksAutoClosePeriodDays: [],
            isTasksAutoArchiveEnabled: [],
            tasksAutoArchivePeriodDays: [],
            isTasksAutoStatusEnabled: [],
        });
    }

    ngOnInit(): void
    {
        this.route.parent.data
            .pipe(
                debounceTime(100),
                filter((data) => { return !!data && (!!data.organization || !!data.organizationTaskSetting) }),
                map(({ organization, organizationTaskSetting }) => { return { organization, organizationTaskSetting } }),
                tap(
                    (data: { organization: IOrganization, organizationTaskSetting: IOrganizationTaskSetting }) =>
                    {

                        (this.organization = data.organization);
                        this.organizationTaskSetting = data.organizationTaskSetting
                    }
                ),
                tap(
                    (data: { organization: IOrganization, organizationTaskSetting: IOrganizationTaskSetting }) =>
                        (this.regionCode = data.organization.regionCode)
                ),
                tap(() => this._setFormValues()),
                tap(() => this._getTemplates()),
                untilDestroyed(this)
            )
            .subscribe();
    }

    ngAfterViewInit(): void
    {
        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const regionCode = <FormControl>this.form.get('regionCode');
        regionCode.valueChanges
            .pipe(
                tap(
                    (value: IOrganization['regionCode']) =>
                        (this.regionCode = value)
                ),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const bonusTypeControl = <FormControl>this.form.get('bonusType');
        bonusTypeControl.valueChanges
            .pipe(
                tap((bonusType: IOrganization['bonusType']) =>
                {
                    this.onChangedBonusPercentage(bonusType as BonusTypeEnum);
                }),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const invitesAllowedControl = <FormControl>(
            this.form.get('invitesAllowed')
        );
        invitesAllowedControl.valueChanges
            .pipe(
                tap((invitesAllowed: IOrganization['invitesAllowed']) =>
                {
                    this.toggleInviteExpiryPeriod(invitesAllowed);
                }),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const isTasksProofOfCompletionEnabledControl = <FormControl>(
            this.taskSettingForm.get('isTasksProofOfCompletionEnabled')
        );
        isTasksProofOfCompletionEnabledControl.valueChanges
            .pipe(
                tap(
                    (
                        taskProofOfCompletionEnabled: IOrganizationTaskSetting['isTasksProofOfCompletionEnabled']
                    ) =>
                    {
                        this.toggleTasksProofOfCompletionType(
                            taskProofOfCompletionEnabled
                        );
                    }
                ),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const isTasksNotifyLeftEnabledControl = <FormControl>(
            this.taskSettingForm.get('isTasksNotifyLeftEnabled')
        );
        isTasksNotifyLeftEnabledControl.valueChanges
            .pipe(
                tap(
                    (
                        taskNotifyEnabled: IOrganizationTaskSetting['isTasksNotifyLeftEnabled']
                    ) =>
                    {
                        this.toggleTasksNotifyLeftPeriodDays(taskNotifyEnabled);
                    }
                ),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const isTasksAutoCloseEnabledControl = <FormControl>(
            this.taskSettingForm.get('isTasksAutoCloseEnabled')
        );
        isTasksAutoCloseEnabledControl.valueChanges
            .pipe(
                tap(
                    (
                        taskAutoCloseEnabled: IOrganizationTaskSetting['isTasksAutoCloseEnabled']
                    ) =>
                    {
                        this.toggleTasksAutoClosePeriodDays(
                            taskAutoCloseEnabled
                        );
                    }
                ),
                untilDestroyed(this)
            )
            .subscribe();

        /**
         * Emits an event every time the value of the control changes.
         * It also emits an event each time you call enable() or disable()
         */
        const isTasksAutoArchiveEnabledControl = <FormControl>(
            this.taskSettingForm.get('isTasksAutoArchiveEnabled')
        );
        isTasksAutoArchiveEnabledControl.valueChanges
            .pipe(
                tap(
                    (
                        taskAutoArchiveEnabled: IOrganizationTaskSetting['isTasksAutoArchiveEnabled']
                    ) =>
                    {
                        this.toggleTasksAutoArchivePeriodDays(
                            taskAutoArchiveEnabled
                        );
                    }
                ),
                untilDestroyed(this)
            )
            .subscribe();
    }

    dateFormatPreview(format: string)
    {
        if (format)
        {
            return moment()
                .locale(this.regionCode || RegionsEnum.EN)
                .format(format);
        }
    }

    numberFormatPreview(format: string)
    {
        const number = 12345.67;
        let code: string;
        switch (format)
        {
            case CurrenciesEnum.BGN:
                code = 'bg';
                break;
            case CurrenciesEnum.USD:
                code = 'en';
                break;
            case CurrenciesEnum.ILS:
                code = 'he';
                break;
        }
        return number.toLocaleString(`${code}`, {
            style: 'currency',
            currency: `${format}`,
            currencyDisplay: 'symbol',
        });
    }

    async updateOrganizationSettings()
    {
        this.organizationService
            .update(this.organization.id, this.form.value)
            .then((organization: IOrganization) =>
            {
                if (organization)
                {
                    this.organizationEditStore.organizationAction = {
                        organization,
                        action: CrudActionEnum.UPDATED,
                    };
                    this.store.selectedOrganization = organization;
                }
            });

        await this.saveTemplate(this.selectedInvoiceTemplate);
        await this.saveTemplate(this.selectedEstimateTemplate);
        await this.saveTemplate(this.selectedReceiptTemplate);

        this.toastrService.success(
            `TOASTR.MESSAGE.ORGANIZATION_SETTINGS_UPDATED`,
            {
                name: this.organization.name,
            }
        );
        this.goBack();
    }
    async updateOrganizationTaskSetting()
    {
        const editTaskSettingInput: IOrganizationTaskSetting = {
            ...this.taskSettingForm.value,
            organizationId: this.organization.id,
            id: this.organizationTaskSetting.id
        }
        this.organizationTaskSettingService
            .edit(editTaskSettingInput)
            .subscribe({
                next: (orgTaskSetting: IOrganizationTaskSetting) =>
                {
                    if (orgTaskSetting)
                    {
                        this.store.selectedOrganizationTaskSetting = orgTaskSetting;
                    }
                },
                error: () =>
                {
                    this.toastrService.error(
                        `TOASTR.MESSAGE.ORGANIZATION_TASK_SETTINGS_UPDATE_ERROR`
                    );
                }
            })
    }

    goBack()
    {
        this.router.navigate([
            `/pages/organizations/edit/${this.organization.id}`,
        ]);
    }

    onChangedBonusPercentage(bonusType: BonusTypeEnum)
    {
        const bonusPercentageControl = <FormControl>(
            this.form.get('bonusPercentage')
        );
        if (bonusType)
        {
            bonusPercentageControl.setValidators([
                Validators.required,
                Validators.min(0),
                Validators.max(100),
            ]);
            switch (bonusType)
            {
                case BonusTypeEnum.PROFIT_BASED_BONUS:
                    bonusPercentageControl.setValue(
                        this.organization.bonusPercentage ||
                        DEFAULT_PROFIT_BASED_BONUS
                    );
                    bonusPercentageControl.enable();
                    break;
                case BonusTypeEnum.REVENUE_BASED_BONUS:
                    bonusPercentageControl.setValue(
                        this.organization.bonusPercentage ||
                        DEFAULT_REVENUE_BASED_BONUS
                    );
                    bonusPercentageControl.enable();
                    break;
            }
        } else
        {
            bonusPercentageControl.setValidators(null);
            bonusPercentageControl.setValue(null);
            bonusPercentageControl.disable();
        }
        bonusPercentageControl.updateValueAndValidity();
    }

    /**
     * Invite expire toggle switch
     * Enabled/Disabled InviteExpiryPeriod form control
     *
     * @param inviteExpiry
     * @returns
     */
    toggleInviteExpiryPeriod(inviteExpiry: boolean)
    {
        const inviteExpiryPeriodControl = <FormControl>(
            this.form.get('inviteExpiryPeriod')
        );
        const { inviteExpiryPeriod } = this.organization;

        if (inviteExpiry)
        {
            inviteExpiryPeriodControl.enable();
            inviteExpiryPeriodControl.setValidators([
                Validators.required,
                Validators.min(1),
            ]);
        } else
        {
            inviteExpiryPeriodControl.disable();
            inviteExpiryPeriodControl.setValidators(null);
        }
        inviteExpiryPeriodControl.setValue(
            inviteExpiryPeriod || DEFAULT_INVITE_EXPIRY_PERIOD
        );
        inviteExpiryPeriodControl.updateValueAndValidity();
    }

    /**
     * Tasks Proof Of Completion toggle switch
     * Enabled/Disabled tasksProofOfCompletionType form control
     *
     * @param taskProofCompletion
     * @returns
     */
    toggleTasksProofOfCompletionType(taskProofCompletion: boolean)
    {
        const taskProofOfCompletionTypeControl = <FormControl>(
            this.taskSettingForm.get('tasksProofOfCompletionType')
        );
        const { tasksProofOfCompletionType } = this.organizationTaskSetting;

        if (taskProofCompletion)
        {
            taskProofOfCompletionTypeControl.enable();
            taskProofOfCompletionTypeControl.setValidators([
                Validators.required,
            ]);
        } else
        {
            taskProofOfCompletionTypeControl.disable();
            taskProofOfCompletionTypeControl.setValidators(null);
        }
        taskProofOfCompletionTypeControl.setValue(
            tasksProofOfCompletionType || DEFAULT_PROOF_COMPLETION_TYPE
        );
        taskProofOfCompletionTypeControl.updateValueAndValidity();
    }

    /**
     * Task Notify Left Period toggle switch
     * Enabled/Disabled tasksNotifyLeftPeriodDays form control
     *
     * @param taskNotify
     * @returns
     */
    toggleTasksNotifyLeftPeriodDays(taskNotify: boolean)
    {
        const taskNotifyPeriodControl = <FormControl>(
            this.taskSettingForm.get('tasksNotifyLeftPeriodDays')
        );
        const { tasksNotifyLeftPeriodDays } = this.organizationTaskSetting;

        if (taskNotify)
        {
            taskNotifyPeriodControl.enable();
            taskNotifyPeriodControl.setValidators([
                Validators.required,
                Validators.min(1),
            ]);
        } else
        {
            taskNotifyPeriodControl.disable();
            taskNotifyPeriodControl.setValidators(null);
        }
        taskNotifyPeriodControl.setValue(
            tasksNotifyLeftPeriodDays || DEFAULT_TASK_NOTIFY_PERIOD
        );
        taskNotifyPeriodControl.updateValueAndValidity();
    }

    /**
     * Tasks Auto Close toggle switch
     * Enabled/Disabled tasksAutoClosePeriodDays form control
     *
     * @param taskAutoClose
     * @returns
     */
    toggleTasksAutoClosePeriodDays(taskAutoClose: boolean)
    {
        const taskAutoClosePeriodControl = <FormControl>(
            this.taskSettingForm.get('tasksAutoClosePeriodDays')
        );
        const { tasksAutoClosePeriodDays } = this.organizationTaskSetting;

        if (taskAutoClose)
        {
            taskAutoClosePeriodControl.enable();
            taskAutoClosePeriodControl.setValidators([
                Validators.required,
                Validators.min(1),
            ]);
        } else
        {
            taskAutoClosePeriodControl.disable();
            taskAutoClosePeriodControl.setValidators(null);
        }
        taskAutoClosePeriodControl.setValue(
            tasksAutoClosePeriodDays || DEFAULT_AUTO_CLOSE_ISSUE_PERIOD
        );
        taskAutoClosePeriodControl.updateValueAndValidity();
    }

    /**
     * Tasks Auto Archive toggle switch
     * Enabled/Disabled tasksAutoArchivePeriodDays form control
     *
     * @param taskAutoArchive
     * @returns
     */
    toggleTasksAutoArchivePeriodDays(taskAutoArchive: boolean)
    {
        const taskAutoArchivePeriodControl = <FormControl>(
            this.taskSettingForm.get('tasksAutoArchivePeriodDays')
        );
        const { tasksAutoArchivePeriodDays } = this.organizationTaskSetting;

        if (taskAutoArchive)
        {
            taskAutoArchivePeriodControl.enable();
            taskAutoArchivePeriodControl.setValidators([
                Validators.required,
                Validators.min(1),
            ]);
        } else
        {
            taskAutoArchivePeriodControl.disable();
            taskAutoArchivePeriodControl.setValidators(null);
        }
        taskAutoArchivePeriodControl.setValue(
            tasksAutoArchivePeriodDays || DEFAULT_AUTO_CLOSE_ISSUE_PERIOD
        );
        taskAutoArchivePeriodControl.updateValueAndValidity();
    }

    private async _getTemplates()
    {
        if (!this.organization)
        {
            return;
        }
        const { tenantId } = this.store.user;
        const { id: organizationId } = this.organization;

        const { items = [] } = await this.accountingTemplateService.getAll([], {
            languageCode: this.store.preferredLanguage,
            organizationId,
            tenantId,
        });

        items.forEach((template: IAccountingTemplate) =>
        {
            switch (template.templateType)
            {
                case AccountingTemplateTypeEnum.INVOICE:
                    this.invoiceTemplates.push(template);
                    break;
                case AccountingTemplateTypeEnum.ESTIMATE:
                    this.estimateTemplates.push(template);
                    break;
                case AccountingTemplateTypeEnum.RECEIPT:
                    this.receiptTemplates.push(template);
                    break;
                default:
                    break;
            }
        });
    }

    async selectTemplate(event)
    {
        const template = await this.accountingTemplateService.getById(event);
        template['organization'] = this.organization;
        template['organizationId'] = this.organization.id;
        switch (template.templateType)
        {
            case AccountingTemplateTypeEnum.INVOICE:
                this.selectedInvoiceTemplate = template;
                break;
            case AccountingTemplateTypeEnum.ESTIMATE:
                this.selectedEstimateTemplate = template;
                break;
            case AccountingTemplateTypeEnum.RECEIPT:
                this.selectedReceiptTemplate = template;
                break;
            default:
                break;
        }
    }

    async saveTemplate(template: IAccountingTemplate)
    {
        if (template)
        {
            await this.accountingTemplateService.updateTemplate(
                template.id,
                template
            );
        }
    }

    /**
     * Sets the value of the `FormGroup`. It accepts an object that matches
     *
     * ### Set the complete value for the form group
     *
     * @returns
     */
    private _setFormValues()
    {
        if (!this.organization || !this.organizationTaskSetting)
        {
            return;
        }
        this.organizationEditStore.selectedOrganization = this.organization;
        this._setDefaultAccountingTemplates();

        this.form.patchValue({
            name: this.organization.name,
            currency: this.organization.currency,
            defaultValueDateType: this.organization.defaultValueDateType,
            regionCode: this.organization.regionCode,
            defaultAlignmentType: this.organization.defaultAlignmentType,
            brandColor: this.organization.brandColor,
            dateFormat: this.organization.dateFormat,
            timeZone: this.organization.timeZone,
            startWeekOn: this.organization.startWeekOn,
            defaultStartTime: this.organization.defaultStartTime,
            defaultEndTime: this.organization.defaultEndTime,
            numberFormat: this.organization.numberFormat,
            bonusType: this.organization.bonusType,
            bonusPercentage: this.organization.bonusPercentage,
            invitesAllowed: this.organization.invitesAllowed,
            fiscalStartDate: this.organization.fiscalStartDate,
            fiscalEndDate: this.organization.fiscalEndDate,
            futureDateAllowed: this.organization.futureDateAllowed,
            allowManualTime: this.organization.allowManualTime,
            allowModifyTime: this.organization.allowModifyTime,
            allowDeleteTime: this.organization.allowDeleteTime,
            allowTrackInactivity: this.organization.allowTrackInactivity,
            inactivityTimeLimit: this.organization.inactivityTimeLimit,
            activityProofDuration: this.organization.activityProofDuration,
            requireReason: this.organization.requireReason,
            requireDescription: this.organization.requireDescription,
            requireProject: this.organization.requireProject,
            requireTask: this.organization.requireTask,
            requireClient: this.organization.requireClient,
            timeFormat: this.organization.timeFormat,
            separateInvoiceItemTaxAndDiscount:
                this.organization.separateInvoiceItemTaxAndDiscount,
            defaultInvoiceEstimateTerms:
                this.organization.defaultInvoiceEstimateTerms,
            fiscalInformation: this.organization.fiscalInformation,
            currencyPosition: this.organization.currencyPosition,
            discountAfterTax: this.organization.discountAfterTax,
            convertAcceptedEstimates:
                this.organization.convertAcceptedEstimates,
            daysUntilDue: this.organization.daysUntilDue,
            isDefault: this.organization.isDefault,
            isRemoveIdleTime: this.organization.isRemoveIdleTime,
            allowScreenshotCapture: this.organization.allowScreenshotCapture,
            upworkOrganizationId: this.organization.upworkOrganizationId,
        });
        this.form.updateValueAndValidity();

        this.taskSettingForm.patchValue({
            isTasksPrivacyEnabled:
                this.organizationTaskSetting.isTasksPrivacyEnabled,
            isTasksMultipleAssigneesEnabled:
                this.organizationTaskSetting.isTasksMultipleAssigneesEnabled,
            isTasksManualTimeEnabled:
                this.organizationTaskSetting.isTasksManualTimeEnabled,
            isTasksGroupEstimationEnabled:
                this.organizationTaskSetting.isTasksGroupEstimationEnabled,
            isTasksEstimationInHoursEnabled:
                this.organizationTaskSetting.isTasksEstimationInHoursEnabled,
            isTasksEstimationInStoryPointsEnabled:
                this.organizationTaskSetting
                    .isTasksEstimationInStoryPointsEnabled,
            isTasksProofOfCompletionEnabled:
                this.organizationTaskSetting.isTasksProofOfCompletionEnabled,
            tasksProofOfCompletionType:
                this.organizationTaskSetting.tasksProofOfCompletionType, // Enum
            isTasksLinkedEnabled:
                this.organizationTaskSetting.isTasksLinkedEnabled,
            isTasksCommentsEnabled:
                this.organizationTaskSetting.isTasksCommentsEnabled,
            isTasksHistoryEnabled:
                this.organizationTaskSetting.isTasksHistoryEnabled,
            isTasksAcceptanceCriteriaEnabled:
                this.organizationTaskSetting.isTasksAcceptanceCriteriaEnabled,
            isTasksDraftsEnabled:
                this.organizationTaskSetting.isTasksDraftsEnabled,
            isTasksNotifyLeftEnabled:
                this.organizationTaskSetting.isTasksNotifyLeftEnabled,
            tasksNotifyLeftPeriodDays:
                this.organizationTaskSetting.tasksNotifyLeftPeriodDays,
            isTasksAutoCloseEnabled:
                this.organizationTaskSetting.isTasksAutoCloseEnabled,
            tasksAutoClosePeriodDays:
                this.organizationTaskSetting.tasksAutoClosePeriodDays,
            isTasksAutoArchiveEnabled:
                this.organizationTaskSetting.isTasksAutoArchiveEnabled,
            tasksAutoArchivePeriodDays:
                this.organizationTaskSetting.tasksAutoArchivePeriodDays,
            isTasksAutoStatusEnabled:
                this.organizationTaskSetting.isTasksAutoStatusEnabled,
        });
        this.taskSettingForm.updateValueAndValidity();

        /**
         * Default selected accounting templates dropdowns
         */
        const invoiceTemplateControl = this.form.get(
            'invoiceTemplate'
        ) as FormControl;
        invoiceTemplateControl.setValue(
            this.selectedInvoiceTemplate
                ? this.selectedInvoiceTemplate.id
                : null
        );
        invoiceTemplateControl.updateValueAndValidity();

        const estimateTemplateControl = this.form.get(
            'estimateTemplate'
        ) as FormControl;
        estimateTemplateControl.setValue(
            this.selectedEstimateTemplate
                ? this.selectedEstimateTemplate.id
                : null
        );
        estimateTemplateControl.updateValueAndValidity();

        const receiptTemplateControl = this.form.get(
            'receiptTemplate'
        ) as FormControl;
        receiptTemplateControl.setValue(
            this.selectedReceiptTemplate
                ? this.selectedReceiptTemplate.id
                : null
        );
        receiptTemplateControl.updateValueAndValidity();
    }

    /**
     * Set default organization selected accounting templates
     *
     * @returns
     */
    private _setDefaultAccountingTemplates()
    {
        if (
            !this.organization ||
            isEmpty(this.organization.accountingTemplates)
        )
        {
            return;
        }
        if (this.organization.accountingTemplates)
        {
            this.organization.accountingTemplates.forEach(
                (template: IAccountingTemplate) =>
                {
                    switch (template.templateType)
                    {
                        case AccountingTemplateTypeEnum.INVOICE:
                            this.selectedInvoiceTemplate = template;
                            break;
                        case AccountingTemplateTypeEnum.ESTIMATE:
                            this.selectedEstimateTemplate = template;
                            break;
                        case AccountingTemplateTypeEnum.RECEIPT:
                            this.selectedReceiptTemplate = template;
                            break;
                        default:
                            break;
                    }
                }
            );
        }
    }

    ngOnDestroy(): void { }
}
