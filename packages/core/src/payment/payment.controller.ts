import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
	Controller,
	UseGuards,
	Query,
	Get,
	HttpCode,
	HttpStatus,
	Put,
	Param,
	Body,
	Post,
	Delete,
	Req,
	ValidationPipe,
	UsePipes
} from '@nestjs/common';
import { I18nLang } from 'nestjs-i18n';
import {
	IPagination,
	IPayment,
	IPaymentReportData,
	LanguagesEnum,
	PermissionsEnum,
	ReportGroupFilterEnum
} from '@gauzy/contracts';
import { CrudController, PaginationParams } from '../core';
import { ParseJsonPipe, UUIDValidationPipe } from './../shared';
import { PermissionGuard, TenantPermissionGuard } from './../shared/guards';
import { Permissions } from './../shared/decorators';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentMapService } from './payment.map.service';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { PaymentReportQueryDTO } from './dto/query';

@ApiTags('Payment')
@UseGuards(TenantPermissionGuard)
@Controller()
export class PaymentController extends CrudController<Payment> {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly paymentMapService: PaymentMapService
	) {
		super(paymentService);
	}

	@ApiOperation({
		summary: 'Payments report.'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found reports'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_VIEW)
	@Get('report')
	async getPaymentReport(
		@Query(new ValidationPipe({
			transform: true,
			whitelist: true
		})) options: PaymentReportQueryDTO
	): Promise<IPaymentReportData[]> {
		const reports = await this.paymentService.getPayments(options);
		let response: IPaymentReportData[] = [];
		if (options.groupBy === ReportGroupFilterEnum.date) {
			response = this.paymentMapService.mapByDate(reports);
		} else if (options.groupBy === ReportGroupFilterEnum.client) {
			response = this.paymentMapService.mapByClient(reports);
		} else if (options.groupBy === ReportGroupFilterEnum.project) {
			response = this.paymentMapService.mapByProject(reports);
		}
		return response;
	}

	@ApiOperation({ summary: 'Payment Report daily chart' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found one record'
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_VIEW)
	@Get('report/chart-data')
	async getDailyReportChartData(
		@Query(new ValidationPipe({
			transform: true,
			whitelist: true
		})) options: PaymentReportQueryDTO
	) {
		return this.paymentService.getDailyReportChartData(options);
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_ADD_EDIT)
	@Post('receipt')
	async sendReceipt(
		@Req() request,
		@I18nLang() languageCode: LanguagesEnum
	): Promise<any> {
		return this.paymentService.sendReceipt(
			languageCode,
			request.body.params,
			request.get('Origin')
		);
	}

	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_VIEW)
	@Get('pagination')
	@UsePipes(new ValidationPipe({ transform: true }))
	async pagination(
		@Query() filter: PaginationParams<Payment>
	): Promise<IPagination<IPayment>> {
		return this.paymentService.pagination(filter);
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_VIEW)
	@Get()
	async findAll(
		@Query('data', ParseJsonPipe) data: any
	): Promise<IPagination<IPayment>> {
		const { relations = [], findInput = null } = data;
		return this.paymentService.findAll({
			where: findInput,
			relations
		});
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_ADD_EDIT)
	@Post()
	@UsePipes(new ValidationPipe({ transform : true }))
	async create(
		@Body() entity: CreatePaymentDTO
	): Promise<IPayment> {
		return this.paymentService.create(entity);
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_ADD_EDIT)
	@Put(':id')
	@UsePipes( new ValidationPipe({ transform : true }))
	async update(
		@Param('id', UUIDValidationPipe) id: string,
		@Body() entity: UpdatePaymentDTO
	): Promise<IPayment> {
		return this.paymentService.create({
			id,
			...entity
		});
	}

	@HttpCode(HttpStatus.ACCEPTED)
	@UseGuards(PermissionGuard)
	@Permissions(PermissionsEnum.ORG_PAYMENT_ADD_EDIT)
	@Delete(':id')
	async delete(
		@Param('id', UUIDValidationPipe) id: string
	): Promise<any> {
		return this.paymentService.delete(id);
	}
}
