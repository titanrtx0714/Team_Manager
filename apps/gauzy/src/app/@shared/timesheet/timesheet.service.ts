import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
	ITimeLog,
	IGetTimeLogInput,
	IManualTimeInput,
	TimesheetStatus,
	ITimesheet,
	IGetTimesheetInput,
	IGetTimeLogConflictInput,
	IGetTimeSlotInput,
	ITimeSlot
} from '@gauzy/models';
import { toParams } from 'libs/utils';

@Injectable({
	providedIn: 'root'
})
export class TimesheetService {
	interval: any;

	constructor(private http: HttpClient) {}

	addTime(request: IManualTimeInput): Promise<ITimeLog> {
		return this.http
			.post<ITimeLog>('/api/timesheet/time-log', request)
			.toPromise();
	}

	updateTime(
		id: string,
		request: ITimeLog | Partial<ITimeLog>
	): Promise<ITimeLog> {
		return this.http
			.put<ITimeLog>('/api/timesheet/time-log/' + id, request)
			.toPromise();
	}

	checkOverlaps(request: IGetTimeLogConflictInput): Promise<ITimeLog[]> {
		return this.http
			.get<ITimeLog[]>('/api/timesheet/time-log/conflict', {
				params: toParams(request)
			})
			.toPromise();
	}

	getTimeSheet(id: string) {
		return this.http
			.get('/api/timesheet/' + id)
			.toPromise()
			.then((data: ITimesheet) => {
				return data;
			});
	}

	getTimeSheets(request?: IGetTimesheetInput) {
		return this.http
			.get('/api/timesheet', { params: toParams(request) })
			.toPromise()
			.then((data: ITimesheet[]) => {
				return data;
			});
	}

	updateStatus(ids: string | string[], status: TimesheetStatus) {
		return this.http
			.put(`/api/timesheet/status`, { ids, status })
			.toPromise()
			.then((data: any) => {
				return data;
			});
	}

	submitTimeheet(ids: string | string[], status: 'submit' | 'unsubmit') {
		return this.http
			.put(`/api/timesheet/submit`, { ids, status })
			.toPromise()
			.then((data: any) => {
				return data;
			});
	}

	getTimeLogs(request?: IGetTimeLogInput) {
		const params = toParams(request);
		return this.http
			.get<ITimeLog[]>('/api/timesheet/time-log', { params })
			.toPromise();
	}

	getTimeLog(id: string, findOptions) {
		const params = toParams(findOptions);
		return this.http
			.get(`/api/timesheet/time-log/${id}`, { params })
			.toPromise()
			.then((data: ITimeLog) => {
				return data;
			});
	}
	getTimeSlot(id, request?: IGetTimeSlotInput) {
		const params = toParams(request);
		return this.http
			.get<ITimeSlot>(`/api/timesheet/time-slot/${id}`, { params })
			.toPromise();
	}

	getTimeSlots(request?: IGetTimeSlotInput) {
		const params = toParams(request);
		return this.http
			.get<ITimeSlot[]>('/api/timesheet/time-slot', { params })
			.toPromise();
	}

	deleteTimeSlots(ids?: string[]) {
		const params = toParams({ ids });
		return this.http
			.delete('/api/timesheet/time-slot', { params })
			.toPromise();
	}

	deleteLogs(logIds: string | string[]) {
		let payload = new HttpParams();
		if (typeof logIds === 'string') {
			logIds = [logIds];
		}
		logIds.forEach((id: string) => {
			payload = payload.append(`logIds[]`, id);
		});
		return this.http
			.delete('/api/timesheet/time-log', { params: payload })
			.toPromise();
	}
}
