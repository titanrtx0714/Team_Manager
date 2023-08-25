import {
	Controller,
	HttpStatus,
	Get,
	Query,
	UseGuards,
	Body,
	Param,
	Put,
	HttpCode,
	UsePipes,
	ValidationPipe,
	BadRequestException
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiInternalServerErrorResponse,
	ApiOkResponse,
	ApiNotFoundResponse
} from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { IEmail, IPagination, PermissionsEnum } from '@gauzy/contracts';
import { Email } from './email.entity';
import { EmailHistoryService } from './email-history.service';
import { Permissions } from './../shared/decorators';
import { UUIDValidationPipe } from './../shared/pipes';
import { PermissionGuard, TenantPermissionGuard } from './../shared/guards';
import { UpdateEmailDTO } from './dto';
import { PaginationParams } from './../core/crud';

@ApiTags('Email')
@UseGuards(TenantPermissionGuard, PermissionGuard)
@Permissions(PermissionsEnum.VIEW_ALL_EMAILS)
@Controller()
export class EmailController {
	constructor(
		private readonly _emailHistoryService: EmailHistoryService
	) { }

	@ApiOperation({ summary: 'Find all emails under specific tenant.' })
	@ApiOkResponse({
		status: HttpStatus.OK,
		description: 'Found emails',
		type: Email
	})
	@ApiNotFoundResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'No records found'
	})
	@ApiInternalServerErrorResponse({
		status: HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Invalid input, The response body may contain clues as to what went wrong"
	})
	@Get()
	@UsePipes(new ValidationPipe())
	async findAll(
		@Query() params: PaginationParams<Email>
	): Promise<IPagination<IEmail>> {
		try {
			return await this._emailHistoryService.findAll(params);
		} catch (error) {
			throw new BadRequestException(error);
		}
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
	@UsePipes(new ValidationPipe({ whitelist: true }))
	async update(
		@Param('id', UUIDValidationPipe) id: IEmail['id'],
		@Body() entity: UpdateEmailDTO
	): Promise<IEmail | UpdateResult> {
		try {
			return await this._emailHistoryService.update(id, entity);
		} catch (error) {
			throw new BadRequestException(error);
		}
	}
}
