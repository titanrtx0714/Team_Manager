import {
	ActivitySubscriber,
	CandidateSubscriber,
	CustomSmtpSubscriber,
	EmailResetSubscriber,
	EmailTemplateSubscriber,
	EmployeeSubscriber,
	FeatureSubscriber,
	ImageAssetSubscriber,
	ImportHistorySubscriber,
	InviteSubscriber,
	InvoiceSubscriber,
	IssueTypeSubscriber,
	OrganizationContactSubscriber,
	OrganizationDocumentSubscriber,
	OrganizationProjectSubscriber,
	OrganizationSubscriber,
	OrganizationTeamEmployeeSubscriber,
	OrganizationTeamJoinRequestSubscriber,
	OrganizationTeamSubscriber,
	PaymentSubscriber,
	ProductCategorySubscriber,
	ReportSubscriber,
	ScreenshotSubscriber,
	TagSubscriber,
	TaskPrioritySubscriber,
	TaskSizeSubscriber,
	TaskRelatedIssueTypesSubscriber,
	TaskStatusSubscriber,
	TaskVersionSubscriber,
	TaskSubscriber,
	TenantSubscriber,
	TimeOffRequestSubscriber,
	TimeSlotSubscriber,
	UserSubscriber,
	IntegrationSubscriber,
	JitsuEventsSubscriber,
} from './internal';

/**
 * A map of the core TypeORM Subscribers.
 */
export const coreSubscribers = [
	ActivitySubscriber,
	CandidateSubscriber,
	CustomSmtpSubscriber,
	EmailResetSubscriber,
	EmailTemplateSubscriber,
	EmployeeSubscriber,
	FeatureSubscriber,
	ImageAssetSubscriber,
	ImportHistorySubscriber,
	IntegrationSubscriber,
	InviteSubscriber,
	InvoiceSubscriber,
	IssueTypeSubscriber,
	OrganizationContactSubscriber,
	OrganizationDocumentSubscriber,
	OrganizationProjectSubscriber,
	OrganizationSubscriber,
	OrganizationTeamEmployeeSubscriber,
	OrganizationTeamJoinRequestSubscriber,
	OrganizationTeamSubscriber,
	PaymentSubscriber,
	ProductCategorySubscriber,
	ReportSubscriber,
	ScreenshotSubscriber,
	TagSubscriber,
	TaskPrioritySubscriber,
	TaskRelatedIssueTypesSubscriber,
	TaskSizeSubscriber,
	TaskStatusSubscriber,
	TaskSubscriber,
	TaskVersionSubscriber,
	TenantSubscriber,
	TimeOffRequestSubscriber,
	TimeSlotSubscriber,
	UserSubscriber,
	JitsuEventsSubscriber,
];
