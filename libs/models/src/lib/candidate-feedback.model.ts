import { ICandidateInterviewers } from './candidate-interviewers.model';
import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { ICandidateCriterionsRating } from './candidate-criterions-rating.model';
import { Organization } from './organization.model';
import { ITenant } from './tenant.model';

export interface ICandidateFeedback extends IBaseEntityModel {
	description: string;
	candidateId?: string;
	rating: number;
	interviewId?: string;
	status?: string;
	interviewer?: ICandidateInterviewers;
	interviewTitle?: string;
	criterionsRating?: ICandidateCriterionsRating[];
  organization?: Organization;
  tenant: ITenant;
}

export interface ICandidateFeedbackFindInput extends IBaseEntityModel {
	description?: string;
	candidateId?: string;
	rating?: number;
	interviewId?: string;
	status?: string;
	interviewer?: ICandidateInterviewers;
	criterionsRating?: ICandidateCriterionsRating[];
}

export interface ICandidateFeedbackCreateInput {
	description: string;
	candidateId?: string;
	rating: number;
	interviewId?: string;
	status?: string;
	interviewer?: ICandidateInterviewers;
	criterionsRating?: ICandidateCriterionsRating[];
}
