import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';
import { JobPostSourceEnum } from './employee-job.model';
import { IEmployee } from './employee.model';
import { JobSearchCategory } from './job-search-category.model';
import { JobSearchOccupation } from './job-search-occupation.model';

export interface JobMatchings {
	employeeId?: string;
	jobSource?: string;
	preset?: string;
	criterions?: MatchingCriterions[];
}

export interface MatchingCriterions
	extends EmployeeUpworkJobsSearchCriterion,
		JobPresetUpworkJobSearchCriterion {}

export interface JobPreset extends IBasePerTenantAndOrganizationEntityModel {
	name?: string;
	employees?: Partial<IEmployee>[];
	employeeCriterions?: EmployeeUpworkJobsSearchCriterion[];
	jobPresetCriterions?: JobPresetUpworkJobSearchCriterion[];
}

export interface EmployeePresetInput {
	jobPresetIds?: string[];
	source?: JobPostSourceEnum;
	employeeId?: string;
}

export interface GetJobPresetInput {
	search?: string;
	organizationId?: string;
	employeeId?: string;
}

export interface EmployeeJobPreset
	extends IBasePerTenantAndOrganizationEntityModel {
	jobPresetId?: string;
	jobPreset?: JobPreset;
	employeeId?: string;
	employee?: IEmployee;
}

export interface GetJobPresetCriterionInput {
	presetId?: string;
	employeeId?: string;
}

export interface JobPresetUpworkJobSearchCriterion
	extends IBasePerTenantAndOrganizationEntityModel {
	jobPresetId?: string;
	jobPreset?: JobPreset;
	jobSearchOccupationId?: string; // TODO: rename to occupationId
	jobSearchOccupation?: JobSearchOccupation; // TODO: rename to occupation
	jobSearchCategoryId?: string; // TODO: rename to categoryId
	jobSearchCategory?: JobSearchCategory; // TODO: rename to category
	keyword?: string;
	hourly?: boolean; // TODO: replace with jobType
	fixPrice?: boolean; // TODO: replace with jobType
}

export interface EmployeeUpworkJobsSearchCriterion
	extends IBasePerTenantAndOrganizationEntityModel {
	employeeId?: string;
	employee?: IEmployee;
	jobPresetId?: string;
	jobPreset?: JobPreset;
	jobSearchOccupationId?: string; // TODO: rename to occupationId
	jobSearchOccupation?: JobSearchOccupation; // TODO: rename to occupation
	jobSearchCategoryId?: string; // TODO: rename to categoryId
	jobSearchCategory?: JobSearchCategory; // TODO: rename to category
	keyword?: string;
	hourly?: boolean; // TODO: replace with jobType
	fixPrice?: boolean; // TODO: replace with jobType
}

// Below entities are used in Sync with Gauzy AI

// export interface IEmployeeUpworkJobsSearchCriterion {
// 	category?: string;
// 	categoryId?: string;
// 	occupation?: string;
// 	occupationId?: string;
// 	jobType: string;
// 	keyword: string;
// }
