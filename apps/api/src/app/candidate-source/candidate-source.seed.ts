import { Connection } from 'typeorm';
import { ICandidate, ICandidateSource } from '@gauzy/models';
import { CandidateSource } from './candidate-source.entity';
import { Tenant } from '../tenant/tenant.entity';

const candidateSourceList: ICandidateSource[] = [
	{
		name: 'LinkedIn'
	},
	{
		name: 'Indeed'
	},
	{
		name: 'Idealist'
	},
	{
		name: 'Dice'
	},
	{
		name: 'Monster'
	}
];

export const createCandidateSources = async (
	connection: Connection,
	candidates: ICandidate[] | void
): Promise<CandidateSource[]> => {
	if (!candidates) {
		console.warn(
			'Warning: candidates not found, CandidateSources will not be created'
		);
		return;
	}

	let defaultCandidateSources = [];

	candidates.forEach((candidate) => {
		const rand = Math.floor(Math.random() * candidateSourceList.length);
		const sources = {
			name: candidateSourceList[rand].name,
			candidateId: candidate.id
		};
		defaultCandidateSources = [...defaultCandidateSources, sources];
	});

	insertCandidateSources(connection, defaultCandidateSources);

	return defaultCandidateSources;
};

export const createRandomCandidateSources = async (
	connection: Connection,
	tenants: Tenant[],
	tenantCandidatesMap: Map<Tenant, ICandidate[]> | void
): Promise<Map<ICandidate, CandidateSource[]>> => {
	if (!tenantCandidatesMap) {
		console.warn(
			'Warning: tenantCandidatesMap not found, CandidateSources will not be created'
		);
		return;
	}

	let candidateSources = [];
	const candidateSourcesMap: Map<ICandidate, CandidateSource[]> = new Map();

	(tenants || []).forEach((tenant) => {
		const candidates = tenantCandidatesMap.get(tenant);

		const rand = Math.floor(Math.random() * candidateSourceList.length);

		(candidates || []).forEach((candidate) => {
			const sources: any = {
				name: candidateSourceList[rand].name,
				candidateId: candidate.id
			};

			candidateSourcesMap.set(candidate, sources);
			candidateSources = [...candidateSources, sources];
		});
	});

	await insertCandidateSources(connection, candidateSources);

	return candidateSourcesMap;
};

const insertCandidateSources = async (
	connection: Connection,
	candidateSources: CandidateSource[]
) => {
	await connection
		.createQueryBuilder()
		.insert()
		.into(CandidateSource)
		.values(candidateSources)
		.execute();
};
