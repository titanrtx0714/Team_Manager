
import { MigrationInterface, QueryRunner } from "typeorm";
import * as chalk from "chalk";

export class AddedIntegrationSettingColumnsToTheOrganizationProjectTable1697263211513 implements MigrationInterface {

    name = 'AddedIntegrationSettingColumnsToTheOrganizationProjectTable1697263211513';

    /**
    * Up Migration
    *
    * @param queryRunner
    */
    public async up(queryRunner: QueryRunner): Promise<any> {
        console.log(chalk.yellow(`AddedIntegrationSettingColumnsToTheOrganizationProjectTable1697263211513 start running!`));
        if (['sqlite', 'better-sqlite3'].includes(queryRunner.connection.options.type)) {
            // await this.sqliteUpQueryRunner(queryRunner);
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
        if (['sqlite', 'better-sqlite3'].includes(queryRunner.connection.options.type)) {
            // await this.sqliteDownQueryRunner(queryRunner);
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
        await queryRunner.query(`ALTER TABLE "organization_project" ADD "externalRepositoryId" integer`);
        await queryRunner.query(`ALTER TABLE "organization_project" ADD "isTasksAutoSync" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "organization_project" ADD "isTasksAutoSyncOnLabel" boolean DEFAULT true`);
    }

    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    public async postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "organization_project" DROP COLUMN "isTasksAutoSyncOnLabel"`);
        await queryRunner.query(`ALTER TABLE "organization_project" DROP COLUMN "isTasksAutoSync"`);
        await queryRunner.query(`ALTER TABLE "organization_project" DROP COLUMN "externalRepositoryId"`);
    }

    /**
    * SqliteDB and BetterSQlite3DB Up Migration
    *
    * @param queryRunner
    */
    public async sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_3590135ac2034d7aa88efa7e52"`);
        await queryRunner.query(`DROP INDEX "IDX_18e22d4b569159bb91dec869aa"`);
        await queryRunner.query(`DROP INDEX "IDX_bc1e32c13683dbb16ada1c6da1"`);
        await queryRunner.query(`DROP INDEX "IDX_c210effeb6314d325bc024d21e"`);
        await queryRunner.query(`DROP INDEX "IDX_37215da8dee9503d759adb3538"`);
        await queryRunner.query(`DROP INDEX "IDX_9d8afc1e1e64d4b7d48dd2229d"`);
        await queryRunner.query(`DROP INDEX "IDX_7cf84e8b5775f349f81a1f3cc4"`);
        await queryRunner.query(`DROP INDEX "IDX_063324fdceb51f7086e401ed2c"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_project" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "startDate" datetime, "endDate" datetime, "billing" varchar, "currency" varchar, "public" boolean, "owner" varchar, "taskListType" varchar NOT NULL DEFAULT ('GRID'), "code" varchar, "description" varchar, "color" varchar, "billable" boolean, "billingFlat" boolean, "openSource" boolean, "projectUrl" varchar, "openSourceProjectUrl" varchar, "budget" integer, "budgetType" text DEFAULT ('cost'), "organizationContactId" varchar, "membersCount" integer DEFAULT (0), "imageUrl" varchar(500), "imageId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), "externalRepositoryId" integer, "isTasksAutoSync" boolean DEFAULT (1), "isTasksAutoSyncOnLabel" boolean DEFAULT (1), CONSTRAINT "FK_bc1e32c13683dbb16ada1c6da14" FOREIGN KEY ("organizationContactId") REFERENCES "organization_contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE, CONSTRAINT "FK_9d8afc1e1e64d4b7d48dd2229d7" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_7cf84e8b5775f349f81a1f3cc44" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_063324fdceb51f7086e401ed2c9" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_project"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "startDate", "endDate", "billing", "currency", "public", "owner", "taskListType", "code", "description", "color", "billable", "billingFlat", "openSource", "projectUrl", "openSourceProjectUrl", "budget", "budgetType", "organizationContactId", "membersCount", "imageUrl", "imageId", "isActive", "isArchived") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "startDate", "endDate", "billing", "currency", "public", "owner", "taskListType", "code", "description", "color", "billable", "billingFlat", "openSource", "projectUrl", "openSourceProjectUrl", "budget", "budgetType", "organizationContactId", "membersCount", "imageUrl", "imageId", "isActive", "isArchived" FROM "organization_project"`);
        await queryRunner.query(`DROP TABLE "organization_project"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_project" RENAME TO "organization_project"`);
        await queryRunner.query(`CREATE INDEX "IDX_3590135ac2034d7aa88efa7e52" ON "organization_project" ("isArchived") `);
        await queryRunner.query(`CREATE INDEX "IDX_18e22d4b569159bb91dec869aa" ON "organization_project" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc1e32c13683dbb16ada1c6da1" ON "organization_project" ("organizationContactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c210effeb6314d325bc024d21e" ON "organization_project" ("currency") `);
        await queryRunner.query(`CREATE INDEX "IDX_37215da8dee9503d759adb3538" ON "organization_project" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d8afc1e1e64d4b7d48dd2229d" ON "organization_project" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cf84e8b5775f349f81a1f3cc4" ON "organization_project" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_063324fdceb51f7086e401ed2c" ON "organization_project" ("imageId") `);
    }

    /**
    * SqliteDB and BetterSQlite3DB Down Migration
    *
    * @param queryRunner
    */
    public async sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_063324fdceb51f7086e401ed2c"`);
        await queryRunner.query(`DROP INDEX "IDX_7cf84e8b5775f349f81a1f3cc4"`);
        await queryRunner.query(`DROP INDEX "IDX_9d8afc1e1e64d4b7d48dd2229d"`);
        await queryRunner.query(`DROP INDEX "IDX_37215da8dee9503d759adb3538"`);
        await queryRunner.query(`DROP INDEX "IDX_c210effeb6314d325bc024d21e"`);
        await queryRunner.query(`DROP INDEX "IDX_bc1e32c13683dbb16ada1c6da1"`);
        await queryRunner.query(`DROP INDEX "IDX_18e22d4b569159bb91dec869aa"`);
        await queryRunner.query(`DROP INDEX "IDX_3590135ac2034d7aa88efa7e52"`);
        await queryRunner.query(`ALTER TABLE "organization_project" RENAME TO "temporary_organization_project"`);
        await queryRunner.query(`CREATE TABLE "organization_project" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "startDate" datetime, "endDate" datetime, "billing" varchar, "currency" varchar, "public" boolean, "owner" varchar, "taskListType" varchar NOT NULL DEFAULT ('GRID'), "code" varchar, "description" varchar, "color" varchar, "billable" boolean, "billingFlat" boolean, "openSource" boolean, "projectUrl" varchar, "openSourceProjectUrl" varchar, "budget" integer, "budgetType" text DEFAULT ('cost'), "organizationContactId" varchar, "membersCount" integer DEFAULT (0), "imageUrl" varchar(500), "imageId" varchar, "isActive" boolean DEFAULT (1), "isArchived" boolean DEFAULT (0), CONSTRAINT "FK_bc1e32c13683dbb16ada1c6da14" FOREIGN KEY ("organizationContactId") REFERENCES "organization_contact" ("id") ON DELETE SET NULL ON UPDATE CASCADE, CONSTRAINT "FK_9d8afc1e1e64d4b7d48dd2229d7" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_7cf84e8b5775f349f81a1f3cc44" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_063324fdceb51f7086e401ed2c9" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_project"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "startDate", "endDate", "billing", "currency", "public", "owner", "taskListType", "code", "description", "color", "billable", "billingFlat", "openSource", "projectUrl", "openSourceProjectUrl", "budget", "budgetType", "organizationContactId", "membersCount", "imageUrl", "imageId", "isActive", "isArchived") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "startDate", "endDate", "billing", "currency", "public", "owner", "taskListType", "code", "description", "color", "billable", "billingFlat", "openSource", "projectUrl", "openSourceProjectUrl", "budget", "budgetType", "organizationContactId", "membersCount", "imageUrl", "imageId", "isActive", "isArchived" FROM "temporary_organization_project"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_project"`);
        await queryRunner.query(`CREATE INDEX "IDX_063324fdceb51f7086e401ed2c" ON "organization_project" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cf84e8b5775f349f81a1f3cc4" ON "organization_project" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9d8afc1e1e64d4b7d48dd2229d" ON "organization_project" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_37215da8dee9503d759adb3538" ON "organization_project" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_c210effeb6314d325bc024d21e" ON "organization_project" ("currency") `);
        await queryRunner.query(`CREATE INDEX "IDX_bc1e32c13683dbb16ada1c6da1" ON "organization_project" ("organizationContactId") `);
        await queryRunner.query(`CREATE INDEX "IDX_18e22d4b569159bb91dec869aa" ON "organization_project" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_3590135ac2034d7aa88efa7e52" ON "organization_project" ("isArchived") `);
    }
}
