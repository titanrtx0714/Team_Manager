// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta

import {
	User as IUser,
	LanguagesEnum,
	ComponentLayoutStyleEnum
} from '@gauzy/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsAscii,
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	MinLength,
	IsEnum
} from 'class-validator';
import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	RelationId,
	ManyToMany,
	JoinTable,
	OneToOne,
	AfterLoad,
	OneToMany
} from 'typeorm';
import { Base } from '../core/entities/base';
import { Role } from '../role/role.entity';
import { Tenant } from '../tenant/tenant.entity';
import { Tag } from '../tags/tag.entity';
import { Employee } from '../employee/employee.entity';
import { Payment } from '../payment/payment.entity';

@Entity('user')
export class User extends Base implements IUser {
	@ManyToMany(() => Tag)
	@JoinTable({
		name: 'tag_user'
	})
	tags: Tag[];

	@ApiProperty({ type: Tenant })
	@ManyToOne(() => Tenant, { nullable: true, onDelete: 'CASCADE' })
	@JoinColumn()
	tenant: Tenant;

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((user: User) => user.tenant)
	readonly tenantId?: string;

	@ApiPropertyOptional({ type: String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	thirdPartyId?: string;

	@ApiPropertyOptional({ type: String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	firstName?: string;

	@ApiPropertyOptional({ type: String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	lastName?: string;

	@ApiProperty({ type: String, minLength: 3, maxLength: 100 })
	@IsEmail()
	@IsNotEmpty()
	@Index({ unique: true })
	@IsOptional()
	@Column({ nullable: true })
	email?: string;

	@ApiPropertyOptional({ type: String, minLength: 3, maxLength: 20 })
	@IsAscii()
	@MinLength(3)
	@MaxLength(20)
	@Index({ unique: true })
	@IsOptional()
	@Column({ nullable: true })
	username?: string;

	@OneToOne('Employee', (employee: Employee) => employee.user)
	employee?: Employee;

	@ApiPropertyOptional({ type: Role })
	@ManyToOne(() => Role, { nullable: true, onDelete: 'CASCADE' })
	@JoinColumn()
	role?: Role;

	@ApiPropertyOptional({ type: String, readOnly: true })
	@RelationId((user: User) => user.role)
	readonly roleId?: string;

	@ApiProperty({ type: String })
	@IsString()
	@Column()
	@IsOptional()
	@Column({ nullable: true })
	hash?: string;

	@ApiPropertyOptional({ type: String, maxLength: 500 })
	@IsOptional()
	@Column({ length: 500, nullable: true })
	imageUrl?: string;

	@ApiPropertyOptional({ type: Payment, isArray: true })
	@OneToMany((type) => Payment, (payments) => payments.recordedBy)
	@JoinColumn()
	payments?: Payment[];

	@ApiPropertyOptional({ type: String })
	@IsString()
	@IsOptional()
	@Column({ nullable: true })
	paymentsId?: string;

	@ApiProperty({ type: String, enum: LanguagesEnum })
	@IsEnum(LanguagesEnum)
	@Column({ nullable: true })
	preferredLanguage?: string;

	@ApiProperty({ type: String, enum: ComponentLayoutStyleEnum })
	@IsEnum(ComponentLayoutStyleEnum)
	@Column({ nullable: true })
	preferredComponentLayout?: string;

	name?: string;

	employeeId?: string;

	@AfterLoad()
	afterLoad?() {
		const name = this.firstName + ' ' + this.lastName;
		this.name = name;
		this.employeeId = this.employee ? this.employee.id : null;
	}
}
