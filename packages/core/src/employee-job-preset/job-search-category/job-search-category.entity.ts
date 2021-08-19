import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
	JobPostSourceEnum,
	IJobPreset,
	IEmployeeUpworkJobsSearchCriterion,
	IJobPresetUpworkJobSearchCriterion
} from '@gauzy/contracts';
import {
	EmployeeUpworkJobsSearchCriterion,
	JobPresetUpworkJobSearchCriterion,
	TenantOrganizationBaseEntity
} from '../../core/entities/internal';

@Entity('job_search_category')
export class JobSearchCategory
	extends TenantOrganizationBaseEntity
	implements IJobPreset {
	@ApiProperty({ type: () => String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column()
	name?: string;

	// Id of category in the job source (e.g. Upwork)
	@ApiProperty({ type: () => String })
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	jobSourceCategoryId?: string;

	@ApiProperty({ type: () => String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column({ type: 'text', default: JobPostSourceEnum.UPWORK })
	jobSource?: JobPostSourceEnum;

	/*
    |--------------------------------------------------------------------------
    | @OneToMany 
    |--------------------------------------------------------------------------
    */

	/**
	 * EmployeeUpworkJobsSearchCriterion
	 */
	@ApiProperty({ type: () => EmployeeUpworkJobsSearchCriterion, isArray: true })
	@OneToMany(
		() => EmployeeUpworkJobsSearchCriterion,
		(employeeUpworkJobsSearchCriterion) =>
			employeeUpworkJobsSearchCriterion.jobPreset,
		{
			onDelete: 'CASCADE'
		}
	)
	employeeCriterions?: IEmployeeUpworkJobsSearchCriterion[];

	/**
	 * JobPresetUpworkJobSearchCriterion
	 */
	@ApiProperty({ type: () => JobPresetUpworkJobSearchCriterion, isArray: true })
	@OneToMany(
		() => JobPresetUpworkJobSearchCriterion,
		(jobPresetUpworkJobSearchCriterion) =>
			jobPresetUpworkJobSearchCriterion.jobPreset,
		{
			onDelete: 'CASCADE'
		}
	)
	jobPresetCriterions?: IJobPresetUpworkJobSearchCriterion[];
}
