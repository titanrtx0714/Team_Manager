import {
	Controller,
	HttpStatus,
	Get,
	Query,
	UseGuards,
	Post,
	Body,
	Param,
	Delete
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
	IEmployeePresetInput,
	IGetJobPresetCriterionInput,
	IGetJobPresetInput,
	IJobPreset,
	IMatchingCriterions
} from '@gauzy/models';
import { JobPresetService } from './job-preset.service';
import { JobPreset } from './job-preset.entity';
import { JobPresetUpworkJobSearchCriterion } from './job-preset-upwork-job-search-criterion.entity';
import { EmployeeUpworkJobsSearchCriterion } from './employee-upwork-jobs-search-criterion.entity';

@ApiTags('EmployeeJobPreset')
@UseGuards(AuthGuard('jwt'))
@Controller()
export class EmployeeJobPresetController {
	constructor(private readonly jobPresetService: JobPresetService) {}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get()
	async getAll(@Query() data: IGetJobPresetInput) {
		return this.jobPresetService.getAll(data);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get(':id')
	async get(
		@Param('id') presetId: string,
		@Query() request: IGetJobPresetCriterionInput
	) {
		return this.jobPresetService.get(presetId, request);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Post(':id/criterion')
	async saveUpdate(
		@Param('id') jobPresetId: string,
		@Body() request: IMatchingCriterions
	) {
		return this.jobPresetService.saveCriterion({ ...request, jobPresetId });
	}

	@ApiOperation({ summary: 'Save Employee preset' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('employee/:id')
	async getEmployeePreset(@Param('id') employeeId: string) {
		return this.jobPresetService.getEmployeePreset(employeeId);
	}

	@ApiOperation({ summary: 'Save Employee preset' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Post('employee')
	async saveEmployeePreset(@Body() request: IEmployeePresetInput) {
		return this.jobPresetService.saveEmployeePreset(request);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPreset
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Delete('criterion/:id')
	async delete(@Param() creationId: string, @Query() request) {
		return this.jobPresetService.deleteCriterion(creationId, request);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: JobPresetUpworkJobSearchCriterion
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get(':id/criterion')
	async getJobPresetCriterion(@Param('id') presetId: string) {
		return this.jobPresetService.getJobPresetCriterion(presetId);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: EmployeeUpworkJobsSearchCriterion
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Get('employee')
	async getJobPresetEmployeeCriterion(
		@Query() { employeeId, presetId }: IGetJobPresetCriterionInput
	) {
		return this.jobPresetService.getJobPresetEmployeeCriterion(
			presetId,
			employeeId
		);
	}

	@ApiOperation({ summary: 'Find all employee job posts' })
	@ApiResponse({
		status: HttpStatus.OK,
		description: 'Found employee job preset',
		type: EmployeeUpworkJobsSearchCriterion
	})
	@ApiResponse({
		status: HttpStatus.NOT_FOUND,
		description: 'Record not found'
	})
	@Post()
	async createJobPreset(@Body() request: IJobPreset) {
		return this.jobPresetService.createJobPreset(request);
	}
}
