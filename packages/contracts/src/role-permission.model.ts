import { IBasePerTenantEntityModel } from './base-entity.model';
import { IRole } from './role.model';
import { ITenant } from './tenant.model';

export interface IRolePermission extends IBasePerTenantEntityModel {
	roleId: string;
	permission: string;
	role: IRole;
	enabled: boolean;
}

export interface IRolePermissionCreateInput {
	roleId: string;
	permission: string;
	enabled: boolean;
	tenant: ITenant;
}

export interface IRolePermissionUpdateInput {
	enabled: boolean;
}

export enum PermissionsEnum {
	ADMIN_DASHBOARD_VIEW = 'ADMIN_DASHBOARD_VIEW',
	ORG_PAYMENT_VIEW = 'ORG_PAYMENT_VIEW',
	ORG_PAYMENT_ADD_EDIT = 'ORG_PAYMENT_ADD_EDIT',
	ORG_INCOMES_VIEW = 'ORG_INCOMES_VIEW',
	ORG_INCOMES_EDIT = 'ORG_INCOMES_EDIT',
	ORG_EXPENSES_VIEW = 'ORG_EXPENSES_VIEW',
	ORG_EXPENSES_EDIT = 'ORG_EXPENSES_EDIT',
	EMPLOYEE_EXPENSES_VIEW = 'EMPLOYEE_EXPENSES_VIEW',
	EMPLOYEE_EXPENSES_EDIT = 'EMPLOYEE_EXPENSES_EDIT',
	ORG_PROPOSALS_VIEW = 'ORG_PROPOSALS_VIEW',
	ORG_PROPOSALS_EDIT = 'ORG_PROPOSALS_EDIT',
	ORG_PROPOSAL_TEMPLATES_VIEW = 'ORG_PROPOSAL_TEMPLATES_VIEW',
	ORG_PROPOSAL_TEMPLATES_EDIT = 'ORG_PROPOSAL_TEMPLATES_EDIT',
	ORG_TIME_OFF_VIEW = 'ORG_TIME_OFF_VIEW',
	ORG_EMPLOYEES_VIEW = 'ORG_EMPLOYEES_VIEW',
	ORG_EMPLOYEES_EDIT = 'ORG_EMPLOYEES_EDIT',
	ORG_CANDIDATES_VIEW = 'ORG_CANDIDATES_VIEW',
	ORG_CANDIDATES_EDIT = 'ORG_CANDIDATES_EDIT',
	ORG_CANDIDATES_INTERVIEW_EDIT = 'ORG_CANDIDATES_INTERVIEW_EDIT',
	ORG_CANDIDATES_DOCUMENTS_VIEW = 'ORG_CANDIDATES_DOCUMENTS_VIEW',
	ORG_CANDIDATES_TASK_EDIT = 'ORG_CANDIDATES_TASK_EDIT',
	ORG_CANDIDATES_FEEDBACK_EDIT = 'ORG_CANDIDATES_FEEDBACK_EDIT',
	ORG_INVENTORY_PRODUCT_EDIT = 'ORG_INVENTORY_PRODUCT_EDIT',
	ORG_INVENTORY_VIEW = 'ORG_INVENTORY_VIEW',
	ORG_TAGS_EDIT = 'ORG_TAGS_EDIT',
	ORG_USERS_VIEW = 'ORG_USERS_VIEW',
	ORG_USERS_EDIT = 'ORG_USERS_EDIT',
	ORG_INVITE_VIEW = 'ORG_INVITE_VIEW',
	ORG_INVITE_EDIT = 'ORG_INVITE_EDIT',
	ALL_ORG_VIEW = 'ALL_ORG_VIEW',
	ALL_ORG_EDIT = 'ALL_ORG_EDIT',
	POLICY_VIEW = 'POLICY_VIEW',
	POLICY_EDIT = 'POLICY_EDIT',
	TIME_OFF_EDIT = 'TIME_OFF_EDIT',
	REQUEST_APPROVAL_VIEW = 'REQUEST_APPROVAL_VIEW',
	REQUEST_APPROVAL_EDIT = 'REQUEST_APPROVAL_EDIT',
	APPROVAL_POLICY_VIEW = 'APPROVALS_POLICY_VIEW',
	APPROVAL_POLICY_EDIT = 'APPROVALS_POLICY_EDIT',
	CHANGE_SELECTED_EMPLOYEE = 'CHANGE_SELECTED_EMPLOYEE',
	CHANGE_SELECTED_CANDIDATE = 'CHANGE_SELECTED_CANDIDATE',
	CHANGE_SELECTED_ORGANIZATION = 'CHANGE_SELECTED_ORGANIZATION',
	CHANGE_ROLES_PERMISSIONS = 'CHANGE_ROLES_PERMISSIONS',
	ACCESS_PRIVATE_PROJECTS = 'ACCESS_PRIVATE_PROJECTS',
	TIMESHEET_EDIT_TIME = 'TIMESHEET_EDIT_TIME',
	SUPER_ADMIN_EDIT = 'SUPER_ADMIN_EDIT',
	PUBLIC_PAGE_EDIT = 'PUBLIC_PAGE_EDIT',
	INVOICES_VIEW = 'INVOICES_VIEW',
	INVOICES_EDIT = 'INVOICES_EDIT',
	ESTIMATES_VIEW = 'ESTIMATES_VIEW',
	ESTIMATES_EDIT = 'ESTIMATES_EDIT',
	ORG_CANDIDATES_INTERVIEWERS_EDIT = 'ORG_CANDIDATES_INTERVIEWERS_EDIT',
	PROPOSALS_EDIT = 'PROPOSALS_EDIT',
	VIEW_ALL_EMAILS = 'VIEW_ALL_EMAILS',
	VIEW_ALL_EMAIL_TEMPLATES = 'VIEW_ALL_EMAIL_TEMPLATES',
	ORG_HELP_CENTER_EDIT = 'ORG_HELP_CENTER_EDIT',
	VIEW_SALES_PIPELINES = 'VIEW_SALES_PIPELINES',
	EDIT_SALES_PIPELINES = 'EDIT_SALES_PIPELINES',
	CAN_APPROVE_TIMESHEET = 'CAN_APPROVE_TIMESHEET',
	ORG_SPRINT_VIEW = 'ORG_SPRINT_VIEW',
	ORG_SPRINT_EDIT = 'ORG_SPRINT_EDIT',
	ORG_PROJECT_EDIT = 'ORG_PROJECT_EDIT',
	ORG_CONTACT_EDIT = 'ORG_CONTACT_EDIT',
	ORG_CONTACT_VIEW = 'ORG_CONTACT_VIEW',
	ORG_TEAM_EDIT = 'ORG_TEAM_EDIT',
	ORG_CONTRACT_EDIT = 'ORG_CONTRACT_EDIT',
	EVENT_TYPES_VIEW = 'EVENT_TYPES_VIEW',
	TIME_TRACKER = 'TIME_TRACKER',
	TENANT_ADD_EXISTING_USER = 'TENANT_ADD_EXISTING_USER',
	INTEGRATION_VIEW = 'INTEGRATION_VIEW',
	FILE_STORAGE_VIEW = 'FILE_STORAGE_VIEW',
	PAYMENT_GATEWAY_VIEW = 'PAYMENT_GATEWAY_VIEW',
	SMS_GATEWAY_VIEW = 'SMS_GATEWAY_VIEW',
	CUSTOM_SMTP_VIEW = 'CUSTOM_SMTP_VIEW',
	IMPORT_EXPORT_VIEW = 'IMPORT_EXPORT_VIEW',
	ORG_JOB_EMPLOYEE_VIEW = 'ORG_JOB_EMPLOYEE_VIEW',
	ORG_JOB_MATCHING_VIEW = 'ORG_JOB_MATCHING_VIEW',
	INVENTORY_GALLERY_VIEW = 'INVENTORY_GALLERY_VIEW',
	INVENTORY_GALLERY_EDIT = 'INVENTORY_GALLERY_EDIT'
}

export const PermissionGroups = {
	//Permissions which can be given to any role
	GENERAL: [
		PermissionsEnum.ADMIN_DASHBOARD_VIEW,
		PermissionsEnum.ORG_PAYMENT_VIEW,
		PermissionsEnum.ORG_PAYMENT_ADD_EDIT,
		PermissionsEnum.ORG_EXPENSES_VIEW,
		PermissionsEnum.ORG_EXPENSES_EDIT,
		PermissionsEnum.EMPLOYEE_EXPENSES_VIEW,
		PermissionsEnum.EMPLOYEE_EXPENSES_EDIT,
		PermissionsEnum.ORG_INCOMES_EDIT,
		PermissionsEnum.ORG_INCOMES_VIEW,
		PermissionsEnum.ORG_PROPOSALS_EDIT,
		PermissionsEnum.ORG_PROPOSALS_VIEW,
		PermissionsEnum.ORG_PROPOSAL_TEMPLATES_VIEW,
		PermissionsEnum.ORG_PROPOSAL_TEMPLATES_EDIT,
		PermissionsEnum.ORG_TIME_OFF_VIEW,
		PermissionsEnum.ORG_INVITE_VIEW,
		PermissionsEnum.ORG_INVITE_EDIT,
		PermissionsEnum.POLICY_VIEW,
		PermissionsEnum.POLICY_EDIT,
		PermissionsEnum.TIME_OFF_EDIT,
		PermissionsEnum.APPROVAL_POLICY_EDIT,
		PermissionsEnum.APPROVAL_POLICY_VIEW,
		PermissionsEnum.REQUEST_APPROVAL_EDIT,
		PermissionsEnum.REQUEST_APPROVAL_VIEW,
		PermissionsEnum.ACCESS_PRIVATE_PROJECTS,
		PermissionsEnum.TIMESHEET_EDIT_TIME,
		PermissionsEnum.INVOICES_VIEW,
		PermissionsEnum.INVOICES_EDIT,
		PermissionsEnum.ESTIMATES_VIEW,
		PermissionsEnum.ESTIMATES_EDIT,
		PermissionsEnum.ORG_CANDIDATES_DOCUMENTS_VIEW,
		PermissionsEnum.ORG_CANDIDATES_TASK_EDIT,
		PermissionsEnum.ORG_CANDIDATES_INTERVIEW_EDIT,
		PermissionsEnum.ORG_CANDIDATES_INTERVIEWERS_EDIT,
		PermissionsEnum.ORG_CANDIDATES_FEEDBACK_EDIT,
		PermissionsEnum.ORG_INVENTORY_VIEW,
		PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
		PermissionsEnum.ORG_TAGS_EDIT,
		PermissionsEnum.VIEW_ALL_EMAILS,
		PermissionsEnum.VIEW_ALL_EMAIL_TEMPLATES,
		PermissionsEnum.ORG_HELP_CENTER_EDIT,
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
		PermissionsEnum.INVENTORY_GALLERY_VIEW,
		PermissionsEnum.INVENTORY_GALLERY_EDIT
	],

	//Readonly permissions, are only enabled for admin role
	ADMINISTRATION: [
		PermissionsEnum.ORG_EMPLOYEES_VIEW,
		PermissionsEnum.ORG_EMPLOYEES_EDIT,
		PermissionsEnum.ORG_CANDIDATES_VIEW,
		PermissionsEnum.ORG_CANDIDATES_EDIT,
		PermissionsEnum.ORG_USERS_VIEW,
		PermissionsEnum.ORG_USERS_EDIT,
		PermissionsEnum.ALL_ORG_VIEW,
		PermissionsEnum.ALL_ORG_EDIT,
		PermissionsEnum.CHANGE_SELECTED_EMPLOYEE,
		PermissionsEnum.CHANGE_SELECTED_CANDIDATE,
		PermissionsEnum.CHANGE_SELECTED_ORGANIZATION,
		PermissionsEnum.CHANGE_ROLES_PERMISSIONS,
		PermissionsEnum.SUPER_ADMIN_EDIT,
		PermissionsEnum.PUBLIC_PAGE_EDIT,
		PermissionsEnum.ORG_INVENTORY_VIEW,
		PermissionsEnum.ORG_INVENTORY_PRODUCT_EDIT,
		PermissionsEnum.APPROVAL_POLICY_EDIT,
		PermissionsEnum.APPROVAL_POLICY_VIEW,
		PermissionsEnum.TIME_OFF_EDIT,
		PermissionsEnum.REQUEST_APPROVAL_EDIT,
		PermissionsEnum.REQUEST_APPROVAL_VIEW,
		PermissionsEnum.TENANT_ADD_EXISTING_USER,
		PermissionsEnum.INTEGRATION_VIEW,
		PermissionsEnum.FILE_STORAGE_VIEW,
		PermissionsEnum.PAYMENT_GATEWAY_VIEW,
		PermissionsEnum.SMS_GATEWAY_VIEW,
		PermissionsEnum.CUSTOM_SMTP_VIEW,
		PermissionsEnum.IMPORT_EXPORT_VIEW,
		PermissionsEnum.ORG_JOB_EMPLOYEE_VIEW,
		PermissionsEnum.ORG_JOB_MATCHING_VIEW,
		PermissionsEnum.INVENTORY_GALLERY_VIEW,
		PermissionsEnum.INVENTORY_GALLERY_EDIT
	]
};
