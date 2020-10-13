import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	IAccessTokenSecretPair,
	IAccessTokenDto,
	IAccessToken,
	IEngagement,
	IUpworkApiConfig,
	IIntegrationMap,
	IntegrationEnum
} from '@gauzy/models';

@Injectable({
	providedIn: 'root'
})
export class UpworkService {
	constructor(private http: HttpClient) {}

	uploadTransaction(formData: FormData): Observable<any> {
		return this.http.post(
			'/api/integrations/upwork/transactions',
			formData
		);
	}

	getAccessTokenSecretPair(
		config,
		organizationId: string
	): Observable<IAccessTokenSecretPair> {
		return this.http.post<IAccessTokenSecretPair>(
			`/api/integrations/upwork/token-secret-pair/${organizationId}`,
			config
		);
	}

	getAccessToken(
		accessTokenDto: IAccessTokenDto,
		organizationId: string
	): Observable<IAccessToken> {
		return this.http.post<IAccessToken>(
			`/api/integrations/upwork/access-token/${organizationId}`,
			accessTokenDto
		);
	}

	getContracts(config): Observable<IEngagement[]> {
		const data = JSON.stringify({ config });
		return this.http.get<IEngagement[]>(
			'/api/integrations/upwork/freelancer-contracts',
			{ params: { data } }
		);
	}

	getConfig(integrationId): Observable<IUpworkApiConfig> {
		return this.http.get<IUpworkApiConfig>(
			`/api/integrations/upwork/config/${integrationId}`
		);
	}

	syncContracts(syncContractsDto): Observable<IIntegrationMap[]> {
		return this.http.post<IIntegrationMap[]>(
			`/api/integrations/upwork/sync-contracts`,
			syncContractsDto
		);
	}

	syncContractsRelatedData(dto) {
		return this.http.post<IIntegrationMap[]>(
			`/api/integrations/upwork/sync-contracts-related-data`,
			dto
		);
	}

	getAllReports(dto): Observable<any> {
		const { integrationId, data } = dto;
		return this.http.get<any>(
			`/api/integrations/upwork/report/${integrationId}`,
			{ params: { data } }
		);
	}

	/*
	 * Check remember state for upwork integration
	 */
	checkRemeberState() {
		return this.http.get<any>(
			`/api/integration/check/state/${IntegrationEnum.UPWORK}`
		);
	}
}
