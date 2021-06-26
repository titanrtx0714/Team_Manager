import {
	Entity,
	Column,
	ManyToOne,
	RelationId,
	JoinColumn,
	OneToMany,
	Index
} from 'typeorm';
import {
	IKeyResult,
	KeyResultTypeEnum,
	KeyResultDeadlineEnum
} from '@gauzy/contracts';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import {
	Employee,
	Goal,
	GoalKPI,
	KeyResultUpdate,
	OrganizationProject,
	Task,
	TenantOrganizationBaseEntity
} from '../core/entities/internal';

@Entity('key_result')
export class KeyResult
	extends TenantOrganizationBaseEntity
	implements IKeyResult {
		
	@ApiProperty({ type: () => String })
	@Column()
	name: string;

	@ApiProperty({ type: () => String })
	@Column()
	@IsOptional()
	description?: string;

	@ApiProperty({ type: () => String, enum: KeyResultTypeEnum })
	@IsEnum(KeyResultTypeEnum)
	@Column()
	type: string;

	@ApiProperty({ type: () => Number })
	@Column({ nullable: true })
	@IsOptional()
	targetValue?: number;

	@ApiProperty({ type: () => Number })
	@Column({ nullable: true })
	@IsOptional()
	initialValue: number;

	@ApiProperty({ type: () => String })
	@Column({ nullable: true })
	@IsOptional()
	unit?: string;

	@ApiProperty({ type: () => Number })
	@Column()
	update: number;

	@ApiProperty({ type: () => Number })
	@Column()
	progress: number;

	@ApiProperty({ type: () => String, enum: KeyResultDeadlineEnum })
	@IsEnum(KeyResultDeadlineEnum)
	@Column()
	deadline: string;

	@ApiProperty({ type: () => Date })
	@Column({ nullable: true })
	@IsOptional()
	hardDeadline?: Date;

	@ApiProperty({ type: () => Date })
	@Column({ nullable: true })
	@IsOptional()
	softDeadline?: Date;

	@ApiProperty({ type: () => String })
	@Column()
	@IsOptional()
	status?: string;

	@ApiProperty({ type: () => String })
	@Column({ nullable: true })
	@IsOptional()
	weight?: string;

	@ApiProperty({ type: () => Employee })
	@ManyToOne(() => Employee)
	@JoinColumn()
	owner: Employee;

	@ApiProperty({ type: () => String })
	@RelationId((it: KeyResult) => it.owner)
	@IsString()
	@Index()
	@Column()
	ownerId: string;

	@ApiProperty({ type: () => Employee })
	@ManyToOne(() => Employee, { nullable: true })
	@JoinColumn()
	@IsOptional()
	lead?: Employee;

	@ApiProperty({ type: () => String })
	@RelationId((it: KeyResult) => it.lead)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	leadId?: string;

	@ApiProperty({ type: () => OrganizationProject })
	@ManyToOne(() => OrganizationProject, { nullable: true })
	@JoinColumn({ name: 'projectId' })
	@IsOptional()
	project?: OrganizationProject;

	@ApiProperty({ type: () => String, readOnly: true })
	@RelationId((it: KeyResult) => it.project)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	readonly projectId?: string;

	@ApiProperty({ type: () => Task })
	@ManyToOne(() => Task, { nullable: true })
	@JoinColumn({ name: 'taskId' })
	@IsOptional()
	task?: Task;

	@ApiProperty({ type: () => String, readOnly: true })
	@RelationId((it: KeyResult) => it.task)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	readonly taskId?: string;

	@ApiProperty({ type: () => GoalKPI })
	@ManyToOne(() => GoalKPI, { nullable: true })
	@JoinColumn({ name: 'kpiId' })
	@IsOptional()
	kpi?: GoalKPI;

	@ApiProperty({ type: () => String, readOnly: true })
	@RelationId((it: KeyResult) => it.kpi)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	readonly kpiId?: string;

	@ApiProperty({ type: () => Goal })
	@ManyToOne(() => Goal, (goal) => goal.keyResults, {
		onDelete: 'CASCADE'
	})
	@JoinColumn({ name: 'goalId' })
	goal: Goal;

	@ApiProperty({ type: () => String, readOnly: true })
	@RelationId((it: KeyResult) => it.goal)
	@IsString()
	@IsOptional()
	@Index()
	@Column({ nullable: true })
	readonly goalId?: string;

	@ApiProperty({ type: () => KeyResultUpdate })
	@OneToMany(() => KeyResultUpdate, (keyResultUpdate) => keyResultUpdate.keyResult, {
		cascade: true
	})
	@IsOptional()
	updates?: KeyResultUpdate[];
}
