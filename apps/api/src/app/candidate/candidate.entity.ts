import { ICandidateInterview } from './../../../../../libs/models/src/lib/candidate-interview.model';
import { ICandidateSource } from './../../../../../libs/models/src/lib/candidate-source.model';
import { CandidateSkill } from './../candidate-skill/candidate-skill.entity';
import { CandidateExperience } from './../candidate-experience/candidate-experience.entity';
import {
	Candidate as ICandidate,
	PayPeriodEnum,
	IEducation,
	IExperience,
	ISkill,
	ICandidateFeedback,
	ICandidateDocument,
	CandidateStatus
} from '@gauzy/models';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsEnum, IsString } from 'class-validator';
import {
	Column,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	RelationId,
	OneToMany
} from 'typeorm';
import { OrganizationDepartment } from '../organization-department/organization-department.entity';
import { OrganizationEmploymentType } from '../organization-employment-type/organization-employment-type.entity';
import { OrganizationPositions } from '../organization-positions/organization-positions.entity';
import { Tag } from '../tags/tag.entity';
import { User } from '../user/user.entity';
import { Organization } from '../organization/organization.entity';
import { CandidateEducation } from '../candidate-education/candidate-education.entity';
import { CandidateSource } from '../candidate-source/candidate-source.entity';
import { CandidateDocument } from '../candidate-documents/candidate-documents.entity';
import { CandidateFeedback } from '../candidate-feedbacks/candidate-feedbacks.entity';
import { CandidateInterview } from '../candidate-interview/candidate-interview.entity';
import { TenantBase } from '../core/entities/tenant-base';
import { Contact } from '../contact/contact.entity';
import { Tenant } from '../tenant/tenant.entity';

@Entity('candidate')
export class Candidate extends TenantBase implements ICandidate {
	@ManyToMany((type) => Tag, (tag) => tag.candidate)
	@JoinTable({
		name: 'tag_candidate'
	})
	tags: Tag[];

	@ApiProperty({ type: Contact })
	@ManyToOne((type) => Contact, { nullable: true, cascade: true })
	@JoinColumn()
	contact: Contact;

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((candidate: Candidate) => candidate.contact)
	readonly contactId?: string;

	@OneToMany(
		(type) => CandidateEducation,
		(candidateEducation) => candidateEducation.candidate
	)
	@JoinColumn()
	educations: IEducation[];

	@OneToMany(
		(type) => CandidateInterview,
		(candidateInterview) => candidateInterview.candidate
	)
	@JoinColumn()
	interview?: ICandidateInterview[];

	@OneToMany(
		(type) => CandidateExperience,
		(candidateExperience) => candidateExperience.candidate
	)
	@JoinColumn()
	experience: IExperience[];

	@OneToMany(
		(type) => CandidateSkill,
		(candidateSkill) => candidateSkill.candidate
	)
	@JoinColumn()
	skills: ISkill[];

	@ApiProperty({ type: CandidateSource })
	@OneToOne((type) => CandidateSource, {
		nullable: true,
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	source?: ICandidateSource;

	@OneToMany(
		(type) => CandidateDocument,
		(candidateDocument) => candidateDocument.candidate
	)
	@JoinColumn()
	documents?: ICandidateDocument[];

	@OneToMany(
		(type) => CandidateFeedback,
		(candidateFeedback) => candidateFeedback.candidate
	)
	@JoinColumn()
	feedbacks?: ICandidateFeedback[];

	@ApiProperty({ type: User })
	@OneToOne((type) => User, {
		nullable: false,
		cascade: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	user: User;

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((candidate: Candidate) => candidate.user)
	readonly userId: string;

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Column({ nullable: true, type: 'numeric' })
	rating?: number;

	@ApiProperty({ type: OrganizationPositions })
	@ManyToOne((type) => OrganizationPositions, { nullable: true })
	@JoinColumn()
	organizationPosition?: OrganizationPositions;

	@ApiProperty({ type: String, readOnly: true })
	@RelationId((candidate: Candidate) => candidate.organizationPosition)
	readonly organizationPositionId?: string;

	@ApiProperty({ type: Organization })
	@ManyToOne((type) => Organization, { nullable: false, onDelete: 'CASCADE' })
	@JoinColumn()
	organization: Organization;

	@ApiProperty({ type: String, readOnly: false })
	@RelationId((candidate: Candidate) => candidate.organization)
  @IsString()
  @Column({ nullable: true })
	orgId: string;

  @ApiProperty({ type: Tenant })
  @ManyToOne((type) => Tenant, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn()
  tenant: Tenant;

  @ApiProperty({ type: String, readOnly: true })
  @RelationId((candidate: Candidate) => candidate.tenant)
  @IsString()
  @Column({ nullable: true })
  tenantId: string;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	valueDate?: Date;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	appliedDate?: Date;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	hiredDate?: Date;

	@ApiProperty({ type: String, enum: CandidateStatus })
	@IsEnum(CandidateStatus)
	@IsOptional()
	@Column({ nullable: true, default: CandidateStatus.APPLIED })
	status?: string;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	rejectDate?: Date;

	@ManyToMany(
		(type) => OrganizationDepartment,
		(organizationDepartment) => organizationDepartment.members,
		{ cascade: true }
	)
	organizationDepartments?: OrganizationDepartment[];

	@ManyToMany(
		(type) => OrganizationEmploymentType,
		(organizationEmploymentType) => organizationEmploymentType.members,
		{ cascade: true }
	)
	organizationEmploymentTypes?: OrganizationEmploymentType[];

	@ApiPropertyOptional({ type: String, maxLength: 500 })
	@IsOptional()
	@Column({ length: 500, nullable: true })
	candidateLevel?: string;

	@ApiPropertyOptional({ type: Number })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	reWeeklyLimit?: number; //Recurring Weekly Limit (hours)

	@ApiPropertyOptional({ type: String, maxLength: 255 })
	@IsOptional()
	@Column({ length: 255, nullable: true })
	billRateCurrency?: string;

	@ApiPropertyOptional({ type: Number })
	@IsOptional()
	@Column({ nullable: true })
	billRateValue?: number;

	@ApiProperty({ type: String, enum: PayPeriodEnum })
	@IsEnum(PayPeriodEnum)
	@IsOptional()
	@Column({ nullable: true })
	payPeriod?: string;

	@ApiPropertyOptional({ type: String })
	@IsOptional()
	@Column({ nullable: true })
	cvUrl?: string;

	@ApiPropertyOptional({ type: Boolean, default: false })
	@Column({ nullable: true, default: false })
	isArchived?: boolean;
}
