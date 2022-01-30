import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as moment from 'moment';
import * as _ from 'underscore';
import { TimeSlot } from './../../time-slot.entity';
import { TimeLog } from './../../../time-log/time-log.entity';
import { TimeSlotBulkCreateCommand } from './../time-slot-bulk-create.command';
import { TimeSlotMergeCommand } from './../time-slot-merge.command';
import { RequestContext } from '../../../../core/context';

@CommandHandler(TimeSlotBulkCreateCommand)
export class TimeSlotBulkCreateHandler
	implements ICommandHandler<TimeSlotBulkCreateCommand> {
	constructor(
		@InjectRepository(TimeLog)
		private readonly timeLogRepository: Repository<TimeLog>,

		@InjectRepository(TimeSlot)
		private readonly timeSlotRepository: Repository<TimeSlot>,

		private readonly commandBus: CommandBus
	) {}

	public async execute(
		command: TimeSlotBulkCreateCommand
	): Promise<TimeSlot[]> {
		let { slots, employeeId, organizationId } = command;

		if (slots.length === 0) {
			return [];
		}

		slots = slots.map((slot) => {
			slot.startedAt = moment.utc(slot.startedAt).toDate();
			return slot;
		});

		const tenantId = RequestContext.currentTenantId();
		const insertedSlots = await this.timeSlotRepository.find({
			where: {
				startedAt: In(_.pluck(slots, 'startedAt')),
				tenantId,
				employeeId
			}
		});

		if (insertedSlots.length > 0) {
			slots = slots.filter(
				(slot) =>
					!insertedSlots.find(
						(insertedSlot) =>
							moment(insertedSlot.startedAt).format(
								'YYYY-MM-DD HH:mm'
							) ===
							moment(slot.startedAt).format('YYYY-MM-DD HH:mm')
					)
			);
		}

		if (slots.length === 0) {
			return [];
		}

		const timeLogs = await this.timeLogRepository.find({
			where: {
				id: In(_.chain(slots).pluck('timeLogId').flatten().value()),
				tenantId
			}
		});

		slots = slots.map((slot) => {
			let timeLogIds: any;
			if (slot.timeLogId instanceof Array) {
				timeLogIds = slot.timeLogId;
			} else {
				timeLogIds = [slot.timeLogId];
			}
			slot.timeLogs = _.where(timeLogs, { id: timeLogIds });

			if (!slot.organizationId) {
				slot.organizationId = organizationId;
			}
			slot.tenantId = tenantId;
			return slot;
		});

		if (slots.length > 0) {
			await this.timeSlotRepository.save(slots);
		}
		slots = insertedSlots.concat(slots);

		const dates = slots.map((slot) => moment(slot.startedAt).toDate());
		const mnDate = dates.reduce(function (a, b) {
			return a < b ? a : b;
		});
		const mxDate = dates.reduce(function (a, b) {
			return a > b ? a : b;
		});
		return await this.commandBus.execute(
			new TimeSlotMergeCommand(employeeId, mnDate, mxDate)
		);
	}
}
