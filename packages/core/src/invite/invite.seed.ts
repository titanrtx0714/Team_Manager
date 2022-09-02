import { DataSource } from 'typeorm';
import { faker } from '@ever-co/faker';
import { InviteStatusEnum, IOrganization, ITenant, IUser } from '@gauzy/contracts';
import { sign } from 'jsonwebtoken';
import { environment as env } from '@gauzy/config';
import * as moment from 'moment';
import { Invite } from './invite.entity';
import { Role } from './../core/entities/internal';

export const createDefaultEmployeeInviteSent = async (
	dataSource: DataSource,
	tenant: ITenant,
	organizations: IOrganization[],
	SuperAdmin: IUser[]
): Promise<any> => {
	const totalInvites: Invite[] = [];
	const invitationStatus = Object.values(InviteStatusEnum);
	const { id: tenantId } = tenant;
	const roles = await dataSource.manager.findBy(Role, {
		tenantId
	});
	organizations.forEach((organization: IOrganization) => {
		for (let i = 0; i < 10; i++) {
			const invitee = new Invite();
			invitee.email = faker.internet.exampleEmail();
			invitee.expireDate = faker.date.between(
				new Date(),
				moment(new Date()).add(30, 'days').toDate()
			);
			invitee.invitedBy = faker.random.arrayElement(SuperAdmin);
			invitee.organizationId = organization.id;
			invitee.role = faker.random.arrayElement(roles);
			invitee.status = faker.random.arrayElement(invitationStatus);
			invitee.token = createToken(invitee.email);
			invitee.tenant = tenant;
			totalInvites.push(invitee);
		}
	});
	await dataSource.manager.save(totalInvites);
};

export const createRandomEmployeeInviteSent = async (
	dataSource: DataSource,
	tenants: ITenant[],
	tenantOrganizationsMap: Map<ITenant, IOrganization[]>,
	tenantSuperAdminMap: Map<ITenant, IUser[]>,
	noOfInvitesPerOrganization: number
): Promise<any> => {
	const totalInvites: Invite[] = [];
	const invitationStatus = Object.values(InviteStatusEnum);

	for (const tenant of tenants) {
		const { id: tenantId } = tenant;
		const roles = await dataSource.manager.findBy(Role, {
			tenantId
		});
		const organizations = tenantOrganizationsMap.get(tenant);
		const admins = tenantSuperAdminMap.get(tenant);
		organizations.forEach((organization: IOrganization) => {
			for (let i = 0; i < noOfInvitesPerOrganization; i++) {
				const invitee = new Invite();
				invitee.email = faker.internet.exampleEmail();
				invitee.expireDate = faker.date.between(
					new Date(),
					moment(new Date()).add(30, 'days').toDate()
				);
				invitee.invitedBy = faker.random.arrayElement(admins);
				invitee.organizationId = organization.id;
				invitee.role = faker.random.arrayElement(roles);
				invitee.status = faker.random.arrayElement(invitationStatus);
				invitee.token = createToken(invitee.email);
				invitee.tenant = tenant;
				totalInvites.push(invitee);
			}
		});
	}
	await dataSource.manager.save(totalInvites);
};

function createToken(email: string): string {
	const token: string = sign({ email }, env.JWT_SECRET, {});
	return token;
}
