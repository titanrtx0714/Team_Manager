import { Connection } from 'typeorm';
import { IChangelog } from '@gauzy/contracts';
import { Changelog } from './changelog.entity';
import { INITIAL_CHANGELOG_TEMPLATE } from './initial-changelog-template';

export const createChangelog = async (
	connection: Connection
): Promise<IChangelog[]> => {
	return await new Promise<IChangelog[]>(async (resolve, reject) => {
		try {
			const changelogs: IChangelog[] = [];
			const templates: IChangelog[] = INITIAL_CHANGELOG_TEMPLATE;
			for (const item of templates) {
				const changelog: IChangelog = {
					icon: item.icon,
					title: item.title,
					date: item.date,
					content: item.content,
					isFeature: item.isFeature,
					learnMoreUrl: item.learnMoreUrl,
					imageUrl: item.imageUrl
				};
				changelogs.push(changelog);
			}
			await insertChangelog(connection, changelogs);
			resolve(changelogs);
		} catch (err) {
			console.log('Error parsing changelog:', err);
			reject(null);
			return;
		}
	});
};

const insertChangelog = async (
	connection: Connection,
	changelogs: IChangelog[]
): Promise<void> => {
	await connection
		.createQueryBuilder()
		.insert()
		.into(Changelog)
		.values(changelogs)
		.execute();
};
