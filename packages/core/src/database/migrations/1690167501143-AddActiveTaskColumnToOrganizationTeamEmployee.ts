import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddActiveTaskColumnToOrganizationTeamEmployee1690167501143
	implements MigrationInterface
{
	name = 'AddActiveTaskColumnToOrganizationTeamEmployee1690167501143';

	/**
	 * Up Migration
	 *
	 * @param queryRunner
	 */
	public async up(queryRunner: QueryRunner): Promise<any> {
		if (queryRunner.connection.options.type === 'sqlite') {
			await this.sqliteUpQueryRunner(queryRunner);
		} else {
			await this.postgresUpQueryRunner(queryRunner);
		}
	}

	/**
	 * Down Migration
	 *
	 * @param queryRunner
	 */
	public async down(queryRunner: QueryRunner): Promise<any> {
		if (queryRunner.connection.options.type === 'sqlite') {
			await this.sqliteDownQueryRunner(queryRunner);
		} else {
			await this.postgresDownQueryRunner(queryRunner);
		}
	}

	/**
	 * PostgresDB Up Migration
	 *
	 * @param queryRunner
	 */
	public async postgresUpQueryRunner(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" ADD "activeTaskId" uuid`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_719aeb37fa7a1dd80d25336a0c" ON "organization_team_employee" ("activeTaskId") `
		);
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" ADD CONSTRAINT "FK_719aeb37fa7a1dd80d25336a0cf" FOREIGN KEY ("activeTaskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
		);
	}

	/**
	 * PostgresDB Down Migration
	 *
	 * @param queryRunner
	 */
	public async postgresDownQueryRunner(
		queryRunner: QueryRunner
	): Promise<any> {
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" DROP CONSTRAINT "FK_719aeb37fa7a1dd80d25336a0cf"`
		);
		await queryRunner.query(
			`DROP INDEX "public"."IDX_719aeb37fa7a1dd80d25336a0c"`
		);
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" DROP COLUMN "activeTaskId"`
		);
	}

	/**
	 * SqliteDB Up Migration
	 *
	 * @param queryRunner
	 */
	public async sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
		await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
		await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
		await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
		await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, "isTrackingEnabled" boolean DEFAULT (1), "activeTaskId" varchar, CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
		);
		await queryRunner.query(
			`INSERT INTO "temporary_organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled" FROM "organization_team_employee"`
		);
		await queryRunner.query(`DROP TABLE "organization_team_employee"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_organization_team_employee" RENAME TO "organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_719aeb37fa7a1dd80d25336a0c" ON "organization_team_employee" ("activeTaskId") `
		);
		await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
		await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
		await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
		await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
		await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
		await queryRunner.query(`DROP INDEX "IDX_719aeb37fa7a1dd80d25336a0c"`);
		await queryRunner.query(
			`CREATE TABLE "temporary_organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, "isTrackingEnabled" boolean DEFAULT (1), "activeTaskId" varchar, CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_719aeb37fa7a1dd80d25336a0cf" FOREIGN KEY ("activeTaskId") REFERENCES "task" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
		);
		await queryRunner.query(
			`INSERT INTO "temporary_organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled", "activeTaskId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled", "activeTaskId" FROM "organization_team_employee"`
		);
		await queryRunner.query(`DROP TABLE "organization_team_employee"`);
		await queryRunner.query(
			`ALTER TABLE "temporary_organization_team_employee" RENAME TO "organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_719aeb37fa7a1dd80d25336a0c" ON "organization_team_employee" ("activeTaskId") `
		);
	}

	/**
	 * SqliteDB Down Migration
	 *
	 * @param queryRunner
	 */
	public async sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(`DROP INDEX "IDX_719aeb37fa7a1dd80d25336a0c"`);
		await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
		await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
		await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
		await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
		await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" RENAME TO "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE TABLE "organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, "isTrackingEnabled" boolean DEFAULT (1), "activeTaskId" varchar, CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
		);
		await queryRunner.query(
			`INSERT INTO "organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled", "activeTaskId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled", "activeTaskId" FROM "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`DROP TABLE "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_719aeb37fa7a1dd80d25336a0c" ON "organization_team_employee" ("activeTaskId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `
		);
		await queryRunner.query(`DROP INDEX "IDX_719aeb37fa7a1dd80d25336a0c"`);
		await queryRunner.query(`DROP INDEX "IDX_ce83034f38496f5fe3f1979697"`);
		await queryRunner.query(`DROP INDEX "IDX_a2a5601d799fbfc29c17b99243"`);
		await queryRunner.query(`DROP INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0"`);
		await queryRunner.query(`DROP INDEX "IDX_d8eba1c0e500c60be1b69c1e77"`);
		await queryRunner.query(`DROP INDEX "IDX_fe12e1b76bbb76209134d9bdc2"`);
		await queryRunner.query(
			`ALTER TABLE "organization_team_employee" RENAME TO "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE TABLE "organization_team_employee" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "organizationTeamId" varchar NOT NULL, "employeeId" varchar NOT NULL, "roleId" varchar, "isTrackingEnabled" boolean DEFAULT (1), CONSTRAINT "FK_fe12e1b76bbb76209134d9bdc2e" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_d8eba1c0e500c60be1b69c1e777" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_8dc83cdd7c519d73afc0d8bdf09" FOREIGN KEY ("organizationTeamId") REFERENCES "organization_team" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_a2a5601d799fbfc29c17b99243f" FOREIGN KEY ("employeeId") REFERENCES "employee" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_ce83034f38496f5fe3f19796977" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`
		);
		await queryRunner.query(
			`INSERT INTO "organization_team_employee"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "organizationTeamId", "employeeId", "roleId", "isTrackingEnabled" FROM "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`DROP TABLE "temporary_organization_team_employee"`
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_ce83034f38496f5fe3f1979697" ON "organization_team_employee" ("roleId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_a2a5601d799fbfc29c17b99243" ON "organization_team_employee" ("employeeId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_8dc83cdd7c519d73afc0d8bdf0" ON "organization_team_employee" ("organizationTeamId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_d8eba1c0e500c60be1b69c1e77" ON "organization_team_employee" ("organizationId") `
		);
		await queryRunner.query(
			`CREATE INDEX "IDX_fe12e1b76bbb76209134d9bdc2" ON "organization_team_employee" ("tenantId") `
		);
	}
}
