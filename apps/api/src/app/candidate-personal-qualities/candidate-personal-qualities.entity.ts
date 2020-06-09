import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Base } from '../core/entities/base';
import { ICandidatePersonalQualities } from '@gauzy/models';

@Entity('candidate_personal_qualities')
export class CandidatePersonalQualities extends Base
	implements ICandidatePersonalQualities {
	@ApiProperty({ type: String })
	@Column()
	name: string;
}
