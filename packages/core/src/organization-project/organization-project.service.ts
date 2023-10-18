import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, IsNull, Repository, WhereExpressionBuilder } from 'typeorm';
import { isNotEmpty } from '@gauzy/common';
import { IEmployee, IOrganization, IOrganizationProject, IOrganizationProjectsFindInput, IPagination } from '@gauzy/contracts';
import { PaginationParams, TenantAwareCrudService } from './../core/crud';
import { RequestContext } from '../core/context';
import { OrganizationProject } from './organization-project.entity';

@Injectable()
export class OrganizationProjectService extends TenantAwareCrudService<OrganizationProject> {
	constructor(
		@InjectRepository(OrganizationProject)
		private readonly organizationProjectRepository: Repository<OrganizationProject>
	) {
		super(organizationProjectRepository);
	}

	/**
	 * Find employee assigned projects
	 *
	 * @param employeeId
	 * @param options
	 * @returns
	 */
	async findByEmployee(
		employeeId: IEmployee['id'],
		options: IOrganizationProjectsFindInput
	): Promise<IOrganizationProject[]> {
		const query = this.organizationProjectRepository.createQueryBuilder(this.alias);
		query.setFindOptions({
			select: {
				id: true,
				name: true,
				imageUrl: true,
				currency: true,
				billing: true,
				public: true,
				owner: true,
				taskListType: true
			}
		});
		query.innerJoin(`${query.alias}.members`, 'member');
		query.leftJoin(`${query.alias}.teams`, 'project_team');
		query.andWhere(
			new Brackets((qb: WhereExpressionBuilder) => {
				const tenantId = RequestContext.currentTenantId();
				const { organizationId, organizationContactId, organizationTeamId } = options;

				qb.andWhere('member.id = :employeeId', { employeeId });
				qb.andWhere(`"${query.alias}"."tenantId" = :tenantId`, { tenantId });
				qb.andWhere(`"${query.alias}"."organizationId" = :organizationId`, { organizationId });

				if (isNotEmpty(organizationContactId)) {
					query.andWhere(`${query.alias}.organizationContactId = :organizationContactId`, {
						organizationContactId
					});
				}

				if (isNotEmpty(organizationTeamId)) {
					query.andWhere(`project_team.id = :organizationTeamId`, {
						organizationTeamId
					});
				}
			})
		);
		return await query.getMany();
	}

	/**
	 * Organization project override find all method
	 *
	 * @param filter
	 * @returns
	 */
	public async findAll(
		options?: PaginationParams<OrganizationProject>
	): Promise<IPagination<OrganizationProject>> {
		if ('where' in options) {
			const { where } = options;
			if (where.organizationContactId === 'null') {
				options.where.organizationContactId = IsNull();
			}
		}
		return await super.findAll(options);
	}

	/**
	 * Organization project override pagination method
	 *
	 * @param filter
	 * @returns
	 */
	public async pagination(
		options?: PaginationParams<OrganizationProject>
	): Promise<IPagination<OrganizationProject>> {
		if ('where' in options) {
			const { where } = options;
			if (where.tags) {
				options.where.tags = {
					id: In(where.tags as string[])
				}
			}
		}
		return await super.paginate(options);
	}

	/**
	 * Retrieves an organization project by its external repository ID.
	 *
	 * @param externalRepositoryId - The unique identifier for the organization project.
	 * @param options - An object containing parameters for the query.
	 *   - organizationId: The unique identifier for the organization.
	 *   - tenantId: The unique identifier for the tenant (optional).
	 * @returns A Promise that resolves to either an IOrganizationProject representing the retrieved project or false if an error occurs during the retrieval process.
	 */
	public async getProjectByRepository(
		externalRepositoryId: IOrganizationProject['externalRepositoryId'], // Adjust the type to match your actual implementation
		options: {
			organizationId: IOrganization['id'];
			tenantId: IOrganization['tenantId'];
		}
	): Promise<IOrganizationProject> {
		const { organizationId } = options;
		const tenantId = RequestContext.currentTenantId() || options.tenantId;

		// Attempt to retrieve the organization project by the provided parameters.
		const project = await this.organizationProjectRepository.findOneByOrFail({
			organizationId,
			tenantId,
			externalRepositoryId
		});
		return project;
	}
}
