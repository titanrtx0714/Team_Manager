import { Employee, EmployeeFindInput } from './employee.model';
import { Organization, OrganizationFindInput } from './organization.model';
import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { Tag } from './tag-entity.model';

export interface Income extends IBaseEntityModel {
	employee?: Employee;
	employeeId?: string;
	organization: Organization;
	organizationId: string
	amount: number;
	clientId?: string;
	clientName: string;
	currency: string;
	valueDate?: Date;
	notes?: string;
	isBonus?: boolean;
	tags: Tag[];
}

export interface IncomeCreateInput {
	amount: number;
	clientName: string;
	clientId: string;
	valueDate: Date;
	currency?: string;
	employeeId?: string;
	notes?: string;
  organizationId?: string;
	isBonus?: boolean;
	reference?: string;
	tags: Tag[];
}

export interface IncomeUpdateInput {
	amount?: number;
	clientName?: string;
	clientId?: string;
	valueDate?: Date;
	employeeId?: string;
	currency?: string;
	notes?: string;
	isBonus?: boolean;
	tags: Tag[];
}

export interface IncomeFindInput extends IBaseEntityModel {
	employee?: EmployeeFindInput;
	organization?: OrganizationFindInput;
	amount?: number;
	isBonus?: boolean;
	clientId?: string;
	clientName?: string;
	valueDate?: Date;
	currency?: string;
}

export enum IncomeTypeEnum {
	HOURLY = 'Hourly'
}
