import {
	Entity,
	Column,
	OneToMany,
	RelationId,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	JoinTable
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { DeepPartial, IProductTranslatable } from '@gauzy/common';
import {
	InvoiceItem,
	ProductCategory,
	ProductOption,
	ProductTranslation,
	ProductType,
	ProductVariant,
	Tag,
	TranslatableBase
} from '../internal';

@Entity('product')
export class Product extends TranslatableBase implements IProductTranslatable {
	constructor(input?: DeepPartial<Product>) {
		super(input);
	}

	@ManyToMany(() => Tag, (tag) => tag.product)
	@JoinTable({
		name: 'tag_product'
	})
	tags?: Tag[];

	@ApiPropertyOptional({ type: Boolean })
	@Column({ default: true })
	enabled: boolean;

	@ApiProperty({ type: String })
	@IsString()
	@Column()
	code: string;

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@Column({ nullable: true })
	imageUrl: string;

	@OneToMany(
		() => ProductVariant,
		(productVariant) => productVariant.product,
		{
			onDelete: 'CASCADE'
		}
	)
	variants: ProductVariant[];

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((product: Product) => product.type)
	productTypeId: string;

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((product: Product) => product.category)
	productCategoryId: string;

	@ManyToOne(() => ProductType, { onDelete: 'SET NULL' })
	@JoinColumn()
	type: ProductType;

	@ManyToOne(() => ProductCategory, { onDelete: 'SET NULL' })
	@JoinColumn()
	category: ProductCategory;

	@OneToMany(() => ProductOption, (productOption) => productOption.product)
	options: ProductOption[];

	@ApiPropertyOptional({ type: InvoiceItem, isArray: true })
	@OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.product, {
		onDelete: 'SET NULL'
	})
	@JoinColumn()
	invoiceItems?: InvoiceItem[];

	@ApiProperty({ type: ProductTranslation, isArray: true })
	@OneToMany(
		() => ProductTranslation,
		(productTranslation) => productTranslation.reference,
		{
			eager: true,
			cascade: true
		}
	)
	translations: ProductTranslation[];
}
