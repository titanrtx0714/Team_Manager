import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first } from 'rxjs/operators';
import { IProductFindInput, IWarehouse } from '@gauzy/contracts';
import { API_PREFIX } from '../constants/app.constants';

@Injectable()
export class WarehouseService {
	WAREHOUSES_URL = `${API_PREFIX}/warehouses`;

	constructor(private http: HttpClient) {}

	getAll(
		relations?: string[],
		findInput?: IProductFindInput
	): Promise<{ items: IWarehouse[] }> {
		const data = JSON.stringify({ relations, findInput });
		return this.http
			.get<{ items: IWarehouse[] }>(`${this.WAREHOUSES_URL}`, {
				params: { data }
			})
			.pipe(first())
			.toPromise();
	}

	create(warehouseRequest: IWarehouse): Promise<IWarehouse> {
		return this.http
			.post<IWarehouse>(`${this.WAREHOUSES_URL}`, warehouseRequest)
			.pipe(first())
			.toPromise();
	}

	getById(id: string, relations?: string[], findInput?: any) {
		const data = JSON.stringify({ relations, findInput });
		return this.http
			.get<IWarehouse>(`${this.WAREHOUSES_URL}/${id}`, {
				params: { data }
			})
			.pipe(first())
			.toPromise();
	}

	deleteFeaturedImage(id: string): Promise<{ raw: any; affected: number }> {
		return this.http
			.delete<{ raw: any; affected: number }>(
				`${this.WAREHOUSES_URL}/${id}`
			)
			.pipe(first())
			.toPromise();
	}
}
