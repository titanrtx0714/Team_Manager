import { IBaseEntityModel } from './base-entity.model';

export interface IEmailReset
	extends IBaseEntityModel {
	email: string;
	oldEmail: string;
	token: string;
	code: number;
	expired?: boolean;
	userId?: string;
}

export interface IEmailResetFindInput
	extends IBaseEntityModel {
	email?: string;
	oldEmail?: string;
	token?: string;
	code?: number;
}

export interface IChangeEmailRequest { 
	token: string;
	code: number;
}

export interface IResetEmailRequest {
	email: string;
	oldEmail: string;
}
