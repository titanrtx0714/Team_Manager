import {
	Controller,
	UseGuards,
	HttpStatus,
	HttpCode,
	Post,
	Body,
	Delete,
	Param,
	Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController } from '../core/crud/crud.controller';
import { OrganizationAwardsService } from './organization-awards.service';
import { OrganizationAwards } from './organization-awards.entity';
import { AuthGuard } from '@nestjs/passport';
import { DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@ApiTags('Organization-Awards')
@Controller()
export class OrganizationAwardsController extends CrudController<
	OrganizationAwards
> {
	constructor(
		private readonly organizationAwardsService: OrganizationAwardsService
	) {
		super(organizationAwardsService);
	}

	@ApiOperation({ summary: 'Create new record' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'The record has been successfully created.'
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@HttpCode(HttpStatus.CREATED)
	@Post()
	@UseGuards(AuthGuard('jwt'))
	async create(
		@Body() entity: DeepPartial<OrganizationAwards>
	): Promise<OrganizationAwards> {
		return this.organizationAwardsService.create(entity);
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
		@Body() entity: QueryDeepPartialEntity<OrganizationAwards>
	): Promise<any> {
		return this.organizationAwardsService.update(id, entity);
	}

	@ApiOperation({ summary: 'Delete record' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'The record has been successfully deleted'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Delete(':id')
	@UseGuards(AuthGuard('jwt'))
	async delete(@Param('id') id: string): Promise<any> {
		return this.organizationAwardsService.delete(id);
	}
}
