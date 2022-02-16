import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, SelectQueryBuilder } from 'typeorm';
import * as moment from 'moment';
import * as _ from 'underscore';
import { IActivity, IScreenshot, ITimeLog } from '@gauzy/contracts';
import { TimeSlotMergeCommand } from '../time-slot-merge.command';
import { Activity, Screenshot, TimeSlot } from './../../../../core/entities/internal';
import { RequestContext } from './../../../../core/context';
import { getDateFormat } from './../../../../core/utils';


@CommandHandler(TimeSlotMergeCommand)
export class TimeSlotMergeHandler
	implements ICommandHandler<TimeSlotMergeCommand> {
	constructor(
		@InjectRepository(TimeSlot)
		private readonly timeSlotRepository: Repository<TimeSlot>
	) {}

	public async execute(command: TimeSlotMergeCommand) {
		let { employeeId, start, end } = command;
		const tenantId = RequestContext.currentTenantId();

		let startMinute = moment(start).utc().get('minute');
		startMinute = startMinute - (startMinute % 10);

		let startDate: any = moment(start)
			.utc()
			.set('minute', startMinute)
			.set('second', 0)
			.set('millisecond', 0);

		let endMinute = moment(end).utc().get('minute');
		endMinute = endMinute - (endMinute % 10);

		let endDate: any = moment(end)
			.utc()
			.set('minute', endMinute + 10)
			.set('second', 0)
			.set('millisecond', 0);

		const { start: startedAt, end: stoppedAt } = getDateFormat(
			startDate,
			endDate
		);
		const timerSlots = await this.timeSlotRepository.find({
			where: (query: SelectQueryBuilder<TimeSlot>) => {
				query.andWhere(`"${query.alias}"."startedAt" >= :startedAt AND "${query.alias}"."startedAt" < :stoppedAt`, {
					startedAt,
					stoppedAt
				});
				query.andWhere(`"${query.alias}"."employeeId" = :employeeId`, {
					employeeId
				});
				query.andWhere(`"${query.alias}"."tenantId" = :tenantId`, {
					tenantId
				});
				query.addOrderBy(`"${query.alias}"."createdAt"`, 'DESC');
			},
			relations: ['timeLogs', 'screenshots', 'activities']
		});

		const createdTimeslots: any = [];
		if (timerSlots.length > 0) {
			const savePromises = _.chain(timerSlots)
				.groupBy((timeSlot) => {
					let date = moment(timeSlot.startedAt);
					const minutes = date.get('minute');
					date = date
						.set('minute', minutes - (minutes % 10))
						.set('second', 0)
						.set('millisecond', 0);
					return date.format('YYYY-MM-DD HH:mm:ss');
				})
				.mapObject(async (timeSlots, slotStart) => {
					const oldTimeslots = JSON.parse(JSON.stringify(timeSlots));
					const [ oldTimeslot ] = oldTimeslots;

					let timeLogs: ITimeLog[] = [];
					let screenshots: IScreenshot[] = [];
					let activities: IActivity[] = [];

					let duration = 0;
					let keyboard = 0;
					let mouse = 0;
					let overall = 0;

					for (const timeSlot of oldTimeslots) {
						duration = duration + parseInt(timeSlot.duration + '', 10);
						keyboard = (keyboard + parseInt(timeSlot.keyboard + '', 10));
						mouse = mouse + parseInt(timeSlot.mouse + '', 10);
						overall = overall + parseInt(timeSlot.overall + '', 10);

						screenshots = screenshots.concat(timeSlot.screenshots);
						timeLogs = timeLogs.concat(timeSlot.timeLogs);
						activities = activities.concat(timeSlot.activities);
					}

					const timeSlotslength = oldTimeslots.filter((item) => item.keyboard !== 0).length;
					overall = Math.round(overall / timeSlotslength || 0);
					keyboard = Math.round(keyboard / timeSlotslength || 0);
					mouse = Math.round(mouse / timeSlotslength || 0);

					const activity = {
						duration: (duration < 0) ? 0 : (duration > 600) ? 600 : duration,
						overall: (overall < 0) ? 0 : (overall > 600) ? 600 : overall,
						keyboard: (keyboard < 0) ? 0 : (keyboard > 600) ? 600 : keyboard,
						mouse: (mouse < 0) ? 0 : (mouse > 600) ? 600 : mouse
					}
					/*
					* Map old screenshots newely created timeslot 
					*/
					screenshots = screenshots.map(
						(item) => new Screenshot(_.omit(item, ['timeSlotId']))
					);

					/*
					* Map old activities newely created timeslot 
					*/
					activities = activities.map(
						(item) => new Activity(_.omit(item, ['timeSlotId']))
					);


					timeLogs = _.uniq(timeLogs, x => x.id);

					const newTimeSlot = new TimeSlot({
						..._.omit(oldTimeslot),
						...activity,
						screenshots,
						activities,
						timeLogs,
						startedAt: moment(slotStart).toDate(),
						tenantId
					});

					await this.timeSlotRepository.save(newTimeSlot);
					createdTimeslots.push(newTimeSlot);

					const ids = _.pluck(oldTimeslots, 'id');
					ids.splice(0, 1);
					console.log('Timeslots Ids Will Be Deleted:', ids);

					if (ids.length > 0) {
						await this.timeSlotRepository.delete({
							id: In(ids)
						});
					}
				})
				.values()
				.value();
			await Promise.all(savePromises);
		}
		return createdTimeslots;
	}
}
