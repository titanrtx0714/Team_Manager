import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';

export interface Goals extends IBaseEntityModel {
	name: string;
	description?: string;
	owner: string;
	lead: string;
	deadline: string;
	type: string;
	progress: number;
	organizationId: string;
	keyResults?: Array<KeyResult>;
}

export interface KeyResult extends IBaseEntityModel {
	id?: string;
	name: string;
	description?: string;
	type: string;
	targetValue?: number;
	initialValue?: number;
	update: number | Boolean;
	progress: number;
	owner: string;
	lead?: string;
	deadline: string;
	hardDeadline?: Date;
	softDeadline?: Date;
	status?: string;
	goal_id?: string;
	goal?: Goals;
	updates?: Array<KeyResultUpdates>;
}

export interface KeyResultUpdates extends IBaseEntityModel {
	id?: string;
	keyresult_id?: string;
	owner: string;
	progress: number;
	update: number | Boolean;
	status?: string;
}

export interface GetKeyResultOptions {
	goal_id?: string;
}
