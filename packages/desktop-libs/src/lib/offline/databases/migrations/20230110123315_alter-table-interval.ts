import { Knex } from 'knex';
import { TABLE_NAME_INTERVALS } from '../../../offline/dto';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable(
		TABLE_NAME_INTERVALS,
		(table: Knex.TableBuilder) => {
			table.string('version').nullable();
		}
	);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable(
		'TABLE_NAME_INTERVALS',
		(table: Knex.TableBuilder) => {
			table.dropColumn('version');
		}
	);
}
