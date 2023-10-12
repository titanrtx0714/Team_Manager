import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { IIntegrationSyncedRepositoryFindInput, IIntegrationTenant, IPagination } from '@gauzy/contracts';
import { toParams } from '@gauzy/common-angular';
import { API_PREFIX } from '../../constants';

@Injectable({
    providedIn: 'root'
})
export class IntegrationTenantService {

    constructor(
        private readonly _http: HttpClient
    ) { }

    /**
      * Get a list of IntegrationTenant entities based on specified criteria and optional relations.
      *
      * @param where - The criteria to filter IntegrationTenant entities.
      * @param relations - Optional relations to include in the response.
      * @returns An Observable of IPagination<IIntegrationTenant>.
      */
    getAll(
        where: IIntegrationSyncedRepositoryFindInput,
        relations: string[] = []
    ): Observable<IPagination<IIntegrationTenant>> {
        const url = `${API_PREFIX}/integration-tenant`;
        const params = toParams({ where, relations }); // Include relations in the parameters

        return this._http.get<IPagination<IIntegrationTenant>>(url, { params });
    }
}
