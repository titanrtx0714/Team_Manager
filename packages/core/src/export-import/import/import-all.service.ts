import { Injectable, OnModuleInit, Type } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as unzipper from 'unzipper';
import * as csv from 'csv-parser';
import * as rimraf from 'rimraf';
import * as _ from 'lodash';
import * as path from 'path';
import { ConfigService } from '@gauzy/config';
import { getEntitiesFromPlugins } from '@gauzy/plugin';
import { isFunction, isNotEmpty } from '@gauzy/common';
import { convertToDatetime } from './../../core/utils';
import { FileStorage } from './../../core/file-storage';
import {
	AccountingTemplate,
	Activity,
	AppointmentEmployee,
	ApprovalPolicy,
	AvailabilitySlot,
	Candidate,
	CandidateCriterionsRating,
	CandidateDocument,
	CandidateEducation,
	CandidateExperience,
	CandidateFeedback,
	CandidateInterview,
	CandidateInterviewers,
	CandidatePersonalQualities,
	CandidateSkill,
	CandidateSource,
	CandidateTechnologies,
	Contact,
	CustomSmtp,
	Deal,
	Email,
	EmailTemplate,
	Employee,
	EmployeeAppointment,
	EmployeeAward,
	EmployeeLevel,
	EmployeeProposalTemplate,
	EmployeeRecurringExpense,
	EmployeeSetting,
	EmployeeUpworkJobsSearchCriterion,
	Equipment,
	EquipmentSharing,
	EquipmentSharingPolicy,
	EstimateEmail,
	EventType,
	Expense,
	ExpenseCategory,
	Feature,
	FeatureOrganization,
	Goal,
	GoalGeneralSetting,
	GoalKPI,
	GoalKPITemplate,
	GoalTemplate,
	GoalTimeFrame,
	ImageAsset,
	Income,
	Integration,
	IntegrationEntitySetting,
	IntegrationEntitySettingTiedEntity,
	IntegrationMap,
	IntegrationSetting,
	IntegrationTenant,
	IntegrationType,
	Invite,
	Invoice,
	InvoiceEstimateHistory,
	InvoiceItem,
	JobPreset,
	JobPresetUpworkJobSearchCriterion,
	JobSearchCategory,
	JobSearchOccupation,
	KeyResult,
	KeyResultTemplate,
	KeyResultUpdate,
	Language,
	Merchant,
	Organization,
	OrganizationAwards,
	OrganizationContact,
	OrganizationDepartment,
	OrganizationDocuments,
	OrganizationEmploymentType,
	OrganizationLanguages,
	OrganizationPositions,
	OrganizationProject,
	OrganizationRecurringExpense,
	OrganizationSprint,
	OrganizationTeam,
	OrganizationTeamEmployee,
	OrganizationVendor,
	Payment,
	Pipeline,
	PipelineStage,
	Product,
	ProductCategory,
	ProductCategoryTranslation,
	ProductOption,
	ProductOptionGroup,
	ProductOptionGroupTranslation,
	ProductOptionTranslation,
	ProductTranslation,
	ProductType,
	ProductTypeTranslation,
	ProductVariant,
	ProductVariantPrice,
	ProductVariantSettings,
	Proposal,
	Report,
	ReportCategory,
	ReportOrganization,
	RequestApproval,
	RequestApprovalEmployee,
	RequestApprovalTeam,
	Role,
	RolePermissions,
	Screenshot,
	Skill,
	Tag,
	Task,
	Tenant,
	TenantSetting,
	TimeLog,
	TimeOffPolicy,
	TimeOffRequest,
	Timesheet,
	TimeSlot,
	TimeSlotMinute,
	User,
	UserOrganization,
	Warehouse,
	WarehouseProduct,
	WarehouseProductVariant
} from './../../core/entities/internal';
import { RequestContext } from './../../core';

@Injectable()
export class ImportAllService implements OnModuleInit {
	private _dirname: string;
	private _extractPath: string;
	private _basename = '/import/csv/';

	private dynamicEntitiesClassMap: { [name: string]: Type<any> } = {};

	/**
	 * Warning: Changing position here can be FATAL
	 */
	private orderedRepositories = {
		/**
		* These entities do not have any other dependency so need to be imported first
		*/
		skill: this.skillRepository, //TODO: This should be organization level but currently does not have any org detail
		language: this.languageRepository,
		tenant: this.tenantRepository,
		tenant_setting: this.tenantSettingRepository,
		report_category: this.reportCategoryRepository,
		report: this.reportRepository,

		/**
		* These entities need TENANT
		*/
		role: this.roleRepository,
		role_permission: this.rolePermissionsRepository,
		organization: this.organizationRepository,

		/**
		* These entities need TENANT and ORGANIZATION
		*/
		users: this.userRepository,
		candidate: this.candidateRepository,
		user_organization: this.userOrganizationRepository,
		contact: this.contactRepository,
		custom_smtp: this.customSmtpRepository,
		report_organization: this.reportOrganizationRepository,
		job_preset: this.jobPresetRepository,
		job_search_category: this.jobSearchCategoryRepository,
		job_search_occupation: this.jobSearchOccupationRepository,
		job_preset_upwork_job_search_criterion: this.jobPresetUpworkJobSearchCriterionRepository,

		/**
		* These entities need TENANT, ORGANIZATION & USER
		*/
		employee: this.employeeRepository,

		/**
		* These entities need TENANT, ORGANIZATION & CANDIDATE
		*/
		candidate_documents: this.candidateDocumentRepository,
		candidate_education: this.candidateEducationRepository,
		candidate_experience: this.candidateExperienceRepository,
		candidate_feedbacks: this.candidateFeedbackRepository,
		candidate_interview: this.candidateInterviewRepository,
		candidate_interviews: this.candidateInterviewersRepository,
		candidate_personal_qualities: this.candidatePersonalQualitiesRepository,
		candidate_creation_rating: this.candidateCriterionsRatingRepository,
		candidate_skill: this.candidateSkillRepository,
		candidate_source: this.candidateSourceRepository,
		candidate_technologies: this.candidateTechnologiesRepository,

		activity: this.activityRepository,
		approval_policy: this.approvalPolicyRepository,
		availability_slot: this.availabilitySlotsRepository,
		appointment_employee: this.appointmentEmployeesRepository,

		deal: this.dealRepository,
		email_template: this.emailTemplateRepository,
		accounting_template: this.accountingTemplateRepository,
		estimate_email: this.estimateEmailRepository,
		email: this.emailRepository,

		employee_appointment: this.employeeAppointmentRepository,
		employee_award: this.employeeAwardRepository,
		employee_proposal_template: this.employeeProposalTemplateRepository,
		employee_recurring_expense: this.employeeRecurringExpenseRepository,
		employee_setting: this.employeeSettingRepository,
		employee_upwork_job_search_criterion: this.employeeUpworkJobsSearchCriterionRepository,
		equipment: this.equipmentRepository,
		equipment_sharing: this.equipmentSharingRepository,
		equipment_sharing_policy: this.equipmentSharingPolicyRepository,
		event_types: this.eventTypeRepository,
		expense_category: this.expenseCategoryRepository,
		feature: this.featureRepository,
		feature_organization: this.featureOrganizationRepository,
		expense: this.expenseRepository,
		goal_kpi: this.goalKpiRepository,
		gosl_kpi_template: this.goalKpiTemplateRepository,
		goal_time_frame: this.goalTimeFrameRepository,
		goal: this.goalRepository,
		goal_template: this.goalTemplateRepository,
		goal_general_setting: this.goalGeneralSettingRepository,
		income: this.incomeRepository,
		integration_tenant: this.integrationTenantRepository,
		integration_entity_setting: this.integrationEntitySettingRepository,
		integration_entity_setting_tied_entity: this.integrationEntitySettingTiedEntityRepository,
		integration_map: this.integrationMapRepository,
		integration_setting: this.integrationSettingRepository,
		integration: this.integrationRepository,
		integration_type: this.integrationTypeRepository,
		invite: this.inviteRepository,
		invoice_item: this.invoiceItemRepository,
		invoice: this.invoiceRepository,
		invoise_estimate_history: this.invoiceEstimateHistoryRepository,
		key_result: this.keyResultRepository,
		key_result_template: this.keyResultTemplateRepository,
		key_result_update: this.keyResultUpdateRepository,

		organization_award: this.organizationAwardsRepository,
		organization_contact: this.organizationContactRepository,
		organization_department: this.organizationDepartmentRepository,
		organization_document: this.organizationDocumentRepository,
		organization_employee_level: this.employeeLevelRepository,
		organization_employment_type: this.organizationEmploymentTypeRepository,
		organization_language: this.organizationLanguagesRepository,
		organization_position: this.organizationPositionsRepository,
		organization_project: this.organizationProjectsRepository,
		organization_recurring_expense: this.organizationRecurringExpenseRepository,
		organization_sprint: this.organizationSprintRepository,
		organization_team_employee: this.organizationTeamEmployeeRepository,
		organization_team: this.organizationTeamRepository,
		organization_vendor: this.organizationVendorsRepository,

		pipeline: this.pipelineRepository,
		product_category: this.productCategoryRepository,
		product_category_translation: this.productCategoryTranslationRepository,
		product_option: this.productOptionRepository,
		product_option_translation: this.productOptionTranslationRepository,
		product_option_group: this.productOptionGroupRepository,
		product_option_group_translation: this.productOptionGroupTranslationRepository,
		product_settings: this.productVariantSettingsRepository,
		product_type: this.productTypeRepository,
		product_type_translation: this.productTypeTranslationRepository,
		product_variant_price: this.productVariantPriceRepository,
		image_asset: this.imageAssetRepository,
		warehouse: this.warehouseRepository,
		merchant: this.merchantRepository,
		warehouse_product: this.warehouseProductRepository,
		warehouse_product_variant: this.warehouseProductVariantRepository,
		product_variant: this.productVariantRepository,
		product: this.productRepository,
		product_translation: this.productTranslationRepository,
		proposal: this.proposalRepository,
		payment: this.paymentRepository,
		request_approval: this.requestApprovalRepository,
		request_approval_employee: this.requestApprovalEmployeeRepository,
		request_approval_team: this.requestApprovalTeamRepository,

		screenshot: this.screenShotRepository,

		pipeline_stage: this.pipelineStageRepository,
		tag: this.tagRepository,
		task: this.taskRepository,

		time_log: this.timeLogRepository,
		time_slot: this.timeSlotRepository,
		time_slot_minute: this.timeSlotMinuteRepository,
		time_off_policy: this.timeOffPolicyRepository,
		time_off_request: this.timeOffRequestRepository,
		timesheet: this.timeSheetRepository
	};

	constructor(
		@InjectRepository(AccountingTemplate)
		private readonly accountingTemplateRepository: Repository<AccountingTemplate>,

		@InjectRepository(Activity)
		private readonly activityRepository: Repository<Activity>,

		@InjectRepository(AppointmentEmployee)
		private readonly appointmentEmployeesRepository: Repository<AppointmentEmployee>,

		@InjectRepository(ApprovalPolicy)
		private readonly approvalPolicyRepository: Repository<ApprovalPolicy>,

		@InjectRepository(AvailabilitySlot)
		private readonly availabilitySlotsRepository: Repository<AvailabilitySlot>,

		@InjectRepository(Candidate)
		private readonly candidateRepository: Repository<Candidate>,

		@InjectRepository(CandidateCriterionsRating)
		private readonly candidateCriterionsRatingRepository: Repository<CandidateCriterionsRating>,

		@InjectRepository(CandidateDocument)
		private readonly candidateDocumentRepository: Repository<CandidateDocument>,

		@InjectRepository(CandidateEducation)
		private readonly candidateEducationRepository: Repository<CandidateEducation>,

		@InjectRepository(CandidateExperience)
		private readonly candidateExperienceRepository: Repository<CandidateExperience>,

		@InjectRepository(CandidateFeedback)
		private readonly candidateFeedbackRepository: Repository<CandidateFeedback>,

		@InjectRepository(CandidateInterview)
		private readonly candidateInterviewRepository: Repository<CandidateInterview>,

		@InjectRepository(CandidateInterviewers)
		private readonly candidateInterviewersRepository: Repository<CandidateInterviewers>,

		@InjectRepository(CandidatePersonalQualities)
		private readonly candidatePersonalQualitiesRepository: Repository<CandidatePersonalQualities>,

		@InjectRepository(CandidateSkill)
		private readonly candidateSkillRepository: Repository<CandidateSkill>,

		@InjectRepository(CandidateSource)
		private readonly candidateSourceRepository: Repository<CandidateSource>,

		@InjectRepository(CandidateTechnologies)
		private readonly candidateTechnologiesRepository: Repository<CandidateTechnologies>,

		@InjectRepository(Contact)
		private readonly contactRepository: Repository<Contact>,

		@InjectRepository(CustomSmtp)
		private readonly customSmtpRepository: Repository<CustomSmtp>,

		@InjectRepository(Deal)
		private readonly dealRepository: Repository<Deal>,

		@InjectRepository(Email)
		private readonly emailRepository: Repository<Email>,

		@InjectRepository(EmailTemplate)
		private readonly emailTemplateRepository: Repository<EmailTemplate>,

		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,

		@InjectRepository(EmployeeAppointment)
		private readonly employeeAppointmentRepository: Repository<EmployeeAppointment>,

		@InjectRepository(EmployeeAward)
		private readonly employeeAwardRepository: Repository<EmployeeAward>,

		@InjectRepository(EmployeeProposalTemplate)
		private readonly employeeProposalTemplateRepository: Repository<EmployeeProposalTemplate>,

		@InjectRepository(EmployeeRecurringExpense)
		private readonly employeeRecurringExpenseRepository: Repository<EmployeeRecurringExpense>,

		@InjectRepository(EmployeeSetting)
		private readonly employeeSettingRepository: Repository<EmployeeSetting>,

		@InjectRepository(EmployeeUpworkJobsSearchCriterion)
		private readonly employeeUpworkJobsSearchCriterionRepository: Repository<EmployeeUpworkJobsSearchCriterion>,

		@InjectRepository(Equipment)
		private readonly equipmentRepository: Repository<Equipment>,

		@InjectRepository(EquipmentSharing)
		private readonly equipmentSharingRepository: Repository<EquipmentSharing>,

		@InjectRepository(EquipmentSharingPolicy)
		private readonly equipmentSharingPolicyRepository: Repository<EquipmentSharingPolicy>,

		@InjectRepository(EstimateEmail)
		private readonly estimateEmailRepository: Repository<EstimateEmail>,

		@InjectRepository(EventType)
		private readonly eventTypeRepository: Repository<EventType>,

		@InjectRepository(Expense)
		private readonly expenseRepository: Repository<Expense>,

		@InjectRepository(ExpenseCategory)
		private readonly expenseCategoryRepository: Repository<ExpenseCategory>,

		@InjectRepository(Feature)
		private readonly featureRepository: Repository<Feature>,

		@InjectRepository(FeatureOrganization)
		private readonly featureOrganizationRepository: Repository<FeatureOrganization>,

		@InjectRepository(Goal)
		private readonly goalRepository: Repository<Goal>,

		@InjectRepository(GoalTemplate)
		private readonly goalTemplateRepository: Repository<GoalTemplate>,

		@InjectRepository(GoalKPI)
		private readonly goalKpiRepository: Repository<GoalKPI>,

		@InjectRepository(GoalKPITemplate)
		private readonly goalKpiTemplateRepository: Repository<GoalKPITemplate>,

		@InjectRepository(GoalTimeFrame)
		private readonly goalTimeFrameRepository: Repository<GoalTimeFrame>,

		@InjectRepository(GoalGeneralSetting)
		private readonly goalGeneralSettingRepository: Repository<GoalGeneralSetting>,

		@InjectRepository(Income)
		private readonly incomeRepository: Repository<Income>,

		@InjectRepository(Integration)
		private readonly integrationRepository: Repository<Integration>,

		@InjectRepository(IntegrationType)
		private readonly integrationTypeRepository: Repository<IntegrationType>,

		@InjectRepository(IntegrationEntitySetting)
		private readonly integrationEntitySettingRepository: Repository<IntegrationEntitySetting>,

		@InjectRepository(IntegrationEntitySettingTiedEntity)
		private readonly integrationEntitySettingTiedEntityRepository: Repository<IntegrationEntitySettingTiedEntity>,

		@InjectRepository(IntegrationMap)
		private readonly integrationMapRepository: Repository<IntegrationMap>,

		@InjectRepository(IntegrationSetting)
		private readonly integrationSettingRepository: Repository<IntegrationSetting>,

		@InjectRepository(IntegrationTenant)
		private readonly integrationTenantRepository: Repository<IntegrationTenant>,

		@InjectRepository(Invite)
		private readonly inviteRepository: Repository<Invite>,

		@InjectRepository(Invoice)
		private readonly invoiceRepository: Repository<Invoice>,

		@InjectRepository(InvoiceEstimateHistory)
		private readonly invoiceEstimateHistoryRepository: Repository<InvoiceEstimateHistory>,

		@InjectRepository(InvoiceItem)
		private readonly invoiceItemRepository: Repository<InvoiceItem>,

		@InjectRepository(JobPreset)
		private readonly jobPresetRepository: Repository<JobPreset>,

		@InjectRepository(JobPresetUpworkJobSearchCriterion)
		private readonly jobPresetUpworkJobSearchCriterionRepository: Repository<JobPresetUpworkJobSearchCriterion>,

		@InjectRepository(JobSearchCategory)
		private readonly jobSearchCategoryRepository: Repository<JobSearchCategory>,

		@InjectRepository(JobSearchOccupation)
		private readonly jobSearchOccupationRepository: Repository<JobSearchOccupation>,

		@InjectRepository(KeyResult)
		private readonly keyResultRepository: Repository<KeyResult>,

		@InjectRepository(KeyResultTemplate)
		private readonly keyResultTemplateRepository: Repository<KeyResultTemplate>,

		@InjectRepository(KeyResultUpdate)
		private readonly keyResultUpdateRepository: Repository<KeyResultUpdate>,

		@InjectRepository(Language)
		private readonly languageRepository: Repository<Language>,

		@InjectRepository(Organization)
		private readonly organizationRepository: Repository<Organization>,

		@InjectRepository(EmployeeLevel)
		private readonly employeeLevelRepository: Repository<EmployeeLevel>,

		@InjectRepository(OrganizationAwards)
		private readonly organizationAwardsRepository: Repository<OrganizationAwards>,

		@InjectRepository(OrganizationContact)
		private readonly organizationContactRepository: Repository<OrganizationContact>,

		@InjectRepository(OrganizationDepartment)
		private readonly organizationDepartmentRepository: Repository<OrganizationDepartment>,

		@InjectRepository(OrganizationDocuments)
		private readonly organizationDocumentRepository: Repository<OrganizationDocuments>,

		@InjectRepository(OrganizationEmploymentType)
		private readonly organizationEmploymentTypeRepository: Repository<OrganizationEmploymentType>,

		@InjectRepository(OrganizationLanguages)
		private readonly organizationLanguagesRepository: Repository<OrganizationLanguages>,

		@InjectRepository(OrganizationPositions)
		private readonly organizationPositionsRepository: Repository<OrganizationPositions>,

		@InjectRepository(OrganizationProject)
		private readonly organizationProjectsRepository: Repository<OrganizationProject>,

		@InjectRepository(OrganizationRecurringExpense)
		private readonly organizationRecurringExpenseRepository: Repository<OrganizationRecurringExpense>,

		@InjectRepository(OrganizationSprint)
		private readonly organizationSprintRepository: Repository<OrganizationSprint>,

		@InjectRepository(OrganizationTeam)
		private readonly organizationTeamRepository: Repository<OrganizationTeam>,

		@InjectRepository(OrganizationTeamEmployee)
		private readonly organizationTeamEmployeeRepository: Repository<OrganizationTeamEmployee>,

		@InjectRepository(OrganizationVendor)
		private readonly organizationVendorsRepository: Repository<OrganizationVendor>,

		@InjectRepository(Payment)
		private readonly paymentRepository: Repository<Payment>,

		@InjectRepository(Pipeline)
		private readonly pipelineRepository: Repository<Pipeline>,

		@InjectRepository(PipelineStage)
		private readonly pipelineStageRepository: Repository<PipelineStage>,

		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,

		@InjectRepository(ProductTranslation)
		private readonly productTranslationRepository: Repository<ProductTranslation>,

		@InjectRepository(ProductCategory)
		private readonly productCategoryRepository: Repository<ProductCategory>,

		@InjectRepository(ProductCategoryTranslation)
		private readonly productCategoryTranslationRepository: Repository<ProductCategoryTranslation>,

		@InjectRepository(ProductOption)
		private readonly productOptionRepository: Repository<ProductOption>,

		@InjectRepository(ProductOptionTranslation)
		private readonly productOptionTranslationRepository: Repository<ProductOptionTranslation>,

		@InjectRepository(ProductOptionGroup)
		private readonly productOptionGroupRepository: Repository<ProductOptionGroup>,

		@InjectRepository(ProductOptionGroupTranslation)
		private readonly productOptionGroupTranslationRepository: Repository<ProductOptionGroupTranslation>,

		@InjectRepository(ProductVariantSettings)
		private readonly productVariantSettingsRepository: Repository<ProductVariantSettings>,

		@InjectRepository(ProductType)
		private readonly productTypeRepository: Repository<ProductType>,

		@InjectRepository(ProductTypeTranslation)
		private readonly productTypeTranslationRepository: Repository<ProductTypeTranslation>,

		@InjectRepository(ProductVariant)
		private readonly productVariantRepository: Repository<ProductVariant>,

		@InjectRepository(ProductVariantPrice)
		private readonly productVariantPriceRepository: Repository<ProductVariantPrice>,

		@InjectRepository(ImageAsset)
		private readonly imageAssetRepository: Repository<ImageAsset>,

		@InjectRepository(Warehouse)
		private readonly warehouseRepository: Repository<Warehouse>,

		@InjectRepository(Merchant)
		private readonly merchantRepository: Repository<Merchant>,

		@InjectRepository(WarehouseProduct)
		private readonly warehouseProductRepository: Repository<WarehouseProduct>,

		@InjectRepository(WarehouseProductVariant)
		private readonly warehouseProductVariantRepository: Repository<WarehouseProductVariant>,

		@InjectRepository(Proposal)
		private readonly proposalRepository: Repository<Proposal>,

		@InjectRepository(Skill)
		private readonly skillRepository: Repository<Skill>,

		@InjectRepository(Screenshot)
		private readonly screenShotRepository: Repository<Screenshot>,

		@InjectRepository(RequestApproval)
		private readonly requestApprovalRepository: Repository<RequestApproval>,

		@InjectRepository(RequestApprovalEmployee)
		private readonly requestApprovalEmployeeRepository: Repository<RequestApprovalEmployee>,

		@InjectRepository(RequestApprovalTeam)
		private readonly requestApprovalTeamRepository: Repository<RequestApprovalTeam>,

		@InjectRepository(Role)
		private readonly roleRepository: Repository<Role>,

		@InjectRepository(RolePermissions)
		private readonly rolePermissionsRepository: Repository<RolePermissions>,

		@InjectRepository(Report)
		private readonly reportRepository: Repository<Report>,

		@InjectRepository(ReportCategory)
		private readonly reportCategoryRepository: Repository<ReportCategory>,

		@InjectRepository(ReportOrganization)
		private readonly reportOrganizationRepository: Repository<ReportOrganization>,

		@InjectRepository(Tag)
		private readonly tagRepository: Repository<Tag>,

		@InjectRepository(Task)
		private readonly taskRepository: Repository<Task>,

		@InjectRepository(Tenant)
		private readonly tenantRepository: Repository<Tenant>,

		@InjectRepository(TenantSetting)
		private readonly tenantSettingRepository: Repository<TenantSetting>,

		@InjectRepository(Timesheet)
		private readonly timeSheetRepository: Repository<Timesheet>,

		@InjectRepository(TimeLog)
		private readonly timeLogRepository: Repository<TimeLog>,

		@InjectRepository(TimeSlot)
		private readonly timeSlotRepository: Repository<TimeSlot>,

		@InjectRepository(TimeSlotMinute)
		private readonly timeSlotMinuteRepository: Repository<TimeSlotMinute>,

		@InjectRepository(TimeOffRequest)
		private readonly timeOffRequestRepository: Repository<TimeOffRequest>,

		@InjectRepository(TimeOffPolicy)
		private readonly timeOffPolicyRepository: Repository<TimeOffPolicy>,

		@InjectRepository(User)
		private readonly userRepository: Repository<User>,

		@InjectRepository(UserOrganization)
		private readonly userOrganizationRepository: Repository<UserOrganization>,

		private readonly configService: ConfigService
	) {}

	async onModuleInit() {
		this.createDynamicInstanceForPluginEntities();

		const public_path = this.configService.assetOptions.assetPublicPath || __dirname;

		//base import csv directory path
		this._dirname = path.join(public_path, this._basename);

		//extracted import csv directory path
		this._extractPath = path.join(this._dirname, 'import/');
	}

	async createFolder(): Promise<any> {
		return new Promise((resolve, reject) => {
			fs.access(`./import`, (error) => {
				if (!error) {
					return null;
				} else {
					fs.mkdir(`./import`, { recursive: true }, (err) => {
						if (err) reject(err);
						resolve('');
					});
				}
			});
		});
	}

	public removeExtractedFiles() {
		try {
			rimraf.sync(this._dirname);
		} catch (error) {
			console.log(error);
		}
	}

	public async unzipAndParse(filePath, cleanup: boolean = false) {
		const file = await new FileStorage().getProvider().getFile(filePath);
		await unzipper.Open.buffer(file).then((d) =>
			d.extract({ path: this._dirname })
		);
		await this.parse(cleanup);
	}

	async parse(cleanup: boolean = false) {
		/**
	 	 * Can only run in a particular order
		 */
		const tenantId = RequestContext.currentTenantId();
		for await (const i of Object.keys(this.orderedRepositories)) {
			const csvPath = this._extractPath + i + '.csv';
			
			if (!fs.existsSync(csvPath)) {
				console.log('File Does Not Exist, Skipping: ', i);
				continue;
			}

			// console.log('File Exists:', csvPath);
			let results = [];
			/**
			 * This will first collect all the data and then insert
			 * If cleanup flag is set then it will also truncate the database table with CASCADE
			 */
			fs.createReadStream(csvPath, 'utf8')
				.pipe(csv())
				.on('data', (data) => {
					data = this.mappedFields(data);
					results.push(data);
				})
				.on('end', async () => {
					results = results.filter(isNotEmpty);
					if (results.length) {
						const masterTable = await this.orderedRepositories[i].metadata.tableName;
						if (cleanup) {
							await this.orderedRepositories[i].query(
								`TRUNCATE "${masterTable}" RESTART IDENTITY CASCADE;`
							);
						}
						await this.orderedRepositories[i].insert(results);
					}
				});
		}
	}

	/*
	 * Add missing timestamps fields here
	 */
	mappedFields(data) {
		if ('tenantId' in data && isNotEmpty(data['tenantId'])) {
			data['tenantId'] = RequestContext.currentTenantId();
		}
		if ('createdAt' in data && isNotEmpty(data['createdAt'])) {
			data['createdAt'] = convertToDatetime(data['createdAt']);
		}
		if ('updatedAt' in data && isNotEmpty(data['updatedAt'])) {
			data['updatedAt'] = convertToDatetime(data['updatedAt']);
		}
		if ('recordedAt' in data && isNotEmpty(data['recordedAt'])) {
			data['recordedAt'] = convertToDatetime(data['recordedAt']);
		}
		if ('deletedAt' in data && isNotEmpty(data['deletedAt'])) {
			data['deletedAt'] = convertToDatetime(data['deletedAt']);
		}
		return data;
	}

	//load plugins entities for import data
	private createDynamicInstanceForPluginEntities() {
		for (const entity of getEntitiesFromPlugins(
			this.configService.plugins
		)) {
			if (!isFunction(entity)) {
				continue;
			}

			const className = _.camelCase(entity.name);
			const repository = getConnection().getRepository(entity);
			const tableName = repository.metadata.tableName;

			this[className] = repository;
			this.orderedRepositories[tableName] = this[className];

			this.dynamicEntitiesClassMap[tableName] = this[className];
		}
	}
}
