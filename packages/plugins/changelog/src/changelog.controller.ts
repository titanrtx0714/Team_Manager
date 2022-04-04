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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
	IChangelog,
	IChangelogCreateInput,
	IChangelogUpdateInput,
	IPagination
} from '@gauzy/contracts';
import {
	CrudController,
	Public,
	UUIDValidationPipe
} from '@gauzy/core';
import { Changelog } from './changelog.entity';
import { ChangelogService } from './changelog.service';
import { ChangelogCreateCommand, ChangelogUpdateCommand } from './commands';

@ApiTags('Changelog')
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
	@Public()
	@Get()
	async findAll(): Promise<IPagination<IChangelog>> {
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
	async create(
		@Body() entity: IChangelogCreateInput
	): Promise<IChangelog> {
		return await this.commandBus.execute(
			new ChangelogCreateCommand(entity)
		);
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
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: IChangelogUpdateInput
	): Promise<IChangelog> {
		return await this.commandBus.execute(
			new ChangelogUpdateCommand({ id, ...entity })
		);
	}
}
