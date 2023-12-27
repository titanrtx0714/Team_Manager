import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { EmployeeAppointment } from './employee-appointment.entity';
import { EmployeeAppointmentController } from './employee-appointment.controller';
import { EmployeeAppointmentService } from './employee-appointment.service';
import { CommandHandlers } from './commands/handlers';
import { EmailSendModule } from 'email-send/email-send.module';
import { EmployeeModule } from '../employee/employee.module';
import { OrganizationModule } from '../organization/organization.module';
import { TenantModule } from '../tenant/tenant.module';

@Module({
	imports: [
		RouterModule.register([{ path: '/employee-appointment', module: EmployeeAppointmentModule }]),
		TypeOrmModule.forFeature([EmployeeAppointment]),
		EmailSendModule,
		EmployeeModule,
		OrganizationModule,
		CqrsModule,
		TenantModule
	],
	controllers: [EmployeeAppointmentController],
	providers: [EmployeeAppointmentService, ...CommandHandlers],
	exports: [EmployeeAppointmentService]
})
export class EmployeeAppointmentModule {}
