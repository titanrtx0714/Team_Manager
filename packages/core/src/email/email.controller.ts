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
	ValidationPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { IEmail, IPagination } from '@gauzy/contracts';
import { Email } from './email.entity';
import { EmailService } from './email.service';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared/pipes';
import { TenantPermissionGuard } from './../shared/guards';
import { UpdateEmailDTO } from './dto';

@ApiTags('Email')
@UseGuards(TenantPermissionGuard)
@Controller()
export class EmailController {
	constructor(
		private readonly emailService: EmailService
	) {}

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
		status : HttpStatus.INTERNAL_SERVER_ERROR,
		description: "Invalid input, The response body may contain clues as to what went wrong"
	})
	@Get()
	async findAll(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<IEmail>> {
		const { relations, findInput, take } = data;
		return await this.emailService.findAll({
			where: findInput,
			relations,
			order: {
				createdAt: 'DESC'
			},
			take: take
		});
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
	@UsePipes(new ValidationPipe({
		transform: true,
		whitelist: true
	}))
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: UpdateEmailDTO
	): Promise<any> {
		return await this.emailService.update(id, entity);
	}
}
