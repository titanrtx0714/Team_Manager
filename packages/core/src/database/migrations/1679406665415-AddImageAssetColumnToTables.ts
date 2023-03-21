
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageAssetColumnToTables1679406665415 implements MigrationInterface {

    name = 'AddImageAssetColumnToTables1679406665415';

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
        await queryRunner.query(`ALTER TABLE "organization_team" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD "imageId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD "imageId" uuid`);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e028298e103e1694147ada69e" ON "user" ("imageId") `);
        await queryRunner.query(`ALTER TABLE "organization_team" ADD CONSTRAINT "FK_51e91be110fa0b8e70066f5727f" FOREIGN KEY ("imageId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tenant" ADD CONSTRAINT "FK_d154d06dac0d0e0a5d9a083e253" FOREIGN KEY ("imageId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_5e028298e103e1694147ada69e5" FOREIGN KEY ("imageId") REFERENCES "image_asset"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    /**
    * PostgresDB Down Migration
    *
    * @param queryRunner
    */
    public async postgresDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_5e028298e103e1694147ada69e5"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP CONSTRAINT "FK_d154d06dac0d0e0a5d9a083e253"`);
        await queryRunner.query(`ALTER TABLE "organization_team" DROP CONSTRAINT "FK_51e91be110fa0b8e70066f5727f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e028298e103e1694147ada69e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "organization_team" DROP COLUMN "imageId"`);
    }

    /**
    * SqliteDB Up Migration
    *
    * @param queryRunner
    */
    public async sqliteUpQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, "imageId" varchar, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo" FROM "organization_team"`);
        await queryRunner.query(`DROP TABLE "organization_team"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_team" RENAME TO "organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`CREATE TABLE "temporary_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar, "imageId" varchar)`);
        await queryRunner.query(`INSERT INTO "temporary_tenant"("id", "createdAt", "updatedAt", "name", "logo") SELECT "id", "createdAt", "updatedAt", "name", "logo" FROM "tenant"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_tenant" RENAME TO "tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`DROP INDEX "IDX_f2578043e491921209f5dadd08"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, "emailVerifiedAt" datetime, "emailToken" varchar, "phoneNumber" varchar, "timeZone" varchar, "imageId" varchar, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e028298e103e1694147ada69e" ON "user" ("imageId") `);
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`DROP INDEX "IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`CREATE TABLE "temporary_organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, "imageId" varchar, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION, CONSTRAINT "FK_51e91be110fa0b8e70066f5727f" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId" FROM "organization_team"`);
        await queryRunner.query(`DROP TABLE "organization_team"`);
        await queryRunner.query(`ALTER TABLE "temporary_organization_team" RENAME TO "organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`DROP INDEX "IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`CREATE TABLE "temporary_tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar, "imageId" varchar, CONSTRAINT "FK_d154d06dac0d0e0a5d9a083e253" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tenant"("id", "createdAt", "updatedAt", "name", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "name", "logo", "imageId" FROM "tenant"`);
        await queryRunner.query(`DROP TABLE "tenant"`);
        await queryRunner.query(`ALTER TABLE "temporary_tenant" RENAME TO "tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`DROP INDEX "IDX_f2578043e491921209f5dadd08"`);
        await queryRunner.query(`DROP INDEX "IDX_5e028298e103e1694147ada69e"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, "emailVerifiedAt" datetime, "emailToken" varchar, "phoneNumber" varchar, "timeZone" varchar, "imageId" varchar, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_5e028298e103e1694147ada69e5" FOREIGN KEY ("imageId") REFERENCES "image_asset" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone", "imageId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e028298e103e1694147ada69e" ON "user" ("imageId") `);
    }

    /**
    * SqliteDB Down Migration
    *
    * @param queryRunner
    */
    public async sqliteDownQueryRunner(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_5e028298e103e1694147ada69e"`);
        await queryRunner.query(`DROP INDEX "IDX_f2578043e491921209f5dadd08"`);
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, "emailVerifiedAt" datetime, "emailToken" varchar, "phoneNumber" varchar, "timeZone" varchar, "imageId" varchar, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone", "imageId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_5e028298e103e1694147ada69e" ON "user" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME TO "temporary_tenant"`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar, "imageId" varchar)`);
        await queryRunner.query(`INSERT INTO "tenant"("id", "createdAt", "updatedAt", "name", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "name", "logo", "imageId" FROM "temporary_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_d154d06dac0d0e0a5d9a083e25" ON "tenant" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`DROP INDEX "IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`ALTER TABLE "organization_team" RENAME TO "temporary_organization_team"`);
        await queryRunner.query(`CREATE TABLE "organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, "imageId" varchar, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo", "imageId" FROM "temporary_organization_team"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_51e91be110fa0b8e70066f5727" ON "organization_team" ("imageId") `);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
        await queryRunner.query(`DROP INDEX "IDX_5e028298e103e1694147ada69e"`);
        await queryRunner.query(`DROP INDEX "IDX_d154d06dac0d0e0a5d9a083e25"`);
        await queryRunner.query(`DROP INDEX "IDX_51e91be110fa0b8e70066f5727"`);
        await queryRunner.query(`DROP INDEX "IDX_f2578043e491921209f5dadd08"`);
        await queryRunner.query(`DROP INDEX "IDX_c28e52f758e7bbc53828db9219"`);
        await queryRunner.query(`DROP INDEX "IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "IDX_f0e1b4ecdca13b177e2e3a0613"`);
        await queryRunner.query(`DROP INDEX "IDX_58e4dbff0e1a32a9bdc861bb29"`);
        await queryRunner.query(`DROP INDEX "IDX_19de43e9f1842360ce646253d7"`);
        await queryRunner.query(`DROP INDEX "IDX_685bf353c85f23b6f848e4dcde"`);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "thirdPartyId" varchar, "firstName" varchar, "lastName" varchar, "email" varchar, "username" varchar, "hash" varchar, "imageUrl" varchar(500), "preferredLanguage" varchar DEFAULT ('en'), "preferredComponentLayout" varchar CHECK( "preferredComponentLayout" IN ('CARDS_GRID','TABLE') ) DEFAULT ('TABLE'), "roleId" varchar, "refreshToken" varchar, "isActive" boolean DEFAULT (1), "code" integer, "codeExpireAt" datetime, "emailVerifiedAt" datetime, "emailToken" varchar, "phoneNumber" varchar, "timeZone" varchar, CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "user"("id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone") SELECT "id", "createdAt", "updatedAt", "tenantId", "thirdPartyId", "firstName", "lastName", "email", "username", "hash", "imageUrl", "preferredLanguage", "preferredComponentLayout", "roleId", "refreshToken", "isActive", "code", "codeExpireAt", "emailVerifiedAt", "emailToken", "phoneNumber", "timeZone" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_f2578043e491921209f5dadd08" ON "user" ("phoneNumber") `);
        await queryRunner.query(`CREATE INDEX "IDX_c28e52f758e7bbc53828db9219" ON "user" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `);
        await queryRunner.query(`CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `);
        await queryRunner.query(`CREATE INDEX "IDX_19de43e9f1842360ce646253d7" ON "user" ("thirdPartyId") `);
        await queryRunner.query(`CREATE INDEX "IDX_685bf353c85f23b6f848e4dcde" ON "user" ("tenantId") `);
        await queryRunner.query(`DROP INDEX "IDX_56211336b5ff35fd944f225917"`);
        await queryRunner.query(`ALTER TABLE "tenant" RENAME TO "temporary_tenant"`);
        await queryRunner.query(`CREATE TABLE "tenant" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "name" varchar NOT NULL, "logo" varchar)`);
        await queryRunner.query(`INSERT INTO "tenant"("id", "createdAt", "updatedAt", "name", "logo") SELECT "id", "createdAt", "updatedAt", "name", "logo" FROM "temporary_tenant"`);
        await queryRunner.query(`DROP TABLE "temporary_tenant"`);
        await queryRunner.query(`CREATE INDEX "IDX_56211336b5ff35fd944f225917" ON "tenant" ("name") `);
        await queryRunner.query(`DROP INDEX "IDX_da625f694eb1e23e585f301008"`);
        await queryRunner.query(`DROP INDEX "IDX_103ae3eb65f4b091efc55cb532"`);
        await queryRunner.query(`DROP INDEX "IDX_eef1c19a0cb5321223cfe3286c"`);
        await queryRunner.query(`DROP INDEX "IDX_176f5ed3c4534f3110d423d569"`);
        await queryRunner.query(`DROP INDEX "IDX_e22ab0f1236b1a07785b641727"`);
        await queryRunner.query(`ALTER TABLE "organization_team" RENAME TO "temporary_organization_team"`);
        await queryRunner.query(`CREATE TABLE "organization_team" ("id" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "tenantId" varchar, "organizationId" varchar, "name" varchar NOT NULL, "prefix" varchar, "createdById" varchar, "public" boolean DEFAULT (0), "profile_link" varchar, "logo" varchar, CONSTRAINT "FK_176f5ed3c4534f3110d423d5690" FOREIGN KEY ("tenantId") REFERENCES "tenant" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_eef1c19a0cb5321223cfe3286c4" FOREIGN KEY ("organizationId") REFERENCES "organization" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_da625f694eb1e23e585f3010082" FOREIGN KEY ("createdById") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "organization_team"("id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo") SELECT "id", "createdAt", "updatedAt", "tenantId", "organizationId", "name", "prefix", "createdById", "public", "profile_link", "logo" FROM "temporary_organization_team"`);
        await queryRunner.query(`DROP TABLE "temporary_organization_team"`);
        await queryRunner.query(`CREATE INDEX "IDX_da625f694eb1e23e585f301008" ON "organization_team" ("createdById") `);
        await queryRunner.query(`CREATE INDEX "IDX_103ae3eb65f4b091efc55cb532" ON "organization_team" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_eef1c19a0cb5321223cfe3286c" ON "organization_team" ("organizationId") `);
        await queryRunner.query(`CREATE INDEX "IDX_176f5ed3c4534f3110d423d569" ON "organization_team" ("tenantId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e22ab0f1236b1a07785b641727" ON "organization_team" ("profile_link") `);
    }
}
