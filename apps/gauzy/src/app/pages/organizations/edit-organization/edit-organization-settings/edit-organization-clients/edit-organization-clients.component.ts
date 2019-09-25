import { Component, Input, OnInit } from '@angular/core';
import {
	OrganizationClients,
	OrganizationClientsCreateInput,
	OrganizationProjects
} from '@gauzy/models';
import { OrganizationClientsService } from 'apps/gauzy/src/app/@core/services/organization-clients.service ';
import { OrganizationProjectsService } from 'apps/gauzy/src/app/@core/services/organization-projects.service';

@Component({
	selector: 'ga-edit-org-clients',
	templateUrl: './edit-organization-clients.component.html'
})
export class EditOrganizationClientsComponent implements OnInit {
	@Input()
	organizationId: string;

	showAddCard: boolean;

	clients: OrganizationClients[];

	projects: OrganizationProjects[];

	selectProjects: string[] = [];

	constructor(
		private readonly organizationClientsService: OrganizationClientsService,
		private readonly organizationProjectsService: OrganizationProjectsService
	) {}

	ngOnInit(): void {
		this.loadClients();
	}

	async removeClient(id: string) {
		await this.organizationClientsService.delete(id);

		this.loadClients();
	}

	getSelectProjects(): OrganizationProjects[] {
		return this.selectProjects.map((p) => JSON.parse(p));
	}

	getStringValue(e) {
		return JSON.stringify(e);
	}

	private async addClient(client: OrganizationClientsCreateInput) {
		await this.organizationClientsService.create(client);

		this.showAddCard = !this.showAddCard;
		this.selectProjects = [];
		this.loadClients();
	}

	private async loadClients() {
		const res = await this.organizationClientsService.getAll(['projects'], {
			organizationId: this.organizationId
		});
		if (res) {
			this.clients = res.items;
		}
	}

	private async loadProjects() {
		const res = await this.organizationProjectsService.getAll(['client'], {
			organizationId: this.organizationId,
			client: null
		});

		if (res) {
			this.projects = res.items;
		}
	}
}
