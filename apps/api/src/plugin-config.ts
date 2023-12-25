import {
	IPluginConfig,
	DEFAULT_API_PORT,
	DEFAULT_GRAPHQL_API_PATH,
	DEFAULT_API_HOST,
	DEFAULT_API_BASE_URL
} from '@gauzy/common';
import { dbConnectionConfig } from '@gauzy/config';
import * as path from 'path';
import { KnowledgeBasePlugin } from '@gauzy/knowledge-base';
import { ChangelogPlugin } from '@gauzy/changelog';

let assetPath: any;
let assetPublicPath: any;

console.log('Plugin Config -> __dirname: ' + __dirname);
console.log('Plugin Config -> process.cwd: ' + process.cwd());

// TODO: maybe better to use process.cwd() instead of __dirname?

// for Docker
if (__dirname.startsWith('/srv/gauzy')) {
	assetPath = '/srv/gauzy/apps/api/src/assets';
	assetPublicPath = '/srv/gauzy/apps/api/public';
} else {
	assetPath = path.join(path.resolve(__dirname, '../../../', ...['apps', 'api', 'src', 'assets']));

	assetPublicPath = path.join(path.resolve(__dirname, '../../../', ...['apps', 'api', 'public']));
}

console.log('Plugin Config -> assetPath: ' + assetPath);
console.log('Plugin Config -> assetPublicPath: ' + assetPublicPath);

console.log('DB Synchronize: ' + process.env.DB_SYNCHRONIZE);

export const pluginConfig: IPluginConfig = {
	apiConfigOptions: {
		host: process.env.API_HOST || DEFAULT_API_HOST,
		port: process.env.API_PORT || DEFAULT_API_PORT,
		baseUrl: process.env.API_BASE_URL || DEFAULT_API_BASE_URL,
		middleware: [],
		graphqlConfigOptions: {
			path: DEFAULT_GRAPHQL_API_PATH,
			playground: true,
			debug: true,
			apolloServerPlugins: []
		}
	},
	dbConnectionOptions: {
		retryAttempts: 100,
		retryDelay: 3000,
		migrationsTransactionMode: 'each', // Run migrations automatically in each transaction. i.e."all" | "none" | "each"
		migrationsRun: process.env.DB_SYNCHRONIZE === 'true' ? false : true, // Run migrations automatically if we don't do DB_SYNCHRONIZE
		...dbConnectionConfig
	},
	assetOptions: {
		assetPath: assetPath,
		assetPublicPath: assetPublicPath
	},
	plugins: [KnowledgeBasePlugin, ChangelogPlugin]
};
