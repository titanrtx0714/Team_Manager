import { DatabaseProviderContext } from '../../contexts/database-provider-context';
import { IDatabaseProvider } from '../../interfaces/i-database-provider';
import { SqliteProvider } from './sqlite-provider';
import { Knex } from 'knex';
import { PostgresProvider } from './postgres-provider';
import { MysqlProvider } from './mysql-provider';

export class ProviderFactory implements IDatabaseProvider {
	private dbContext: DatabaseProviderContext;

	constructor() {
		this.dbContext = new DatabaseProviderContext();
		this._defineProvider();
		(async () => {
			try {
				await this._migrate();
			} catch (error) {
				console.error('[provider-factory]', error);
			}
		})();
	}

	public get config(): Knex.Config<any> {
		this._defineProvider();
		return this.dbContext.provider.config;
	}

	public get connection(): Knex {
		this._defineProvider();
		return this.dbContext.provider.connection;
	}

	private _defineProvider() {
		switch (this._dialect) {
			case 'postgres':
				this.dbContext.provider = PostgresProvider.instance;
				break;
			case 'mysql':
				this.dbContext.provider = MysqlProvider.instance;
				break;
			default:
				this.dbContext.provider = SqliteProvider.instance;
				break;
		}
	}

	private get _dialect(): string {
		return 'mysql';
	}

	private async _migrate(): Promise<void> {
		const connection = require('knex')(this.config);
		await connection.migrate
			.latest()
			.then(([, log]) => {
				if (!log.length) {
					console.info('Database is already up to date...✅');
				} else {
					console.info('⚓️ Ran migrations: ' + log.join(', '));
					console.log('Migration completed... 💯');
				}
			})
			.catch((error) => console.log('Migration failed... 😞', error))
			.finally(async () => {
				await connection.destroy();
			});
	}
}
