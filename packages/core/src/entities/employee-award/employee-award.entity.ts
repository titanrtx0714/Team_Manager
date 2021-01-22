import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { DeepPartial, IEmployeeAward } from '@gauzy/common';
import { Employee, TenantOrganizationBaseEntity } from '../internal';

@Entity('employee_award')
export class EmployeeAward
	extends TenantOrganizationBaseEntity
	implements IEmployeeAward {
	constructor(input?: DeepPartial<EmployeeAward>) {
		super(input);
	}

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column()
	name: string;

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Column()
	year: string;

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Column()
	employeeId: string;

	@ManyToOne((type) => Employee, (employee) => employee.id)
	employee: Employee;
}
