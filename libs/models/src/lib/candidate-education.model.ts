import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { Organization } from './organization.model';
import { ITenant } from './tenant.model';
export interface IEducation extends IBaseEntityModel {
	schoolName: string;
	degree: string;
	completionDate: Date;
	field: string;
	notes?: string;
	candidateId?: string;
  organization?: Organization;
  tenant: ITenant;
}
export interface IEducationFindInput extends IBaseEntityModel {
	schoolName?: string;
	degree?: string;
	completionDate?: Date;
	field?: string;
	notes?: string;
	candidateId?: string;
}

export interface IEducationCreateInput {
	schoolName: string;
	degree: string;
	completionDate: Date;
	field: string;
	notes?: string;
	candidateId?: string;
}
