import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { Organization } from './organization.model';
import { ITenant } from './tenant.model';

export interface ICandidateTechnologies extends IBaseEntityModel {
	name: string;
	interviewId?: string;
	rating?: number;
  organization?: Organization;
  tenant: ITenant;
	// rating?: ICandidateCriterionsRating;
}

export interface ICandidateTechnologiesFindInput extends IBaseEntityModel {
	name?: string;
	interviewId?: string;
	rating?: number;
}

export interface ICandidateTechnologiesCreateInput {
	name: string;
	interviewId?: string;
	rating?: number;
}
