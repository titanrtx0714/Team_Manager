import {
	Controller,
	HttpStatus,
	Post,
	Body,
	Get,
	HttpCode,
	Put,
	Param,
	UseGuards,
	Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrudController, IPagination } from '../core';
import { ProductVariant } from './product-variant.entity';
import { ProductVariantService } from './product-variant.service';
import {
	ProductVariantCreateCommand,
	ProductVariantDeleteCommand
} from './commands';
import { CommandBus } from '@nestjs/cqrs';
import { Product } from '../product/product.entity';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult } from 'typeorm';
import { IVariantCreateInput } from '@gauzy/models';

@ApiTags('ProductVariant')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class ProductVariantController extends CrudController<ProductVariant> {
	constructor(
		private readonly productVariantService: ProductVariantService,
		private readonly commandBus: CommandBus
	) {
		super(productVariantService);
	}

	@ApiOperation({ summary: 'Create product variants' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description:
			'These records have been successfully created.' /*, type: T*/
	})
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	// @UseGuards(PermissionGuard)
	@Post('/create-variants')
	async createProductVariants(
		@Body() entity: IVariantCreateInput,
		...options: any[]
	): Promise<ProductVariant[]> {
		return this.commandBus.execute(new ProductVariantCreateCommand(entity));
	}

	@ApiOperation({
		summary: 'Find all product variants'
	})
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found product variants',
		type: Product
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('all')
	async findAllProductVariants(): Promise<IPagination<ProductVariant>> {
		return this.productVariantService.findAllProductVariants();
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
	async update(
		@Param('id') id: string,
		@Body() productVariant: ProductVariant
	): Promise<ProductVariant> {
		return this.productVariantService.updateVariant(productVariant);
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
		@Param('id') id: string,
		...options: any[]
	): Promise<DeleteResult> {
		return this.commandBus.execute(new ProductVariantDeleteCommand(id));
	}
}
