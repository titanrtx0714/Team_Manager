import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RequestContext } from 'core/context';
import { GithubTaskOpenedCommand } from 'integration/github/commands';
import { TaskCreatedEvent } from '../task-created.event';

// Handles event when new task created
@EventsHandler(TaskCreatedEvent)
export class TaskCreatedEventHandler implements IEventHandler<TaskCreatedEvent> {
    private readonly logger = new Logger('TaskCreatedEvent');

    constructor(
        private readonly _commandBus: CommandBus
    ) { }

    /**
     * Event handler for the `TaskCreatedEvent` event, which responds to the creation of a new task.
     *
     * @param event - The `TaskCreatedEvent` containing information about the newly created task.
     * @returns A promise that resolves to the task after handling the event.
     */
    async handle(event: TaskCreatedEvent) {
        try {
            const { input } = event;
            const { organizationId, projectId } = input;
            const tenantId = RequestContext.currentTenantId() || input.tenantId;

            await this._commandBus.execute(
                new GithubTaskOpenedCommand(input, { tenantId, organizationId, projectId })
            );
        } catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while created of a new task', error.message);
            throw new HttpException(`Error while created of a new task: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
