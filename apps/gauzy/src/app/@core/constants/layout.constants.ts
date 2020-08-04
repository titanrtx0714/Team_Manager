import { ComponentLayoutStyleEnum } from '@gauzy/models';

export enum ComponentEnum {
	ALL_TASKS = 'ALL_TASKS',
	MY_TASKS = 'MY_TASKS',
	TEAM_TASKS = 'TEAM_TASKS',
	ESTIMATES = 'ESTIMATES',
	INCOME = 'INCOME',
	EXPENSES = 'EXPENSES',
	PROPOSALS = 'PROPOSALS',
	PIPELINES = 'PIPELINES',
	PAYMENTS = 'PAYMENTS',
	MANAGE_INVITES = 'MANAGE_INVITES',
	EMPLOYEES = 'EMPLOYEES',
	EVENT_TYPES = 'EVENT_TYPES',
	CANDIDATES = 'CANDIDATES',
	APPROVALS = 'APPROVALS',
	INVENTORY = 'INVENTORY',
	TAGS = 'TAGS',
	GOAL_SETTINGS = 'GOAL_SETTINGS',
	USERS = 'USERS',
	ORGANIZATION = 'ORGANIZATION',
	EQUIPMENT = 'EQUIPMENT',
	INVOICE_RECEIVED = 'INVOICE_RECEIVED',
	EQUIPMENT_SHARING = 'EQUIPMENT_SHARING',
	EQUIPMENT_SHARING_POLICY = 'EQUIPMENT_SHARING_POLICY',
	APPROVAL_POLICY = 'APPROVAL_POLICY',
	PRODUCT_CATEGORY = 'PRODUCT_CATEGORY',
	PRODUCT_TYPE = 'PRODUCT_TYPE',
	PIPELINE_DEALS = 'PIPELINE_DEALS',
	TIME_OFF = 'TIME_OFF',
	TIME_OFF_SETTINGS = 'TIME_OFF_SETTINGS'
}

export const SYSTEM_DEFAULT_LAYOUT = ComponentLayoutStyleEnum.TABLE;
