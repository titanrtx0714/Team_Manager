import { Task, ITaskUpdateInput } from '@gauzy/models';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TaskService } from '../../task.service';
import { TaskUpdateCommand } from '../task-update.command';

@CommandHandler(TaskUpdateCommand)
export class TaskUpdateHandler implements ICommandHandler<TaskUpdateCommand> {
	constructor(private readonly _taskService: TaskService) {}

	public async execute(command: TaskUpdateCommand): Promise<Task> {
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
	): Promise<Task> {
		const task = await this._taskService.findOne(id);
		if (task) {
			delete request.id;
			await this._taskService.update(id, request);
			return await this._taskService.findOne(id);
		}

		return task;
	}
}
