import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Feature } from './feature.entity';
import { CrudService } from '../core/crud/crud.service';
import {
	IFeature,
	IFeatureOrganization,
	IFeatureOrganizationUpdateInput,
	IPagination
} from '@gauzy/models';
import { FeatureOrganization } from './feature_organization.entity';

@Injectable()
export class FeatureService extends CrudService<Feature> {
	constructor(
		@InjectRepository(Feature)
		public readonly featureRepository: Repository<Feature>,

		@InjectRepository(FeatureOrganization)
		public readonly featureOrganizationRepository: Repository<FeatureOrganization>
	) {
		super(featureRepository);
	}

	async getParentFeatureList(request: any): Promise<IPagination<IFeature>> {
		const { relations = [] } = request;
		return await this.findAll({
			where: {
				parentId: IsNull()
			},
			relations,
			order: {
				createdAt: 'ASC'
			}
		});
	}

	async getAllFeatureList(): Promise<IPagination<IFeature>> {
		return await this.findAll({
			order: {
				createdAt: 'ASC'
			}
		});
	}

	async getFeatureOrganizations(data: any): Promise<IFeatureOrganization[]> {
		const { relations = [], findInput = {} } = data;
		return await this.featureOrganizationRepository.find({
			where: findInput,
			relations
		});
	}

	async updateFeatureOrganization(
		input: IFeatureOrganizationUpdateInput
	): Promise<IFeatureOrganization> {
		const { featureId, tenantId, organizationId } = input;
		const where = {
			featureId,
			tenantId
		};
		if (organizationId) {
			where['organizationId'] = organizationId;
		}

		let featureOrganization = await this.featureOrganizationRepository.findOne(
			{
				where
			}
		);

		if (!featureOrganization) {
			featureOrganization = new FeatureOrganization(input);
		} else {
			featureOrganization = new FeatureOrganization(
				Object.assign(featureOrganization, input)
			);
		}

		return this.featureOrganizationRepository.save(featureOrganization);
	}
}
