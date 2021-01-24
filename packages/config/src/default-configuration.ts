require('dotenv').config();

import { IPluginConfig } from '@gauzy/common';
import { dbConnectionConfig } from './database';

/**
 * The default configurations.
 */
export const defaultConfiguration: IPluginConfig = {
	apiConfigOptions: {
		hostname: process.env.host || 'http://localhost',
		port: parseInt(process.env.port) || 3000,
		baseUrl: process.env.BASE_URL || 'http://localhost:3000',
		middleware: [],
		graphqlConfigOptions: {
			path: 'graphql',
			playground: true,
			debug: true,
			apolloServerPlugins: []
		}
	},
	dbConnectionOptions: dbConnectionConfig,
	plugins: [],
	authOptions: {
		expressSessionSecret: 'gauzy',
		userPasswordBcryptSaltRounds: 12,
		jwtSecret: 'secretKey'
	}
};
