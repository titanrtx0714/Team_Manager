import { FileStorageProviderEnum, ITenant } from "@gauzy/contracts";
import { TenantSetting } from "core";
import { Connection } from "typeorm";
import { environment } from "@gauzy/config";

export const createDefaultTenantSetting = async (
	connection: Connection,
	tenants: ITenant[]
): Promise<TenantSetting[]> => {
	try {
		const settings: TenantSetting[] = [];
		for await (const tenant of tenants) {
			const setting = new TenantSetting();
            setting.name = 'fileStorageProvider';
            setting.value = environment.fileSystem.name || FileStorageProviderEnum.LOCAL;
            setting.tenant = tenant;
            settings.push(setting);
		}
		return await connection.manager.save(settings);
	} catch (error) {
		console.log({error})
	}
};