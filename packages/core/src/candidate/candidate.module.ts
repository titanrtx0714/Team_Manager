import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { EmailSendModule } from './../email-send/email-send.module';
import { AuthModule } from './../auth/auth.module';
import { Candidate } from './candidate.entity';
import { UserOrganizationModule } from '../user-organization/user-organization.module';
import { CommandHandlers } from './commands/handlers';
import { TenantModule } from '../tenant/tenant.module';
import { UserModule } from './../user/user.module';
import { EmployeeModule } from './../employee/employee.module';
import { RoleModule } from './../role/role.module';

@Module({
	imports: [
		RouterModule.register([{ path: '/candidate', module: CandidateModule }]),
		TypeOrmModule.forFeature([Candidate]),
		EmailSendModule,
		CqrsModule,
		UserOrganizationModule,
		TenantModule,
		UserModule,
		EmployeeModule,
		RoleModule,
		AuthModule
	],
	controllers: [CandidateController],
	providers: [CandidateService, ...CommandHandlers],
	exports: [TypeOrmModule, CandidateService]
})
export class CandidateModule {}
