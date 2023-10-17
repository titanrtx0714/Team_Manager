import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ITask, ITaskUpdateInput } from '@gauzy/contracts';
import { RequestContext } from 'core/context';
import { TaskService } from '../../task.service';
import { TaskUpdateCommand } from '../task-update.command';

@CommandHandler(TaskUpdateCommand)
export class TaskUpdateHandler implements ICommandHandler<TaskUpdateCommand> {
	private readonly logger = new Logger('TaskUpdateHandler');

	constructor(
		private readonly _taskService: TaskService
	) { }

	public async execute(command: TaskUpdateCommand): Promise<ITask> {
		const { id, input } = command;
		return await this.update(id, input);
	}

	/**
	 * Update task, if already exist
	 *
	 * @param id
	 * @param request
	 * @returns
	 */
	public async update(id: string, request: ITaskUpdateInput): Promise<ITask> {
		try {
			const tenantId = RequestContext.currentTenantId() || request.tenantId;
			const task = await this._taskService.findOneByIdString(id);

			if (request.projectId && request.projectId !== task.projectId) {
				const { organizationId, projectId } = task;

				// Get the maximum task number for the project
				const maxNumber = await this._taskService.getMaxTaskNumberByProject({
					tenantId,
					organizationId,
					projectId
				});

				// Update the task with the new project and task number
				await this._taskService.update(id, {
					projectId,
					number: maxNumber + 1
				});
			}

			// Create or update the task with the provided data
			return await this._taskService.create({
				...request,
				id
			});
		} catch (error) {
			this.logger.error(`Error while updating task: ${error.message}`, error.message);
			throw new HttpException({ message: error?.message, error }, HttpStatus.BAD_REQUEST);
		}
	}

}
