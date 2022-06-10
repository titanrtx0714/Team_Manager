import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { OrganizationDepartment } from './organization-department.entity';
import { TenantAwareCrudService } from './../core/crud';

@Injectable()
export class OrganizationDepartmentService extends TenantAwareCrudService<OrganizationDepartment> {
	constructor(
		@InjectRepository(OrganizationDepartment)
		private readonly organizationDepartmentRepository: Repository<OrganizationDepartment>
	) {
		super(organizationDepartmentRepository);
	}

	async findByEmployee(id: string): Promise<any> {
		return await this.organizationDepartmentRepository
			.createQueryBuilder('organization_department')
			.leftJoin('organization_department.members', 'member')
			.where('member.id = :id', { id })
			.getMany();
	}

	public pagination(filter?: any) {
		if ('filters' in filter) {
			const { filters } = filter;
			if ('name' in filters) {
				const { search } = filters.name;
				filter.where.name = Like(`%${search}%`);
			}
			if ('tags' in filters) {
				const { search } = filters.tags;
				filter.where.tags = Like(`%${search}%`);
			}
			delete filter['filters'];
		}		
		return super.paginate(filter);
	}
}
