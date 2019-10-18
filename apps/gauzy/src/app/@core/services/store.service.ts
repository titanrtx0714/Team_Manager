import { User, Organization, DefaultValueDateTypeEnum } from '@gauzy/models';
import { BehaviorSubject, Subject } from 'rxjs';
import { SelectedEmployee } from '../../@theme/components/header/selectors/employee/employee.component';

export class Store {
	private _selectedOrganization: Organization;
	selectedOrganization$: BehaviorSubject<Organization> = new BehaviorSubject(
		this.selectedOrganization
	);

	private _selectedEmployee: SelectedEmployee;
	selectedEmployee$: BehaviorSubject<SelectedEmployee> = new BehaviorSubject(
		this.selectedEmployee
	);

	private _selectedDate: Date;
	selectedDate$: BehaviorSubject<Date> = new BehaviorSubject(
		this.selectedDate
	);

	get selectedOrganization(): Organization {
		return this._selectedOrganization;
	}

	set selectedEmployee(employee: SelectedEmployee) {
		if (!employee) {
			employee = {
				id: null,
				firstName: 'All Employees',
				lastName: '',
				imageUrl: 'https://i.imgur.com/XwA2T62.jpg'
			};
		}

		this._selectedEmployee = employee;
		this.selectedEmployee$.next(employee);
	}

	get selectedEmployee(): SelectedEmployee {
		return this._selectedEmployee;
	}

	set selectedOrganization(organization: Organization) {
		this.selectedOrganization$.next(organization);
		this.selectedEmployee = null;
		this._selectedOrganization = organization;
	}

	get token(): string | null {
		return localStorage.getItem('token') || null;
	}

	set token(token: string) {
		if (token == null) {
			localStorage.removeItem('token');
		} else {
			localStorage.setItem('token', token);
		}
	}

	get userId(): User['id'] | null {
		return localStorage.getItem('_userId') || null;
	}

	set userId(id: User['id'] | null) {
		if (id == null) {
			localStorage.removeItem('_userId');
		} else {
			localStorage.setItem('_userId', id);
		}
	}

	get selectedDate() {
		return this._selectedDate;
	}

	set selectedDate(date: Date) {
		this._selectedDate = date;
		this.selectedDate$.next(date);
	}

	getDateFromOrganizationSettings() {
		const dateObj = this._selectedDate;

		switch (this.selectedOrganization.defaultValueDateType) {
			case DefaultValueDateTypeEnum.TODAY: {
				return new Date(Date.now());
			}
			case DefaultValueDateTypeEnum.END_OF_MONTH: {
				return new Date(dateObj.getFullYear(), dateObj.getMonth(), 0);
			}
			case DefaultValueDateTypeEnum.START_OF_MONTH: {
				return new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
			}
			default: {
				return new Date(Date.now());
			}
		}
	}

	get serverConnection() {
		return localStorage.getItem('serverConnection');
	}

	set serverConnection(val: string) {
		localStorage.setItem('serverConnection', val);
	}

	clear() {
		localStorage.clear();
	}
}
