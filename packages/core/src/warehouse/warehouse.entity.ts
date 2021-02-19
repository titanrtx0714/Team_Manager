import {
	Entity,
	Column,
	ManyToOne,
	JoinColumn,
	ManyToMany,
	JoinTable,
	OneToOne
} from 'typeorm';
import { IContact, ITag, IWarehouse } from '@gauzy/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import {
	Contact,
	Product,
	Tag,
	TenantBaseEntity
} from '../core/entities/internal';

@Entity('warehouse')
export class Warehouse extends TenantBaseEntity implements IWarehouse {
	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	name: string;

	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	logo: string;

	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	description: string;

	@ApiPropertyOptional({ type: () => Boolean })
	@Column({ default: true })
	active: boolean;

	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	code: string;

	@ManyToOne(() => Product, { onDelete: 'SET NULL' })
	@JoinColumn()
	products: Product[];

	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	email: string;

	@ApiProperty({ type: () => Contact })
	@OneToOne(() => Contact, {
		eager: true,
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	contact: IContact;

	@ManyToMany(() => Tag)
	@JoinTable({
		name: 'tag_warehouse'
	})
	tags: ITag[];
}
