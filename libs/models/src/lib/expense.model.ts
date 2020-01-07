import { Employee, EmployeeFindInput } from './employee.model';
import { Organization, OrganizationFindInput } from './organization.model';
import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';

export interface Expense extends IBaseEntityModel {
	employee?: Employee;
	employeeId?: string;
	organization: Organization;
	orgId: string;
	amount: number;
	vendorName: string;
	vendorId?: string;
	categoryName: string;
	categoryId?: string;
	clientId?: string;
	clientName?: string;
	projectId?: string;
	projectName?: string;
	notes?: string;
	valueDate?: Date;
	currency: string;
	purpose?: string;
	taxType?: string;
	taxLabel?: string;
	rateValue?: number;
}

export interface ExpenseCreateInput {
	employeeId?: string;
	amount: number;
	vendorName: string;
	vendorId: string;
	categoryName: string;
	categoryId: string;
	clientId?: string;
	clientName?: string;
	projectId?: string;
	projectName?: string;
	notes?: string;
	valueDate: Date;
	currency?: string;
	orgId?: string;
	purpose?: string;
	taxType?: string;
	taxLabel?: string;
	rateValue?: number;
}

export interface ExpenseFindInput extends IBaseEntityModel {
	employee?: EmployeeFindInput;
	organization?: OrganizationFindInput;
	vendorName?: string;
	vendorId?: string;
	categoryName?: string;
	categoryId?: string;
	amount?: number;
	clientId?: string;
	clientName?: string;
	projectId?: string;
	projectName?: string;
	notes?: string;
	valueDate?: Date;
	currency?: string;
	purpose?: string;
	taxType?: string;
	taxLabel?: string;
	rateValue?: number;
}

export interface ExpenseUpdateInput {
	employeeId?: string;
	orgId?: string;
	amount?: number;
	vendorName?: string;
	vendorId?: string;
	categoryName?: string;
	categoryId?: string;
	clientId?: string;
	clientName?: string;
	projectId?: string;
	projectName?: string;
	notes?: string;
	valueDate?: Date;
	currency?: string;
	purpose?: string;
	taxType?: string;
	taxLabel?: string;
	rateValue?: number;
}

export enum TaxTypesEnum {
	PERCENTAGE = 'Percentage',
	VALUE = 'Value'
}
