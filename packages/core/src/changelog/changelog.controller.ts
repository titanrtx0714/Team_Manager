import {
	Controller,
	HttpStatus,
	Get,
	UseGuards,
	HttpCode,
	Post,
	Body,
	Param,
	Put
} from '@nestjs/common';
import { UUIDValidationPipe } from '../shared/pipes/uuid-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { Changelog } from './changelog.entity';
import { ChangelogService } from './changelog.service';
import { TenantPermissionGuard } from '../shared/guards/auth/tenant-permission.guard';
import { IPagination } from '../core';
import { CommandBus } from '@nestjs/cqrs';
import {
	IChangelog,
	IChangelogCreateInput,
	IChangelogUpdateInput
} from '@gauzy/contracts';
import { ChangelogCreateCommand, ChangelogUpdateCommand } from './commands';

@ApiTags('Changelog')
@UseGuards(AuthGuard('jwt'), TenantPermissionGuard)
@Controller()
export class ChangelogController extends CrudController<Changelog> {
	constructor(
		private readonly changelogService: ChangelogService,
		private readonly commandBus: CommandBus
	) {
		super(changelogService);
	}

	@ApiOperation({ summary: 'Find all Changelog.' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found records',
		type: Changelog
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No records found'
	})
	@Get('all')
	async getAll(): Promise<IPagination<IChangelog>> {
		return this.changelogService.findAll();
	}

	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Record has been successfully created.'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid input'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Post()
	async createSmtpSetting(
		@Body() entity: IChangelogCreateInput
	): Promise<IChangelog> {
		return this.commandBus.execute(new ChangelogCreateCommand(entity));
	}

	@ApiOperation({ summary: 'Update record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'Record has been successfully edited.'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description: 'Invalid input'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Put(':id')
	async updateSmtpSetting(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: IChangelogUpdateInput
	): Promise<IChangelog> {
		return this.commandBus.execute(
			new ChangelogUpdateCommand({ id, ...entity })
		);
	}
}
