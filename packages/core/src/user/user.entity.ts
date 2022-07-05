// Modified code from https://github.com/xmlking/ngx-starter-kit.
// MIT License, see https://github.com/xmlking/ngx-starter-kit/blob/develop/LICENSE
// Copyright (c) 2018 Sumanth Chinthagunta
import {
	IUser,
	IRole,
	LanguagesEnum,
	ComponentLayoutStyleEnum,
	ITag,
	IEmployee,
	IOrganization
} from '@gauzy/contracts';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
	OneToMany
} from 'typeorm';
import {
	Employee,
	Role,
	Tag,
	TenantBaseEntity,
	UserOrganization
} from '../core/entities/internal';

@Entity('user')
export class User extends TenantBaseEntity implements IUser {

	@ApiPropertyOptional({ type: () => String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	thirdPartyId?: string;

	@ApiPropertyOptional({ type: () => String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	firstName?: string;

	@ApiPropertyOptional({ type: () => String })
	@IsString()
	@Index()
	@IsOptional()
	@Column({ nullable: true })
	lastName?: string;

	@ApiProperty({ type: () => String, minLength: 3, maxLength: 100 })
	@IsEmail()
	@IsNotEmpty()
	@Index({ unique: false })
	@IsOptional()
	@Column({ nullable: true })
	email?: string;

	@ApiPropertyOptional({ type: () => String, minLength: 3, maxLength: 20 })
	@IsAscii()
	@MinLength(3)
	@MaxLength(20)
	@Index({ unique: false })
	@IsOptional()
	@Column({ nullable: true })
	username?: string;

	@ApiProperty({ type: () => String })
	@IsString()
	@Column()
	@IsOptional()
	@Exclude()
	@Column({ nullable: true })
	hash?: string;

	@ApiProperty({ type: () => String })
	@Exclude()
	@Column({ nullable: true })
	public refreshToken?: string;

	@ApiPropertyOptional({ type: () => String, maxLength: 500 })
	@IsOptional()
	@Column({ length: 500, nullable: true })
	imageUrl?: string;

	@ApiProperty({ type: () => String, enum: LanguagesEnum })
	@IsEnum(LanguagesEnum)
	@Column({ nullable: true, default: LanguagesEnum.ENGLISH })
	preferredLanguage?: string;

	@ApiProperty({ type: () => String, enum: ComponentLayoutStyleEnum })
	@IsEnum(ComponentLayoutStyleEnum)
	@Column({
		type: 'simple-enum',
		nullable: true,
		default: ComponentLayoutStyleEnum.TABLE,
		enum: ComponentLayoutStyleEnum
	})
	preferredComponentLayout?: string;

	@ApiPropertyOptional({ type: () => Boolean, default: true })
	@Column({ nullable: true, default: true })
	isActive?: boolean;

	name?: string;
	employeeId?: string;

	/*
    |--------------------------------------------------------------------------
    | @ManyToOne
    |--------------------------------------------------------------------------
    */
    // Role
	@ApiPropertyOptional({ type: () => Role })
	@ManyToOne(() => Role, (role) => role.users, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	role?: IRole;

	@ApiProperty({ type: () => String, readOnly: true })
	@RelationId((it: User) => it.role)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	readonly roleId?: string;

	/*
    |--------------------------------------------------------------------------
    | @OneToOne
    |--------------------------------------------------------------------------
    */

	/**
	 * Employee
	 */
	@ApiPropertyOptional({ type: () => Employee })
	@OneToOne(() => Employee, (employee: Employee) => employee.user)
	employee?: IEmployee;

	/*
    |--------------------------------------------------------------------------
    | @ManyToMany
    |--------------------------------------------------------------------------
    */
    // Tags
	@ManyToMany(() => Tag, (tag) => tag.users, {
		onUpdate: 'CASCADE',
		onDelete: 'CASCADE'
	})
	@JoinTable({
		name: 'tag_user'
	})
	tags?: ITag[];

	/*
    |--------------------------------------------------------------------------
    | @OneToMany
    |--------------------------------------------------------------------------
    */

	/**
	 * UserOrganization
	 */
	@ApiProperty({ type: () => UserOrganization, isArray: true })
	@OneToMany(() => UserOrganization, (userOrganization) => userOrganization.user, {
		cascade: true
	})
	@JoinColumn()
	organizations?: IOrganization[];
}