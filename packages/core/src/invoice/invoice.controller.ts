import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	Controller,
	UseGuards,
	HttpCode,
	HttpStatus,
	Put,
	Param,
	Body,
	Query,
	Get,
	Req,
	Post,
	Delete,
	Res,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { I18nLang } from 'nestjs-i18n';
import {
	PermissionsEnum,
	IInvoice,
	LanguagesEnum,
	IPagination
} from '@gauzy/contracts';
import { CrudController, PaginationParams } from './../core/crud';
import { Invoice } from './invoice.entity';
import { InvoiceService } from './invoice.service';
import { Permissions, Public } from './../shared/decorators';
import { PermissionGuard, TenantPermissionGuard } from './../shared/guards';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared/pipes';
import {
	InvoiceCreateCommand,
	InvoiceDeleteCommand,
	InvoiceGenerateLinkCommand,
	InvoiceSendEmailCommand,
	InvoiceUpdateCommand,
	InvoiceGeneratePdfCommand,
	InvoicePaymentGeneratePdfCommand
} from './commands';
import { CreateInvoiceDTO, UpdateInvoiceActionDTO, UpdateEstimateInvoiceDTO, UpdateInvoiceDTO } from './dto';

@ApiTags('Invoice')
@Controller()
export class InvoiceController extends CrudController<Invoice> {
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly commandBus: CommandBus
	) {
		super(invoiceService);
	}

	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_VIEW)
	@Get('pagination')
	@UsePipes(new ValidationPipe({ transform: true }))
	async pagination(
		@Query() filter: PaginationParams<IInvoice>
	): Promise<IPagination<IInvoice>> {
		return this.invoiceService.pagination(filter);
	}

	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_VIEW)
	@Get()
	async findAll(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<IInvoice>> {
		const { relations = [], findInput = null } = data;
		return this.invoiceService.findAll({
			where: findInput,
			relations
		});
	}

	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_VIEW)
	@Get('highest')
	async findHighestInvoiceNumber(): Promise<IPagination<IInvoice>> {
		return this.invoiceService.getHighestInvoiceNumber();
	}

	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_VIEW)
	@Get(':id')
	async findById(
		@Param('id', UUIDValidationPipe) id: string,
		@Query('data', ParseJsonPipe) data: any
	): Promise<IInvoice> {
		const { relations = [], findInput = null } = data;
		return this.invoiceService.findOneByIdString(id, {
			where: findInput,
			relations
		});
	}

	@ApiOperation({ summary: 'Find invoice by id ' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found one record',
		type: Invoice
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('public/:id/:token')
	@Public()
	async findWithoutGuard(
		@Param('id', UUIDValidationPipe) id: string,
		@Param('token') token: string,
		@Query('data', ParseJsonPipe) data: any
	): Promise<IInvoice> {
		const { relations = [] } = data;
		return this.invoiceService.findOneByIdString(id, {
			where: { token: token },
			relations
		});
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
	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_EDIT)
	@Post()
	@UsePipes(new ValidationPipe({ transform : true }))
	async create(
		@Body() entity: CreateInvoiceDTO
	): Promise<Invoice> {
		return this.commandBus.execute(
			new InvoiceCreateCommand(entity)
		);
	}

	@ApiOperation({ summary: 'Update record' })
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
	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_EDIT)
	@Put(':id')
	@UsePipes( new ValidationPipe({ transform : true }))
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: UpdateInvoiceDTO
	): Promise<Invoice> {
		return this.commandBus.execute(
			new InvoiceUpdateCommand({ id, ...entity })
		);
	}

	@ApiOperation({ summary: 'Update estimate invoice' })
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
	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_EDIT)
	@Put('/:id/estimate')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async updateEstimate(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: UpdateEstimateInvoiceDTO
	){
		return this.commandBus.execute(
			new InvoiceUpdateCommand({ id, ...entity })
		);
	}

	@ApiOperation({ summary: "Update Invoice's Status" })
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
	@UseGuards(TenantPermissionGuard, PermissionGuard)
	@Permissions(PermissionsEnum.INVOICES_EDIT)
	@Put('/:id/action')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async updateAction(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: UpdateInvoiceActionDTO
	){
		return this.commandBus.execute(
			new InvoiceUpdateCommand({ id, ...entity })
		);
	}

	@ApiOperation({ summary: 'Update record' })
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
	@Put('estimate/:id')
	@Public()
	async updateWithoutGuard(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: IInvoice
	): Promise<Invoice> {
		return this.commandBus.execute(
			new InvoiceUpdateCommand({ id, ...entity })
		);
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@Put('email/:email')
	async emailInvoice(
		@Param('email') email: string,
		@Req() request,
		@I18nLang() languageCode: LanguagesEnum
	): Promise<any> {
		return this.commandBus.execute(
			new InvoiceSendEmailCommand(
				languageCode,
				email,
				request.body.params,
				request.get('Origin')
			)
		);
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@Put('generate/:id')
	async generateLink(
		@Param('id', UUIDValidationPipe) id: string,
		@Req() request
	): Promise<any> {
		return this.commandBus.execute(
			new InvoiceGenerateLinkCommand(id, request.body.params)
		);
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
	async delete(
		@Param('id', UUIDValidationPipe) id: string
	): Promise<DeleteResult> {
		return this.commandBus.execute(new InvoiceDeleteCommand(id));
	}

	@ApiOperation({ summary: 'Download Invoice' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'The invoice has been successfully downloaded'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Invoice not found'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Get('download/:uuid')
	async downloadInvoicePdf(
		@Param('uuid', UUIDValidationPipe) uuid: string,
		@I18nLang() locale: LanguagesEnum,
		@Res() res: Response
	): Promise<any> {
		const buffer: Buffer = await this.commandBus.execute(
			new InvoiceGeneratePdfCommand(uuid, locale)
		);
		if (!buffer) {
			return;
		}
		const stream = this.invoiceService.getReadableStream(buffer);
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Length': buffer.length
		});
		stream.pipe(res);
	}

	@ApiOperation({ summary: 'Download Invoice' })
	@ApiResponse({
		status: HttpStatus.NO_CONTENT,
		description: 'The invoice has been successfully downloaded'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Invoice not found'
	})
	@HttpCode(HttpStatus.ACCEPTED)
	@Get('payment/download/:uuid')
	async downloadInvoicePaymentPdf(
		@Param('uuid', UUIDValidationPipe) uuid: string,
		@I18nLang() locale: LanguagesEnum,
		@Res() res: Response
	): Promise<any> {
		const buffer = await this.commandBus.execute(
			new InvoicePaymentGeneratePdfCommand(uuid, locale)
		);
		if (!buffer) {
			return;
		}

		const stream = this.invoiceService.getReadableStream(buffer);
		res.set({
			'Content-Type': 'application/pdf',
			'Content-Length': buffer.length
		});
		stream.pipe(res);
	}
}
