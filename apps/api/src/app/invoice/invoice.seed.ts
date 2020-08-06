import { Connection } from 'typeorm';
import { Invoice } from './invoice.entity';
import * as faker from 'faker';
import { Tenant } from '../tenant/tenant.entity';
import { Organization } from '../organization/organization.entity';
import { Tag } from '../tags/tag.entity';
import {
	CurrenciesEnum,
	DiscountTaxTypeEnum,
	InvoiceTypeEnum
} from '@gauzy/models';
import { OrganizationContact } from '../organization-contact/organization-contact.entity';

export const createDefaultInvoice = async (
  connection: Connection,
  defaultOrganizations: Organization[],
  noOfInvoicePerOrganization: number
) => {
  let invoices: Invoice[] = [];

  for (const organization of defaultOrganizations) {
    const tags = await connection.manager.find(Tag, {
      where: [{ organization: organization }]
    });
    const OrganizationContacts = await connection.manager.find(OrganizationContact, {
      where: [{ organizationId: organization.id }]
    });
    for (let i = 0; i < noOfInvoicePerOrganization; i++) {
      let invoice = new Invoice();
      // let invoiceItem = faker.random.arrayElement(invoiceItems);
      invoice.tags = [faker.random.arrayElement(tags)];
      invoice.invoiceDate = faker.date.past(0.2);
      invoice.invoiceNumber = faker.random.number({
        min: 1,
        max: 9999999
      });
      invoice.dueDate = faker.date.recent(50);
      invoice.organizationContactId = faker.random.arrayElement(OrganizationContacts).id;
      invoice.toContact = faker.random.arrayElement(OrganizationContacts);
      invoice.currency = faker.random.arrayElement(
        Object.values(CurrenciesEnum)
      );
      invoice.discountValue = faker.random.number({
        min: 1,
        max: 10
      });
      invoice.paid = faker.random.boolean();
      invoice.tax = faker.random.number({ min: 1, max: 10 });
      invoice.tax2 = faker.random.number({ min: 1, max: 10 });
      invoice.terms = 'Term and Setting Applied';
      invoice.isEstimate = faker.random.boolean();
      if (invoice.isEstimate) {
        invoice.isAccepted = faker.random.boolean();
      }
      invoice.discountType = faker.random.arrayElement(
        Object.values(DiscountTaxTypeEnum)
      );
      invoice.taxType = faker.random.arrayElement(
        Object.values(DiscountTaxTypeEnum)
      );
      invoice.tax2Type = faker.random.arrayElement(
        Object.values(DiscountTaxTypeEnum)
      );
      invoice.invoiceType = faker.random.arrayElement(
        Object.values(InvoiceTypeEnum)
      );
      invoice.organizationId = organization.id;
      invoice.status = 'Active';
      invoices.push(invoice);
    }
  }

  await connection.manager.save(invoices);
};

export const createRandomInvoice = async (
	connection: Connection,
	tenants: Tenant[],
	tenantOrganizationsMap: Map<Tenant, Organization[]>,
	noOfInvoicePerOrganization: number
) => {
	let invoices: Invoice[] = [];

	for (const tenant of tenants) {
		let organizations = tenantOrganizationsMap.get(tenant);
		for (const organization of organizations) {
			const tags = await connection.manager.find(Tag, {
				where: [{ organization: organization }]
			});
      const OrganizationContacts = await connection.manager.find(OrganizationContact, {
        where: [{ organizationId: organization.id }]
      });
			for (let i = 0; i < noOfInvoicePerOrganization; i++) {
				let invoice = new Invoice();
				// let invoiceItem = faker.random.arrayElement(invoiceItems);
				invoice.tags = [faker.random.arrayElement(tags)];
				invoice.invoiceDate = faker.date.past(0.2);
				invoice.invoiceNumber = faker.random.number({
					min: 1,
					max: 9999999
				});
				invoice.dueDate = faker.date.recent(50);
        invoice.organizationContactId = faker.random.arrayElement(OrganizationContacts).id;
        invoice.toContact = faker.random.arrayElement(OrganizationContacts);
        invoice.currency = faker.random.arrayElement(
					Object.values(CurrenciesEnum)
				);
				invoice.discountValue = faker.random.number({
					min: 1,
					max: 10
				});
				invoice.paid = faker.random.boolean();
				invoice.tax = faker.random.number({ min: 1, max: 10 });
				invoice.tax2 = faker.random.number({ min: 1, max: 10 });
				invoice.terms = 'Term and Setting Applied';
				invoice.isEstimate = faker.random.boolean();
				if (invoice.isEstimate) {
					invoice.isAccepted = faker.random.boolean();
				}
				invoice.discountType = faker.random.arrayElement(
					Object.values(DiscountTaxTypeEnum)
				);
				invoice.taxType = faker.random.arrayElement(
					Object.values(DiscountTaxTypeEnum)
				);
				invoice.tax2Type = faker.random.arrayElement(
					Object.values(DiscountTaxTypeEnum)
				);
				invoice.invoiceType = faker.random.arrayElement(
					Object.values(InvoiceTypeEnum)
				);
				invoice.organizationId = organization.id;
				invoice.status = 'Active';
				invoices.push(invoice);
			}
		}
	}
	await connection.manager.save(invoices);
};
