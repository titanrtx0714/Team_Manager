import { Connection } from 'typeorm';
import { Equipment } from '../equipment/equipment.entity';
import { EquipmentSharing } from './equipment-sharing.entity';
import * as faker from 'faker';
import { Tenant } from '../tenant/tenant.entity';
import { addDays } from 'date-fns';
import { Employee } from '@gauzy/models';
import { OrganizationTeam } from '../organization-team/organization-team.entity';

export const createDefaultEquipmentSharing = async (
  connection: Connection,
  tenant,
  defaultEmployees,
  noOfEquipmentSharingPerTenant: number
): Promise<EquipmentSharing[]> => {
  let equipmentSharings: EquipmentSharing[] = [];
  await connection
    .getRepository(OrganizationTeam)
    .createQueryBuilder()
    .getMany();

    const equipments = await connection.manager.find(Equipment, {
      where: [{ tenant: tenant }]
    });
  equipmentSharings = await dataOperation(connection, equipmentSharings, noOfEquipmentSharingPerTenant, equipments, defaultEmployees, tenant);

  return await connection.manager.save(equipmentSharings);
};

export const createRandomEquipmentSharing = async (
	connection: Connection,
	tenants: Tenant[],
	tenantEmployeeMap: Map<Tenant, Employee[]>,
	noOfEquipmentSharingPerTenant: number
): Promise<EquipmentSharing[]> => {
	let equipmentSharings: EquipmentSharing[] = [];
	await connection
		.getRepository(OrganizationTeam)
		.createQueryBuilder()
		.getMany();

	for (const tenant of tenants) {
		const equipments = await connection.manager.find(Equipment, {
			where: [{ tenant: tenant }]
		});
		const employees = tenantEmployeeMap.get(tenant);
    equipmentSharings = await dataOperation(connection, equipmentSharings, noOfEquipmentSharingPerTenant, equipments, employees, tenant);
	}
	return equipmentSharings
};

const dataOperation = async (connection: Connection, equipmentSharings, noOfEquipmentSharingPerTenant, equipments, employees, tenant)=>{
  for (let i = 0; i < noOfEquipmentSharingPerTenant; i++) {
    let sharing = new EquipmentSharing();
    sharing.equipment = faker.random.arrayElement(equipments);
    sharing.equipmentId = sharing.equipment.id;
    sharing.shareRequestDay = faker.date.recent(30);
    sharing.shareStartDay = faker.date.future(0.5);
    sharing.shareEndDay = addDays(
      sharing.shareStartDay,
      faker.random.number(15)
    );
    sharing.status = faker.random.number({ min: 1, max: 3 });
    // sharing.teams =[faker.random.arrayElement(teams)];
    sharing.employees = [faker.random.arrayElement(employees)];
    sharing.tenant = tenant;
    equipmentSharings.push(sharing);
  }
  await connection.manager.save(equipmentSharings);
  return equipmentSharings;
}
