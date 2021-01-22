import {
	IOrganizationDepartment,
	ITag,
	IEmployee,
	ICandidate,
	DeepPartial
} from '@gauzy/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import {
	Candidate,
	Employee,
	Tag,
	TenantOrganizationBaseEntity
} from '../internal';

@Entity('organization_department')
export class OrganizationDepartment
	extends TenantOrganizationBaseEntity
	implements IOrganizationDepartment {
	constructor(input?: DeepPartial<OrganizationDepartment>) {
		super(input);
	}

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column()
	name: string;

	@ApiProperty()
	@ManyToMany(() => Tag, (tag) => tag.organizationDepartment)
	@JoinTable({
		name: 'tag_organization_department'
	})
	tags: ITag[];

	@ManyToMany(
		() => Employee,
		(employee) => employee.organizationDepartments,
		{
			cascade: ['update']
		}
	)
	@JoinTable({
		name: 'organization_department_employee'
	})
	members?: IEmployee[];

	@ManyToMany(
		() => Candidate,
		(candidate) => candidate.organizationDepartments,
		{
			cascade: ['update']
		}
	)
	@JoinTable({
		name: 'candidate_department'
	})
	candidates?: ICandidate[];
}
