import { ICandidateInterview } from './candidate-interview.model';
import { ICandidateFeedback } from './candidate-feedback.model';
import { ICandidateSource } from './candidate-source.model';
import { Organization, OrganizationFindInput } from './organization.model';
import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { UserFindInput, User } from './user.model';
import { OrganizationTeam } from './organization-team-model';
import {
  OrganizationDepartment,
  OrganizationPositions,
  Tag,
  Contact as IContact, ITenant
} from '@gauzy/models';
import { OrganizationEmploymentType } from './organization-employment-type.model';
import { IExperience } from './candidate-experience.model';
import { ISkill } from './candidate-skill.model';
import { IEducation } from './candidate-education.model';
import { ICandidateDocument } from './candidate-document.model';

export interface Candidate extends IBaseEntityModel, IContact {
	user: User;
	userId: string;
	status?: string;
	teams?: OrganizationTeam[];
	organizationDepartments?: OrganizationDepartment[];
	organizationPosition?: OrganizationPositions;
	tags: Tag[];
	appliedDate?: Date;
	hiredDate?: Date;
	rejectDate?: Date;
	candidateLevel?: string;
	organizationEmploymentTypes?: OrganizationEmploymentType[];
	experience?: IExperience[];
	skills?: ISkill[];
	payPeriod?: string;
	billRateValue?: number;
	billRateCurrency?: string;
	reWeeklyLimit?: number;
	documents?: ICandidateDocument[];
	educations?: IEducation[];
	source?: ICandidateSource;
	cvUrl?: string;
	feedbacks?: ICandidateFeedback[];
	rating?: number;
	isArchived?: boolean;
	interview?: ICandidateInterview[];
	contact: IContact;
	organization?: Organization;
	organizationId?: string;
	tenant: ITenant;
	tenantId?: string;
}

export enum CandidateStatus {
	APPLIED = 'APPLIED',
	REJECTED = 'REJECTED',
	HIRED = 'HIRED'
}

export interface CandidateFindInput extends IBaseEntityModel {
	organization: OrganizationFindInput;
	user?: UserFindInput;
	valueDate?: Date;
	organizationId?: string;
}

export interface CandidateUpdateInput {
	payPeriod?: string;
	billRateValue?: number;
	billRateCurrency?: string;
	reWeeklyLimit?: number;
	organizationDepartment?: OrganizationDepartment;
	organizationPosition?: OrganizationPositions;
	appliedDate?: Date;
	hiredDate?: Date;
	rejectDate?: Date;
	cvUrl?: string;
}

export interface CandidateCreateInput {
	user: User;
	organization: Organization;
	password?: string;
	appliedDate?: Date;
	hiredDate?: Date;
	source?: ICandidateSource;
	rejectDate?: Date;
	cvUrl?: string;
	members?: Candidate[];
	tags?: Tag[];
	documents: ICandidateDocument[];
}
export interface CandidateLevel {
	id: string;
	level: string;
	organizationId: string;
}
export interface CandidateLevelInput {
	level: string;
	organizationId: string;
}
