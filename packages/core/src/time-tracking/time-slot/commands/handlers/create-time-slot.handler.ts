import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, In, Repository, SelectQueryBuilder, WhereExpressionBuilder } from 'typeorm';
import * as moment from 'moment';
import * as _ from 'underscore';
import { PermissionsEnum } from '@gauzy/contracts';
import { RequestContext } from '../../../../core/context';
import {
	Employee,
	TimeLog
} from './../../../../core/entities/internal';
import { TimeSlot } from './../../time-slot.entity';
import { CreateTimeSlotCommand } from '../create-time-slot.command';
import { BulkActivitiesSaveCommand } from '../../../activity/commands';
import { TimeSlotMergeCommand } from './../time-slot-merge.command';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateTimeSlotCommand)
export class CreateTimeSlotHandler
	implements ICommandHandler<CreateTimeSlotCommand> {
	constructor(
		@InjectRepository(TimeSlot)
		private readonly timeSlotRepository: Repository<TimeSlot>,

		@InjectRepository(TimeLog)
		private readonly timeLogRepository: Repository<TimeLog>,

		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>,

		private readonly commandBus: CommandBus
	) {}

	public async execute(command: CreateTimeSlotCommand): Promise<TimeSlot> {
		const { input } = command;
		let { organizationId } = input;

		const user = RequestContext.currentUser();
		const tenantId = RequestContext.currentTenantId();

		/**
		 * Check logged user has employee permission
		 */
		if (
			!RequestContext.hasPermission(
				PermissionsEnum.CHANGE_SELECTED_EMPLOYEE
			)
		) {
			input.employeeId = user.employeeId;
		}

		/*
		 * If employeeId not send from desktop timer request payload
		 */
		if (!input.employeeId && user.employeeId) {
			input.employeeId = user.employeeId;
		}

		/*
		 * If organization not found in request then assign current logged user organization
		 */
		const { employeeId } = input;
		if (!organizationId) {
			const employee = await this.employeeRepository.findOne(employeeId);
			organizationId = employee ? employee.organizationId : null;
		}

		input.startedAt = moment(input.startedAt)
			.utc()
			.set('millisecond', 0)
			.toDate();
		let timeSlot = await this.timeSlotRepository.findOne({
			where: {
				organizationId,
				tenantId,
				employeeId,
				startedAt: input.startedAt
			}
		});

		if (!timeSlot) {
			timeSlot = new TimeSlot(_.omit(input, ['timeLogId']));
			timeSlot.tenantId = tenantId;
			timeSlot.organizationId = organizationId;
		}

		if (input.timeLogId) {
			let timeLogIds = [];
			if (input.timeLogId instanceof Array) {
				timeLogIds = input.timeLogId;
			} else {
				timeLogIds.push(input.timeLogId);
			}
			timeSlot.timeLogs = await this.timeLogRepository.find({
				id: In(timeLogIds),
				tenantId,
				organizationId,
				employeeId
			});
		} else {
			try {
				/**
				 * Find TimeLog for TimeSlot Range 
				 */
				 timeSlot.timeLogs = await this.timeLogRepository.find({
					where: (query: SelectQueryBuilder<TimeLog>) => {
						query.andWhere(
							new Brackets((qb: WhereExpressionBuilder) => { 
								qb.andWhere(`"${query.alias}"."tenantId" = :tenantId`, { tenantId });
								qb.andWhere(`"${query.alias}"."organizationId" = :organizationId`, { organizationId });
								qb.andWhere(`"${query.alias}"."employeeId" = :employeeId`, { employeeId });
							})
						);
						query.andWhere(
							new Brackets((qb: WhereExpressionBuilder) => {
								const { startedAt } = timeSlot;
								qb.orWhere(`"${query.alias}"."startedAt" <= :startedAt AND "${query.alias}"."stoppedAt" > :startedAt`, { startedAt });
								qb.orWhere(`"${query.alias}"."startedAt" <= :startedAt AND "${query.alias}"."stoppedAt" IS NULL`, { startedAt });
							})
						);
					}
				});
			} catch (error) {
				throw new BadRequestException('Can\'t find Timelog for timeslot');
			}
		}

		if (input.activities) {
			timeSlot.activities = await this.commandBus.execute(
				new BulkActivitiesSaveCommand({
					employeeId: timeSlot.employeeId,
					projectId: input.projectId,
					activities: input.activities
				})
			);
		}

		await this.timeSlotRepository.save(timeSlot);

		const minDate = input.startedAt;
		const maxDate = input.startedAt;

		/*
		* Merge timeslots into 10 minutes slots
		*/
		let [createdTimeSlot] = await this.commandBus.execute(
			new TimeSlotMergeCommand(
				employeeId,
				minDate, 
				maxDate
			)
		);

		// If merge timeslots not found then pass created timeslot
		if (!createdTimeSlot) {
			createdTimeSlot = timeSlot;
		}

		return await this.timeSlotRepository.findOne(createdTimeSlot.id, {
			relations: ['timeLogs', 'screenshots']
		});
	}
}
