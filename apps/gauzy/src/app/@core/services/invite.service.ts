import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	OrganizationProjectsCreateInput,
	OrganizationProjects,
	OrganizationProjectsFindInput,
	CreateEmailInvitesInput,
	Invite,
	CreateEmailInvitesOutput,
	InviteFindInput,
	PublicInviteFindInput
} from '@gauzy/models';
import { first } from 'rxjs/operators';

@Injectable()
export class InviteService {
	constructor(private http: HttpClient) {}

	createWithEmails(
		createInput: CreateEmailInvitesInput
	): Promise<CreateEmailInvitesOutput> {
		return this.http
			.post<CreateEmailInvitesOutput>('/api/invite/emails', createInput)
			.pipe(first())
			.toPromise();
	}

	getAll(
		relations: string[],
		findInput?: InviteFindInput
	): Promise<{ items: Invite[]; total: number }> {
		const data = JSON.stringify({ relations, findInput });

		return this.http
			.get<{ items: Invite[]; total: number }>(`/api/invite/all`, {
				params: { data }
			})
			.pipe(first())
			.toPromise();
	}

	validateInvite(
		relations: string[],
		findInput: PublicInviteFindInput
	): Promise<Invite> {
		const data = JSON.stringify({ relations, findInput });

		return this.http
			.get<Invite>(`/api/invite/validate`, {
				params: { data }
			})
			.pipe(first())
			.toPromise();
	}

	// update(id: string, updateInput: any): Promise<any> {
	// 	return this.http
	// 		.put(`/api/organization-projects/${id}`, updateInput)
	// 		.pipe(first())
	// 		.toPromise();
	// }

	// delete(id: string): Promise<any> {
	// 	return this.http
	// 		.delete(`/api/organization-projects/${id}`)
	// 		.pipe(first())
	// 		.toPromise();
	// }
}
