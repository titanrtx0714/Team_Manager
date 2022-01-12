import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	IEmployee,
	IEmployeeFindInput,
	IEmployeeCreateInput,
	IEmployeeUpdateInput
} from '@gauzy/contracts';
import { firstValueFrom, Observable } from 'rxjs';
import { toParams } from '@gauzy/common-angular';
import { API_PREFIX } from '../constants/app.constants';

@Injectable()
export class EmployeesService {
	constructor(private http: HttpClient) {}

	getAllPublic(
		relations?: string[],
		findInput?: IEmployeeFindInput
	): Observable<{ items: IEmployee[]; total: number }> {
		const data = JSON.stringify({ relations, findInput });
		return this.http.get<{ items: IEmployee[]; total: number }>(
			`${API_PREFIX}/employee/public`,
			{
				params: { data }
			}
		);
	}

	getPublicById(id: string, relations?: string[]): Observable<IEmployee> {
		const data = JSON.stringify({ relations });
		return this.http.get<IEmployee>(`${API_PREFIX}/employee/public/${id}`, {
			params: { data }
		});
	}

	getAll(
		relations?: string[],
		findInput?: IEmployeeFindInput
	): Observable<{ items: IEmployee[]; total: number }> {
		const data = JSON.stringify({ relations, findInput });
		return this.http.get<{ items: IEmployee[]; total: number }>(
			`${API_PREFIX}/employee`,
			{
				params: { data }
			}
		);
	}

	getWorking(
		organizationId: string,
		tenantId: string,
		forMonth: Date,
		withUser: boolean
	): Promise<{ items: IEmployee[]; total: number }> {
		const query = {
			organizationId,
			tenantId,
			forMonth,
			withUser
		};
		const data = JSON.stringify({ findInput: query });
		return firstValueFrom(
			this.http.get<{ items: IEmployee[]; total: number }>(
				`${API_PREFIX}/employee/working`,
				{
					params: { data }
				}
			)
		);
	}

	getWorkingCount(
		organizationId: string,
		tenantId: string,
		forMonth: Date,
		withUser: boolean
	): Promise<{ total: number }> {
		const query = {
			organizationId,
			tenantId,
			forMonth,
			withUser
		};
		const data = JSON.stringify({ findInput: query });
		return firstValueFrom(
			this.http.get<{ items: IEmployee[]; total: number }>( `${API_PREFIX}/employee/working/count`, {
				params: { data}
			})
		);
	}

	getEmployeeByUserId(
		userId: string,
		relations?: string[],
		findInput?: IEmployeeFindInput
	): Promise<{
		success: boolean;
		result: IEmployee;
	}> {
		const data = JSON.stringify({ relations, findInput });
		return firstValueFrom(
			this.http.get<{ success: boolean; result: IEmployee; }>(`${API_PREFIX}/employee/user/${userId}`, {
				params: { data }
			})
		);
	}

	getEmployeeById(id: string, relations?: string[], useTenant?: boolean) {
		const data = JSON.stringify({ relations, useTenant });
		return firstValueFrom(
			this.http.get<IEmployee>(`${API_PREFIX}/employee/${id}`, {
				params: { data }
			})
		);
	}

	setEmployeeAsInactive(id: string): Promise<IEmployee> {
		return firstValueFrom(
			this.http.put<IEmployee>(`${API_PREFIX}/employee/${id}`, {
				isActive: false
			})
		);
	}

	setEmployeeAsActive(id: string): Promise<IEmployee> {
		return firstValueFrom(
			this.http.put<IEmployee>(`${API_PREFIX}/employee/${id}`, {
				isActive: true
			})
		);
	}

	setEmployeeEndWork(id: string, date: Date): Promise<IEmployee> {
		return firstValueFrom(
			this.http.put<IEmployee>(`${API_PREFIX}/employee/${id}`, {
				endWork: date
			})
		);
	}

	update(id: string, updateInput: IEmployeeUpdateInput): Promise<any> {
		return firstValueFrom(
			this.http.put(`${API_PREFIX}/employee/${id}`, updateInput)
		);
	}

	getEmployeeJobsStatistics(request): Promise<any> {
		return firstValueFrom(
			this.http.get(`${API_PREFIX}/employee/job-statistics`, {
				params: toParams(request)
			})
		);
	}

	updateJobSearchStatus(
		id: string,
		isJobSearchActive: boolean
	) {
		return firstValueFrom(
			this.http.put(`${API_PREFIX}/employee/${id}/job-search-status`, {
				isJobSearchActive
			})
		);
	}

	create(createInput: IEmployeeCreateInput): Observable<IEmployee> {
		return this.http.post<IEmployee>(
			`${API_PREFIX}/employee`,
			createInput
		);
	}

	createBulk(createInput: IEmployeeCreateInput[]): Observable<IEmployee[]> {
		return this.http.post<IEmployee[]>(
			`${API_PREFIX}/employee/bulk`,
			createInput
		);
	}
}
