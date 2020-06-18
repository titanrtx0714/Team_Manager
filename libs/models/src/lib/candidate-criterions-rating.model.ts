import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';

export interface ICandidateCriterionsRating extends IBaseEntityModel {
	rating: number;
	technologyId?: string;
	personalQualityId?: string;
	feedbackId?: string;
}

export interface ICandidateCriterionsRatingFindInput extends IBaseEntityModel {
	rating?: number;
	technologyId?: string;
	personalQualityId?: string;
	feedbackId?: string;
}

export interface ICandidateCriterionsRatingCreateInput {
	rating: number;
	technologyId?: string;
	personalQualityId?: string;
	feedbackId?: string;
}
