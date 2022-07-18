import { IQuery } from '@nestjs/cqrs';
import { FindConditions } from 'typeorm';
import { Employee, Organization } from '../../../core/entities/internal';

export class FindOnePublicEmployeeQuery implements IQuery {

	constructor(
		public readonly params: FindConditions<Organization>,
		public readonly options: FindConditions<Employee>,
	) {}
}