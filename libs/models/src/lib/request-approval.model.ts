import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { RequestApprovalEmployee } from './request-approval-employee.model';
import { Employee } from './employee.model';
import { OrganizationTeam } from './organization-team-model';
import { RequestApprovalTeam } from './request-approval-team.model';
import { ApprovalPolicy } from './approval-policy.model';
import { Tag } from './tag-entity.model';

export interface RequestApproval extends IBaseEntityModel {
	employeeApprovals?: RequestApprovalEmployee[];
	teamApprovals?: RequestApprovalTeam[];
	employees?: Employee[];
	teams?: OrganizationTeam[];
	name?: string;
	min_count?: number;
	status?: number;
	approvalPolicyId?: string;
	approvalPolicy?: ApprovalPolicy;
	tags?: Tag[];
}

export interface RequestApprovalCreateInput extends IBaseEntityModel {
	employeeApprovals?: RequestApprovalEmployee[];
	teamApprovals?: RequestApprovalTeam[];
	teams?: OrganizationTeam[];
	employees?: Employee[];
	name?: string;
	min_count?: number;
	status?: number;
	approvalPolicyId?: string;
	tags?: Tag[];
}

export enum RequestApprovalStatusTypesEnum {
	REQUESTED = 1,
	APPROVED = 2,
	REFUSED = 3
}

export const RequestApprovalStatus = {
	REQUESTED: 1,
	APPROVED: 2,
	REFUSED: 3
};
