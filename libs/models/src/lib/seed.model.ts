import { ICandidateSource } from '@gauzy/models';
import { CurrenciesEnum, DefaultValueDateTypeEnum, User } from '..';

export interface IDefaultUser {
	email: string;
	password: string;
	imageUrl: string;
	firstName?: string;
	lastName?: string;
}

export interface IDefaultEmployee extends IDefaultUser {	
	startedWorkOn?: string;
	endWork?: string;
	employeeLevel?: string;
}

export interface IDefaultCandidate extends IDefaultUser {	
	candidateLevel?: string;
	source?: ICandidateSource;
}

export interface IDefaultOrganization {
	name: string;
	currency: CurrenciesEnum;
	defaultValueDateType: DefaultValueDateTypeEnum;
	imageUrl: string;
}

export interface ISeedUsers {
	adminUsers: User[];
	employeeUsers: User[];
	candidateUsers: User[];
}
