import { Module, HttpModule } from '@nestjs/common';
import { HubstaffService } from './hubstaff.service';
import { HubstaffController } from './hubstaff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '../integration/integration.entity';
import { IntegrationService } from '../integration/integration.service';
import { Tenant, TenantService } from '../tenant';
import { IntegrationSetting } from '../integration-setting/integration-setting.entity';
import { IntegrationSettingService } from '../integration-setting/integration-setting.service';

@Module({
	imports: [
		HttpModule,
		TypeOrmModule.forFeature([Integration, Tenant, IntegrationSetting])
	],
	controllers: [HubstaffController],
	providers: [
		HubstaffService,
		IntegrationService,
		TenantService,
		IntegrationSettingService
	]
})
export class HubstaffModule {}
