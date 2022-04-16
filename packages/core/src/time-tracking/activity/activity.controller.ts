import {
	Controller,
	UseGuards,
	HttpStatus,
	Get,
	Query,
	Post,
	Body
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IGetActivitiesInput, IBulkActivitiesInput, ReportGroupFilterEnum } from '@gauzy/contracts';
import { TenantPermissionGuard } from './../../shared/guards';
import { ActivityService } from './activity.service';
import { ActivityMapService } from './activity.map.service';

@ApiTags('Activity')
@UseGuards(TenantPermissionGuard)
@Controller()
export class ActivityController {
	constructor(
		private readonly activityService: ActivityService,
		private readonly activityMapService: ActivityMapService
	) {}

	@ApiOperation({ summary: 'Get Activities' })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Get('/')
	async getActivities(@Query() request: IGetActivitiesInput) {
		const defaultParams: Partial<IGetActivitiesInput> = {
			page: 0,
			limit: 30
		};
		request = Object.assign({}, defaultParams, request);
		return this.activityService.getActivities(request);
	}

	@ApiOperation({ summary: 'Get Daily Activities' })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Get('/daily')
	async getDailyActivities(@Query() request: IGetActivitiesInput) {
		return this.activityService.getDailyActivities(request);
	}

	@ApiOperation({ summary: 'Get Daily Activities' })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Get('/report')
	async getDailyActivitiesReport(
		@Query() request: IGetActivitiesInput
	) {
		let activities = await this.activityService.getDailyActivitiesReport(request);

		if (request.groupBy === ReportGroupFilterEnum.date) {
			activities = this.activityMapService.mapByDate(activities);
		} else if (request.groupBy === ReportGroupFilterEnum.employee) {
			activities = this.activityMapService.mapByEmployee(activities);
		} else if (request.groupBy === ReportGroupFilterEnum.project) {
			activities = this.activityMapService.mapByProject(activities);
		}

		return activities;
	}

	@ApiOperation({ summary: 'Save bulk Activities' })
	@ApiResponse({
		status: HttpStatus.BAD_REQUEST,
		description:
			'Invalid input, The response body may contain clues as to what went wrong'
	})
	@Post('/bulk')
	async bulkSaveActivities(@Body() entities: IBulkActivitiesInput) {
		return this.activityService.bulkSave(entities);
	}
}
