// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta

import { IRole } from './role.model';
import { IBasePerTenantEntityModel } from './base-entity.model';
import { ITag } from './tag-entity.model';
import { IEmployee } from './employee.model';
import { IPayment } from './payment.model';

export interface IUser extends IBasePerTenantEntityModel {
	thirdPartyId?: string;
	name?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	hash?: string;
	imageUrl?: string;
	employee?: IEmployee;
	employeeId?: string;
	tags?: ITag[];
	preferredLanguage?: string;
	payments?: IPayment[];
	paymentsId?: string;
	preferredComponentLayout?: string;
}

export interface IUserFindInput {
	thirdPartyId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	hash?: string;
	imageUrl?: string;
	tags?: ITag[];
	preferredLanguage?: LanguagesEnum;
}

export interface IUserRegistrationInput {
	user: IUser;
	password?: string;
	originalUrl?: string;
	organizationId?: string;
	createdById?: string;
}

export interface IUserCreateInput {
	firstName?: string;
	lastName?: string;
	email?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	hash?: string;
	imageUrl?: string;
	tags?: ITag[];
	preferredLanguage?: LanguagesEnum;
	preferredComponentLayout?: ComponentLayoutStyleEnum;
}

export interface IUserUpdateInput {
	firstName?: string;
	lastName?: string;
	email?: string;
	username?: string;
	role?: IRole;
	roleId?: string;
	hash?: string;
	imageUrl?: string;
	tags?: ITag[];
	preferredLanguage?: LanguagesEnum;
	preferredComponentLayout?: ComponentLayoutStyleEnum;
}

export enum LanguagesEnum {
	ENGLISH = 'en',
	BULGARIAN = 'bg',
	HEBREW = 'he',
	RUSSIAN = 'ru'
}

export enum ComponentLayoutStyleEnum {
	CARDS_GRID = 'CARDS_GRID',
	TABLE = 'TABLE',
	SPRINT_VIEW = 'SPRINT_VIEW'
}
