import { Controller, UseGuards } from '@nestjs/common';
import { CrudController } from '../core';
import { IntegrationMapService } from './integration-map.service';
import { IntegrationMap } from './integration-map.entity';
import { AuthGuard } from '@nestjs/passport';
import { TenantPermissionGuard } from '../shared/guards/auth/tenant-permission.guard';

@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class IntegrationMapController extends CrudController<IntegrationMap> {
	constructor(private integrationMapService: IntegrationMapService) {
		super(integrationMapService);
	}
}
