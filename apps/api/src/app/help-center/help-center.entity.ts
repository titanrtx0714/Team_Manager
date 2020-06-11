import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IHelpCenter } from '@gauzy/models';
import { Base } from '../core/entities/base';

@Entity('knowledge_base')
export class HelpCenter extends Base implements IHelpCenter {
	@ApiProperty({ type: String })
	@Column()
	name: string;

	@ApiProperty({ type: String })
	@Column()
	flag: string;

	@ApiProperty({ type: String })
	@Column()
	icon: string;

	@ApiProperty({ type: String })
	@Column()
	privacy: string;

	@ApiProperty({ type: String })
	@Column()
	language: string;

	@ApiProperty({ type: String })
	@Column()
	color: string;

	@ApiProperty({ type: String })
	@Column({ nullable: true })
	description?: string;

	@ApiProperty({ type: String })
	@Column({ nullable: true })
	data?: string;

	@ApiProperty({ type: Number })
	@Column({ nullable: true })
	index: number;

	@ManyToOne((type) => HelpCenter, (children) => children.children, {
		cascade: ['insert'],
		nullable: true
	})
	parent?: IHelpCenter;

	@OneToMany((type) => HelpCenter, (children) => children.parent, {
		cascade: ['insert'],
		nullable: true
	})
	children?: IHelpCenter[];
}
