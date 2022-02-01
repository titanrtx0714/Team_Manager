import { PermissionsEnum, RolesEnum } from '@gauzy/contracts';

export const DEFAULT_ROLE_PERMISSIONS = [
	{
		role: RolesEnum.SUPER_ADMIN,
		defaultEnabledPermissions: [
			PermissionsEnum.ADMIN_DASHBOARD_VIEW,
			PermissionsEnum.ORG_PAYMENT_VIEW,
			PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
			PermissionsEnum.ORG_INCOMES_VIEW,
			PermissionsEnum.ORG_INCOMES_EDIT,
			PermissionsEnum.ORG_EXPENSES_VIEW,
			PermissionsEnum.ORG_EXPENSES_EDIT,
			PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
			PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
			PermissionsEnum.ORG_PROPOSALS_VIEW,
			PermissionsEnum.ORG_PROPOSALS_EDIT,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
			PermissionsEnum.ORG_EMPLOYEES_VIEW,
			PermissionsEnum.ORG_EMPLOYEES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_VIEW,
			PermissionsEnum.ORG_CANDIDATES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
			PermissionsEnum.ORG_INVENTORY_VIEW,
			PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
			PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
			PermissionsEnum.ORG_HELP_CENTER_EDIT,
			PermissionsEnum.ORG_USERS_VIEW,
			PermissionsEnum.ORG_USERS_EDIT,
			PermissionsEnum.ALL_ORG_VIEW,
			PermissionsEnum.ALL_ORG_EDIT,
			PermissionsEnum.POLICY_EDIT,
			PermissionsEnum.POLICY_VIEW,
			PermissionsEnum.APPROVAL_POLICY_EDIT,
			PermissionsEnum.APPROVAL_POLICY_VIEW,
			PermissionsEnum.REQUEST_APPROVAL_EDIT,
			PermissionsEnum.REQUEST_APPROVAL_VIEW,
			PermissionsEnum.ORG_TIME_OFF_VIEW,
			PermissionsEnum.TIME_OFF_EDIT,
			PermissionsEnum.CHANGE_SELECTED_EMPLOYEE,
			PermissionsEnum.CHANGE_SELECTED_CANDIDATE,
			PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
			PermissionsEnum.CHANGE_ROLES_PERMISSIONS,
			PermissionsEnum.ORG_INVITE_VIEW,
			PermissionsEnum.ORG_INVITE_EDIT,
			PermissionsEnum.ACCESS_PRIVATE_PROJECTS,
			PermissionsEnum.TIMESHEET_EDIT_TIME,
			PermissionsEnum.SUPER_ADMIN_EDIT,
			PermissionsEnum.PUBLIC_PAGE_EDIT,
			PermissionsEnum.INVOICES_VIEW,
			PermissionsEnum.INVOICES_EDIT,
			PermissionsEnum.ESTIMATES_VIEW,
			PermissionsEnum.ESTIMATES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT,
			PermissionsEnum.ORG_TAGS_EDIT,
			PermissionsEnum.VIEW_ALL_EMAILS,
			PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES,
			PermissionsEnum.VIEW_SALES_PIPELINES,
			PermissionsEnum.EDIT_SALES_PIPELINES,
			PermissionsEnum.CAN_APPROVE_TIMESHEET,
			PermissionsEnum.ORG_SPRINT_EDIT,
			PermissionsEnum.ORG_SPRINT_VIEW,
			PermissionsEnum.ORG_PROJECT_EDIT,
			PermissionsEnum.ORG_CONTACT_EDIT,
			PermissionsEnum.ORG_CONTACT_VIEW,
			PermissionsEnum.ORG_TEAM_EDIT,
			PermissionsEnum.ORG_CONTRACT_EDIT,
			PermissionsEnum.EVENT_TYPES_VIEW,
			PermissionsEnum.TENANT_ADD_EXISTING_USER,
			PermissionsEnum.INTEGRATION_VIEW,
			PermissionsEnum.IMPORT_EXPORT_VIEW,
			PermissionsEnum.FILE_STORAGE_VIEW,
			PermissionsEnum.PAYMENT_GATEWAY_VIEW,
			PermissionsEnum.SMS_GATEWAY_VIEW,
			PermissionsEnum.CUSTOM_SMTP_VIEW,
			PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW,
			PermissionsEnum.ORG_JOB_MATCHING_VIEW,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.ORG_EQUIPMENT_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_EDIT,
			PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT,
			PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
			PermissionsEnum.EQUIPMENT_APPROVE_REQUEST,
			PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
			PermissionsEnum.ORG_PRODUCT_TYPES_EDIT,
			PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
			PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT,
			PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES,
			PermissionsEnum.MIGRATE_GAUZY_CLOUD,
			PermissionsEnum.INVENTORY_GALLERY_VIEW,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.ACCESS_DELETE_ACCOUNT,
			PermissionsEnum.ACCESS_DELETE_ALL_DATA,
			PermissionsEnum.PROFILE_EDIT,
			PermissionsEnum.TENANT_SETTING,
			PermissionsEnum.ALLOW_DELETE_TIME,
			PermissionsEnum.ALLOW_MODIFY_TIME,
			PermissionsEnum.ALLOW_MANUAL_TIME
		]
	},
	{
		role: RolesEnum.ADMIN,
		defaultEnabledPermissions: [
			PermissionsEnum.ADMIN_DASHBOARD_VIEW,
			PermissionsEnum.ORG_PAYMENT_VIEW,
			PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
			PermissionsEnum.ORG_INCOMES_VIEW,
			PermissionsEnum.ORG_INCOMES_EDIT,
			PermissionsEnum.ORG_EXPENSES_VIEW,
			PermissionsEnum.ORG_EXPENSES_EDIT,
			PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
			PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
			PermissionsEnum.ORG_PROPOSALS_VIEW,
			PermissionsEnum.ORG_PROPOSALS_EDIT,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
			PermissionsEnum.ORG_EMPLOYEES_VIEW,
			PermissionsEnum.ORG_EMPLOYEES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_VIEW,
			PermissionsEnum.ORG_CANDIDATES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
			PermissionsEnum.ORG_INVENTORY_VIEW,
			PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
			PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
			PermissionsEnum.ORG_HELP_CENTER_EDIT,
			PermissionsEnum.ORG_USERS_VIEW,
			PermissionsEnum.ORG_USERS_EDIT,
			PermissionsEnum.ALL_ORG_VIEW,
			PermissionsEnum.ALL_ORG_EDIT,
			PermissionsEnum.POLICY_EDIT,
			PermissionsEnum.POLICY_VIEW,
			PermissionsEnum.APPROVAL_POLICY_EDIT,
			PermissionsEnum.APPROVAL_POLICY_VIEW,
			PermissionsEnum.REQUEST_APPROVAL_EDIT,
			PermissionsEnum.REQUEST_APPROVAL_VIEW,
			PermissionsEnum.ORG_TIME_OFF_VIEW,
			PermissionsEnum.TIME_OFF_EDIT,
			PermissionsEnum.CHANGE_SELECTED_EMPLOYEE,
			PermissionsEnum.CHANGE_SELECTED_CANDIDATE,
			PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
			PermissionsEnum.CHANGE_ROLES_PERMISSIONS,
			PermissionsEnum.ORG_INVITE_VIEW,
			PermissionsEnum.ORG_INVITE_EDIT,
			PermissionsEnum.ACCESS_PRIVATE_PROJECTS,
			PermissionsEnum.TIMESHEET_EDIT_TIME,
			PermissionsEnum.PUBLIC_PAGE_EDIT,
			PermissionsEnum.INVOICES_VIEW,
			PermissionsEnum.INVOICES_EDIT,
			PermissionsEnum.ESTIMATES_VIEW,
			PermissionsEnum.ESTIMATES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT,
			PermissionsEnum.ORG_TAGS_EDIT,
			PermissionsEnum.VIEW_ALL_EMAILS,
			PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES,
			PermissionsEnum.VIEW_SALES_PIPELINES,
			PermissionsEnum.EDIT_SALES_PIPELINES,
			PermissionsEnum.CAN_APPROVE_TIMESHEET,
			PermissionsEnum.ORG_SPRINT_EDIT,
			PermissionsEnum.ORG_SPRINT_VIEW,
			PermissionsEnum.ORG_PROJECT_EDIT,
			PermissionsEnum.ORG_CONTACT_EDIT,
			PermissionsEnum.ORG_CONTACT_VIEW,
			PermissionsEnum.ORG_TEAM_EDIT,
			PermissionsEnum.ORG_CONTRACT_EDIT,
			PermissionsEnum.EVENT_TYPES_VIEW,
			PermissionsEnum.TENANT_ADD_EXISTING_USER,
			PermissionsEnum.INTEGRATION_VIEW,
			PermissionsEnum.IMPORT_EXPORT_VIEW,
			PermissionsEnum.FILE_STORAGE_VIEW,
			PermissionsEnum.PAYMENT_GATEWAY_VIEW,
			PermissionsEnum.SMS_GATEWAY_VIEW,
			PermissionsEnum.CUSTOM_SMTP_VIEW,
			PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW,
			PermissionsEnum.ORG_JOB_MATCHING_VIEW,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.ORG_EQUIPMENT_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_EDIT,
			PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT,
			PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
			PermissionsEnum.EQUIPMENT_APPROVE_REQUEST,
			PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
			PermissionsEnum.ORG_PRODUCT_TYPES_EDIT,
			PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
			PermissionsEnum.ORG_PRODUCT_CATEGORIES_EDIT,
			PermissionsEnum.VIEW_ALL_ACCOUNTING_TEMPLATES,
			PermissionsEnum.MIGRATE_GAUZY_CLOUD,
			PermissionsEnum.INVENTORY_GALLERY_VIEW,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.ACCESS_DELETE_ACCOUNT,
			PermissionsEnum.ACCESS_DELETE_ALL_DATA,
			PermissionsEnum.PROFILE_EDIT,
			PermissionsEnum.TIME_TRACKER,
			PermissionsEnum.TENANT_SETTING,
			PermissionsEnum.ALLOW_DELETE_TIME,
			PermissionsEnum.ALLOW_MODIFY_TIME,
			PermissionsEnum.ALLOW_MANUAL_TIME
		]
	},
	{
		role: RolesEnum.DATA_ENTRY,
		defaultEnabledPermissions: [
			PermissionsEnum.ORG_PAYMENT_VIEW,
			PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
			PermissionsEnum.ORG_EXPENSES_EDIT,
			PermissionsEnum.ORG_EXPENSES_VIEW,
			PermissionsEnum.ORG_INCOMES_EDIT,
			PermissionsEnum.ORG_INCOMES_VIEW,
			PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
			PermissionsEnum.INVOICES_VIEW,
			PermissionsEnum.INVOICES_EDIT,
			PermissionsEnum.ESTIMATES_VIEW,
			PermissionsEnum.ESTIMATES_EDIT,
			PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
			PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
			PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
			PermissionsEnum.ORG_HELP_CENTER_EDIT,
			PermissionsEnum.PROFILE_EDIT
		]
	},
	{
		role: RolesEnum.EMPLOYEE,
		defaultEnabledPermissions: [
			PermissionsEnum.ADMIN_DASHBOARD_VIEW,
			PermissionsEnum.ORG_PROPOSALS_VIEW,
			PermissionsEnum.ORG_PROPOSALS_EDIT,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
			PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
			PermissionsEnum.ORG_TIME_OFF_VIEW,
			PermissionsEnum.POLICY_VIEW,
			PermissionsEnum.APPROVAL_POLICY_EDIT,
			PermissionsEnum.APPROVAL_POLICY_VIEW,
			PermissionsEnum.REQUEST_APPROVAL_EDIT,
			PermissionsEnum.REQUEST_APPROVAL_VIEW,
			PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
			PermissionsEnum.EVENT_TYPES_VIEW,
			PermissionsEnum.TIME_TRACKER,
			PermissionsEnum.INVOICES_VIEW,
			PermissionsEnum.INVOICES_EDIT,
			PermissionsEnum.ESTIMATES_VIEW,
			PermissionsEnum.ESTIMATES_EDIT,
			PermissionsEnum.ORG_CONTACT_VIEW,
			PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
			PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
			PermissionsEnum.INVENTORY_GALLERY_VIEW,
			PermissionsEnum.INVENTORY_GALLERY_EDIT,
			PermissionsEnum.ORG_INVENTORY_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_VIEW,
			PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW,
			PermissionsEnum.EQUIPMENT_MAKE_REQUEST,
			PermissionsEnum.ORG_PRODUCT_TYPES_VIEW,
			PermissionsEnum.ORG_PRODUCT_CATEGORIES_VIEW,
			PermissionsEnum.PROFILE_EDIT,
			PermissionsEnum.ALLOW_DELETE_TIME,
			PermissionsEnum.ALLOW_MODIFY_TIME,
			PermissionsEnum.ALLOW_MANUAL_TIME
		]
	},
	{
		role: RolesEnum.INTERVIEWER,
		defaultEnabledPermissions: [
			PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
			PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW
		]
	},
	{
		role: RolesEnum.CANDIDATE,
		defaultEnabledPermissions: []
	},
	{
		role: RolesEnum.MANAGER,
		defaultEnabledPermissions: []
	},
	{
		role: RolesEnum.VIEWER,
		defaultEnabledPermissions: []
	}
];
