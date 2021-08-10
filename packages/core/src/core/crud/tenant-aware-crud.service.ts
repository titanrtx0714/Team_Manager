import { NotFoundException } from '@nestjs/common';
import {
	DeepPartial,
	DeleteResult,
	FindConditions,
	FindManyOptions,
	FindOneOptions,
	ObjectLiteral,
	Repository
} from 'typeorm';
import { IPagination } from '@gauzy/contracts';
import { User } from '../../user/user.entity';
import { RequestContext } from '../context';
import { TenantBaseEntity } from '../entities/internal';
import { CrudService } from './crud.service';
import { ICrudService } from './icrud.service';
import { ITryRequest } from './try-request';

/**
 * This abstract class adds tenantId to all query filters if a user is available in the current RequestContext
 * If a user is not available in RequestContext, then it behaves exactly the same as CrudService
 */
export abstract class TenantAwareCrudService<T extends TenantBaseEntity>
	extends CrudService<T>
	implements ICrudService<T> {
	protected constructor(protected readonly repository: Repository<T>) {
		super(repository);
	}

	private findConditionsWithTenant(
		user: User,
		where?: FindConditions<T> | ObjectLiteral | FindConditions<T>[]
	): FindConditions<T> | ObjectLiteral | FindConditions<T>[] {
		if (Array.isArray(where)) {
			return where.map((options) => ({
				...options,
				tenant: {
					id: user.tenantId
				}
			}));
		}

		return where
			? {
					...where,
					tenant: {
						id: user.tenantId
					}
			  }
			: {
					tenant: {
						id: user.tenantId
					}
			  };
	}

	private findManyWithTenant(
		filter?: FindManyOptions<T>
	): FindManyOptions<T> {
		const user = RequestContext.currentUser();
		if (!user || !user.tenantId) {
			return filter;
		}
		if (!filter) {
			return {
				where: this.findConditionsWithTenant(user)
			};
		}
		if (!filter.where) {
			return {
				...filter,
				where: this.findConditionsWithTenant(user)
			};
		}
		if (filter.where instanceof Object) {
			return {
				...filter,
				where: this.findConditionsWithTenant(user, filter.where)
			};
		}
		return filter;
	}

	public async count(filter?: FindManyOptions<T>): Promise<number> {
		return await super.count(this.findManyWithTenant(filter));
	}

	public async findAll(filter?: FindManyOptions<T>): Promise<IPagination<T>> {
		return await super.findAll(this.findManyWithTenant(filter));
	}

	public async findOneOrFail(
		id: string | number | FindOneOptions<T> | FindConditions<T>,
		options?: FindOneOptions<T>
	): Promise<ITryRequest> {
		return await super.findOneOrFail(id, this.findManyWithTenant(options));
	}

	public async findOne(
		id: string | number | FindOneOptions<T> | FindConditions<T>,
		options?: FindOneOptions<T>
	): Promise<T> {
		if (typeof id === 'object') {
			const firstOptions = id as FindOneOptions<T>;
			return await super.findOne(
				this.findManyWithTenant(firstOptions),
				options
			);
		}

		return await super.findOne(id, this.findManyWithTenant(options));
	}

	public async create(entity: DeepPartial<T>, ...options: any[]): Promise<T> {
		const tenantId = RequestContext.currentTenantId();
		if (tenantId) {
			const entityWithTenant = {
				...entity,
				tenant: { id: tenantId }
			};
			return super.create(entityWithTenant, ...options);
		}
		return super.create(entity, ...options);
	}

	/**
	 * DELETE source related to tenant
	 * 
	 * @param criteria 
	 * @param options 
	 * @returns 
	 */
	public async delete(
		criteria: string | number | FindConditions<T>,
		options?: FindOneOptions<T>
	): Promise<DeleteResult> {
		try {
			const record = await this.findOne(criteria, options);
			if (!record) {
				throw new NotFoundException(`The requested record was not found`);
			}
			return await super.delete(criteria);
		} catch (err) {
			throw new NotFoundException(`The record was not found`, err);
		}
	}
}
