import { CandidateBulkCreateHandler } from './candidate.bulk.create.handler';
import { CandidateCreateHandler } from './candidate.create.handler';
import { CandidateUpdateHandler } from './candidate.update.handler';

export const CommandHandlers = [
	CandidateBulkCreateHandler,
	CandidateCreateHandler,
	CandidateUpdateHandler
];
