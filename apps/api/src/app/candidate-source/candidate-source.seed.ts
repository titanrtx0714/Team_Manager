import { Connection } from 'typeorm';
import { Candidate, ICandidateSource } from '@gauzy/models';
import { CandidateSource } from './candidate-source.entity';
import { Tenant } from '../tenant/tenant.entity';

const candidateSourceList: ICandidateSource[] = [
	{
		name: 'LinkedIn',
    tenant: {}
	},
	{
		name: 'Indeed',
    tenant: {}
	},
	{
		name: 'Idealist',
    tenant: {}
	},
	{
		name: 'Dice',
    tenant: {}
	},
	{
		name: 'Monster',
    tenant: {}
	}
];

export const createCandidateSources = async (
	connection: Connection,
  tenant: Tenant,
	candidates: Candidate[] | void
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
			candidateId: candidate.id,
			tenant: tenant
		};
		defaultCandidateSources = [...defaultCandidateSources, sources];
	});

	insertCandidateSources(connection, defaultCandidateSources);

	return defaultCandidateSources;
};

export const createRandomCandidateSources = async (
	connection: Connection,
	tenants: Tenant[],
	tenantCandidatesMap: Map<Tenant, Candidate[]> | void
): Promise<Map<Candidate, CandidateSource[]>> => {
	if (!tenantCandidatesMap) {
		console.warn(
			'Warning: tenantCandidatesMap not found, CandidateSources will not be created'
		);
		return;
	}

	let candidateSources = [];
	const candidateSourcesMap: Map<Candidate, CandidateSource[]> = new Map();

	(tenants || []).forEach((tenant) => {
		const candidates = tenantCandidatesMap.get(tenant);

		const rand = Math.floor(Math.random() * candidateSourceList.length);

		(candidates || []).forEach((candidate) => {
			const sources: any = {
				name: candidateSourceList[rand].name,
				candidateId: candidate.id,
        tenant: tenant
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
