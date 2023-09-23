import { ICommand } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { IIntegrationTenant, } from '@gauzy/contracts';
import { IntegrationTenant } from './../integration-tenant.entity';

export class IntegrationTenantUpdateOrCreateCommand implements ICommand {
	static readonly type = '[Update Or Create] Integration Tenant';

	constructor(
		public readonly options: FindOptionsWhere<IntegrationTenant>,
		public readonly input: IIntegrationTenant
	) { }
}
