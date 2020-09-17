import {
	IEmployeeCreateInput,
	PermissionsEnum,
	LanguagesEnum
} from '@gauzy/models';
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	UseGuards,
	Req
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmployeeCreateCommand, EmployeeBulkCreateCommand } from './commands';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IPagination, getUserDummyImage } from '../core';
import { CrudController } from '../core/crud/crud.controller';
import { Permissions } from '../shared/decorators/permissions';
import { PermissionGuard } from '../shared/guards/auth/permission.guard';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { ParseJsonPipe } from '../shared';
import { I18nLang } from 'nestjs-i18n';
import { ITryRequest } from '../core/crud/try-request';
import { Request } from 'express';

@ApiTags('Employee')
@Controller()
export class EmployeeController extends CrudController<Employee> {
	constructor(
		private readonly employeeService: EmployeeService,
		private readonly commandBus: CommandBus
	) {
		super(employeeService);
	}

	@ApiOperation({ summary: 'Update an existing record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully edited.'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Put(':id')
	@UseGuards(AuthGuard('jwt'))
	async update(
		@Param('id') id: string,
		@Body() entity: Employee
	): Promise<any> {
		//We are using create here because create calls the method save()
		//We need save() to save ManyToMany relations
		try {
			return await this.employeeService.create({
				id,
				...entity
			});
		} catch (error) {
			console.log(error);
			return;
		}
	}

	@ApiOperation({ summary: 'Find all employees in the same tenant.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employees in the tenant',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	@UseGuards(AuthGuard('jwt'))
	async findAllEmployees(
		@Query('data') data: string
	): Promise<IPagination<Employee>> {
		const { relations, findInput } = JSON.parse(data);
		return this.employeeService.findAll({ where: findInput, relations });
	}

	@ApiOperation({
		summary: 'Find all public information employees in the same tenant.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employees in the tenant',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('public')
	/**
	 * TODO: This is a public service, the response should only contain
	 * those fields (columns) of an employee that can be shown to the public
	 */
	async findAllEmployeesPublicData(
		@Query('data') data: string
	): Promise<IPagination<Employee>> {
		const { relations, findInput } = JSON.parse(data);
		return this.employeeService.findAll({ where: findInput, relations });
	}

	@ApiOperation({
		summary: 'Find all public information employee in the same tenant.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee in the tenant',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('public/:id')
	async findEmployeePublicData(
		@Param('id') id: string,
		@Query('data') data: string
	): Promise<Employee> {
		const { relations } = JSON.parse(data);

		return this.employeeService.findOne(id, {
			relations
		});
	}

	@ApiOperation({ summary: 'Find all working employees.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found working employees',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/working')
	@UseGuards(AuthGuard('jwt'))
	async findAllWorkingEmployees(
		@Query('data') data: string
	): Promise<IPagination<Employee>> {
		const {
			organizationId,
			tenantId,
			forMonth = new Date(),
			withUser
		} = JSON.parse(data);
		return this.employeeService.findWorkingEmployees(
			organizationId,
			tenantId,
			new Date(forMonth),
			withUser
		);
	}

	@ApiOperation({ summary: 'Find employee by id in the same tenant.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee in the same tenant',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
	async findById(
		@Param('id') id: string,
		@Query('data', ParseJsonPipe) data?: any
	): Promise<Employee> {
		const { relations = [], useTenant } = data;

		if (useTenant) {
			return this.employeeService.findOne(id, {
				relations
			});
		} else {
			return this.employeeService.findWithoutTenant(id, {
				relations
			});
		}
	}

	@ApiOperation({ summary: 'Find employee by user id in the same tenant.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee in the same tenant',
		type: Employee
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('/user/:userId')
	@UseGuards(AuthGuard('jwt'))
	async findByUserId(
		@Param('userId') userId: string,
		@Query('data', ParseJsonPipe) data?: any
	): Promise<ITryRequest> {
		const { relations = [] } = data;

		return this.employeeService.findOneOrFail({
			where: {
				userId
			},
			relations
		});
	}

	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.' /*, type: T*/
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_EMPLOYEES_EDIT)
	@Post('/create')
	@UseGuards(AuthGuard('jwt'))
	async create(
		@Body() entity: IEmployeeCreateInput,
		@Req() request: Request,
		@I18nLang() languageCode: LanguagesEnum,
		...options: any[]
	): Promise<Employee> {
		if (!entity.user.imageUrl) {
			entity.user.imageUrl = getUserDummyImage(entity.user);
		}
		entity.originalUrl = request.get('Origin');
		return this.commandBus.execute(
			new EmployeeCreateCommand(entity, languageCode)
		);
	}

	@ApiOperation({ summary: 'Create records in Bulk' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Records have been successfully created.' /*, type: T*/
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_EMPLOYEES_EDIT)
	@Post('/createBulk')
	@UseGuards(AuthGuard('jwt'))
	async createBulk(
		@Body() input: IEmployeeCreateInput[],
		@I18nLang() languageCode: LanguagesEnum,
		...options: any[]
	): Promise<Employee[]> {
		/**
		 * Use a dummy image avatar if no image is uploaded for any of the employees in the list
		 */

		input
			.filter((entity) => !entity.user.imageUrl)
			.forEach(
				(entity) =>
					(entity.user.imageUrl = getUserDummyImage(entity.user))
			);

		return this.commandBus.execute(
			new EmployeeBulkCreateCommand(input, languageCode)
		);
	}
}
