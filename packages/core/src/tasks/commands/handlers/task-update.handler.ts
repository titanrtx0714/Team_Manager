import { ITask, ITaskUpdateInput } from '@gauzy/contracts';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskService } from '../../task.service';
import { TaskUpdateCommand } from '../task-update.command';

@CommandHandler(TaskUpdateCommand)
export class TaskUpdateHandler implements ICommandHandler<TaskUpdateCommand> {
	constructor(
		private readonly _taskService: TaskService
	) {}

	public async execute(command: TaskUpdateCommand): Promise<ITask> {
		const { input } = command;
		const { id } = input;
		return await this.updateTask(id, input);
	}

	/*
	 * Update task if already integrated
	 */
	public async updateTask(
		id: string,
		request: ITaskUpdateInput
	): Promise<ITask> {
		try {
			return await this._taskService.create({
				id,
				...request,
			});
		} catch (error) {
			console.log('Error while updating task', error);
		}
	}
}
