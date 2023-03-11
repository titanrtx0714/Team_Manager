import { IBasePerTenantEntityModel } from './base-entity.model';
import { IRelationalUser } from './user.model';

export interface IEmailReset extends IEmailResetCreateInput {
	expiredAt?: Date;
	isExpired?: boolean;
}

export interface IEmailResetFindInput extends Partial<IEmailResetCreateInput> { }

export interface IEmailResetCreateInput extends IBasePerTenantEntityModel, IRelationalUser {
	email: string;
	oldEmail: string;
	code: number;
	token: string;
}
