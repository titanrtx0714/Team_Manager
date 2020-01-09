import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	CreateEmailInvitesInput,
	CreateEmailInvitesOutput,
	Invite,
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

	update(id: string, updateInput: any): Promise<any> {
		return this.http
			.put(`/api/invite/${id}`, updateInput)
			.pipe(first())
			.toPromise();
	}
}
