import { Column, Entity, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { RolesEnum, IRolePermission, IRole } from '@gauzy/common';
import { RolePermissions } from '../role-permissions/role-permissions.entity';
import { TenantBase } from '../tenant-base';

@Entity('role')
export class Role extends TenantBase implements IRole {
	@ApiProperty({ type: String, enum: RolesEnum })
	@IsEnum(RolesEnum)
	@IsNotEmpty()
	@Index()
	@Column()
	name: string;

	@OneToMany(
		(type) => RolePermissions,
		(rolePermission) => rolePermission.role
	)
	rolePermissions: IRolePermission[];
}
