import { ITask } from '@gauzy/contracts';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { RequestContext } from './../../../core/context';
import { TaskCreateCommand } from './../task-create.command';
import { OrganizationProjectService } from './../../../organization-project/organization-project.service';
import { TaskService } from '../../task.service';
import { OctokitService } from 'octokit/octokit.service';

@CommandHandler(TaskCreateCommand)
export class TaskCreateHandler implements ICommandHandler<TaskCreateCommand> {
	constructor(
		private readonly _taskService: TaskService,
		private readonly _organizationProjectService: OrganizationProjectService,
		private readonly _octokitService: OctokitService
	) {}

	public async execute(command: TaskCreateCommand): Promise<ITask> {
		try {
			const { input } = command;
			const tenantId = RequestContext.currentTenantId() || input.tenantId;

			let { organizationId, project } = input;

			/** If project found then use project name as a task prefix */
			if (input.projectId) {
				const { projectId } = input;
				project =
					await this._organizationProjectService.findOneByIdString(
						projectId
					);
			}

			const projectId = project ? project.id : null;
			const taskPrefix = project ? project.name.substring(0, 3) : null;

			const maxNumber = await this._taskService.getMaxTaskNumberByProject(
				{
					organizationId,
					projectId,
				}
			);

			this._octokitService.createIssue(input.title, input.description);

			return await this._taskService.create({
				...input,
				number: maxNumber + 1,
				prefix: taskPrefix,
				tenantId,
				organizationId,
			});
		} catch (error) {
			console.log('Error while creating task', error?.message);
			throw new BadRequestException(error);
		}
	}
}
