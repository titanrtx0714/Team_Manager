export interface TimerTO {
	id?: number;
	day?: Date;
	duration?: number;
	employeeId?: number;
	projectId?: string;
	taskId?: string;
	timelogId?: string;
	timesheetId?: string;
	timeslotId?: string;
	startedAt?: Date;
	stoppedAt?: Date;
	synced?: boolean;
	isStartedOffline?: boolean;
	isStoppedOffline?: boolean;
	version?: string;
}

export const TABLE_NAME_TIMERS: string = 'timers';
