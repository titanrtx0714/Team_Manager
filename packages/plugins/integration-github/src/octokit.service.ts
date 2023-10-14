import { Inject, Injectable, Logger } from '@nestjs/common';
import * as chalk from 'chalk';
import { App } from 'octokit';
import { ResponseHeaders as OctokitResponseHeaders } from "@octokit/types";
import { parseConfig } from './probot.helpers';
import { ModuleProviders, ProbotConfig } from './probot.types';

const GITHUB_API_VERSION = process.env.GAUZY_GITHUB_API_VERSION || '2022-11-28'; // Define a default version

export interface OctokitResponse<T> {
	data: T; // The response data received from the GitHub API.
	status: number; // The HTTP status code of the response (e.g., 200, 404, etc.).
	headers: OctokitResponseHeaders; // The headers included in the response.
	[key: string]: any; // Additional properties may be present depending on the specific response.
}

@Injectable()
export class OctokitService {

	private readonly logger = new Logger('OctokitService');
	private readonly app: InstanceType<typeof App> | undefined;

	constructor(
		@Inject(ModuleProviders.ProbotConfig)
		private readonly config: ProbotConfig
	) {
		/** */
		try {
			if (this.config.appId && this.config.privateKey) {
				const config = parseConfig(this.config);
				this.app = new App({
					appId: config.appId,
					privateKey: config.privateKey,
					clientId: config.clientId,
					clientSecret: config.clientSecret,
				});
				console.log(chalk.magenta(`Octokit App Configuration ${JSON.stringify(config)}`));
			} else {
				console.error(chalk.red(`Octokit App initialization failed: Missing appId or privateKey.`));
			}
		} catch (error) {
			console.error(chalk.red(`Octokit App initialization failed: ${error.message}`));
		}
	}

	/**
	 *
	 * @returns
	 */
	getApp(): InstanceType<typeof App> | undefined {
		return this.app;
	}

	/**
	 * Get GitHub metadata for a specific installation.
	 *
	 * @param installation_id The installation ID for the GitHub App.
	 * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub metadata.
	 * @throws {Error} If the request to fetch metadata fails.
	 */
	public async getInstallationMetadata(installation_id: number): Promise<OctokitResponse<any>> {
		if (!this.app) {
			throw new Error('Octokit instance is not available.');
		}
		try {
			// Get an Octokit instance for the installation
			const octokit = await this.app.getInstallationOctokit(installation_id);

			// Send a request to the GitHub API to get installation metadata
			return await octokit.request('GET /app/installations/{installation_id}', {
				installation_id,
				headers: {
					'X-GitHub-Api-Version': GITHUB_API_VERSION
				}
			});
		} catch (error) {
			this.logger.error('Failed to fetch GitHub installation metadata', error.message);
			throw new Error('Failed to fetch GitHub installation metadata');
		}
	}

	/**
	 * Get GitHub repositories for a specific installation.
	 *
	 * @param installation_id The installation ID for the GitHub App.
	 * @returns {Promise<OctokitResponse<any>>} A promise that resolves with the GitHub repositories.
	 * @throws {Error} If the request to fetch repositories fails.
	 */
	public async getRepositories(installation_id: number): Promise<OctokitResponse<any>> {
		if (!this.app) {
			throw new Error('Octokit instance is not available.');
		}
		try {
			// Get an Octokit instance for the installation
			const octokit = await this.app.getInstallationOctokit(installation_id);

			// Send a request to the GitHub API to get repositories
			return await octokit.request('GET /installation/repositories', {
				installation_id,
				headers: {
					'X-GitHub-Api-Version': GITHUB_API_VERSION
				}
			});
		} catch (error) {
			this.logger.error('Failed to fetch GitHub installation repositories', error.message);
			throw new Error('Failed to fetch GitHub installation repositories');
		}
	}

	/**
	 * Fetch GitHub repository issues for a given installation, owner, and repository.
	 *
	 * @param {number} installation_id - The installation ID for the GitHub app.
	 * @param {Object} options - Options object with 'owner' and 'repo' properties.
	 * @param {string} options.owner - The owner (username or organization) of the repository.
	 * @param {string} options.repo - The name of the repository.
	 * @returns {Promise<OctokitResponse<any>>} A promise that resolves to the response from the GitHub API.
	 * @throws {Error} If the request to the GitHub API fails.
	 */
	public async getRepositoryIssues(installation_id: number, {
		owner,
		repo
	}: {
		owner: string;
		repo: string;
	}): Promise<OctokitResponse<any>> {
		if (!this.app) {
			throw new Error('Octokit instance is not available.');
		}
		try {
			// Get an Octokit instance for the installation
			const octokit = await this.app.getInstallationOctokit(installation_id);

			// Send a request to the GitHub API to get repository issues
			return await octokit.request('GET /repos/{owner}/{repo}/issues', {
				owner: owner,
				repo: repo,
				headers: {
					'X-GitHub-Api-Version': GITHUB_API_VERSION
				}
			});
		} catch (error) {
			this.logger.error('Failed to fetch GitHub installation repository issues', error.message);
			throw new Error('Failed to fetch GitHub installation repository issues');
		}
	}

	/**
	 * Fetch a GitHub repository issue by issue number for a given installation, owner, and repository.
	 *
	 * @param installation_id - The installation ID for the GitHub app.
	 * @param options - Options object with 'owner,' 'repo,' and 'issue_number' properties.
	 * @param options.owner - The owner (username or organization) of the repository.
	 * @param options.repo - The name of the repository.
	 * @param options.issue_number - The issue number to fetch.
	 * @returns A promise that resolves to the response from the GitHub API.
	 * @throws If the request to the GitHub API fails.
	 */
	public async getIssueByIssueNumber(installation_id: number, {
		owner,
		repo,
		issue_number
	}: {
		owner: string;
		repo: string;
		issue_number: number
	}): Promise<OctokitResponse<any>> {
		if (!this.app) {
			throw new Error('Octokit instance is not available.');
		}
		try {
			// Get an Octokit instance for the installation
			const octokit = await this.app.getInstallationOctokit(installation_id);

			return await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
				owner: owner,
				repo: repo,
				issue_number: issue_number,
				headers: {
					'X-GitHub-Api-Version': GITHUB_API_VERSION
				}
			});
		} catch (error) {
			this.logger.error('Failed to fetch GitHub repository issue', error.message);
			throw new Error('Failed to fetch GitHub installation repository issues');
		}
	}

	/**
	 * Fetch labels associated with a GitHub issue using its issue number.
	 *
	 * This function retrieves the labels assigned to a GitHub issue based on its unique issue number. It sends a request
	 * to the GitHub API to fetch label information related to the specified issue in a GitHub repository.
	 *
	 * @param installation_id - The installation ID for the GitHub app.
	 * @param owner - The owner (username or organization) of the GitHub repository.
	 * @param repo - The name of the GitHub repository.
	 * @param issue_number - The unique issue number identifying the GitHub issue.
	 * @returns A promise that resolves to the response from the GitHub API containing labels associated with the issue.
	 * @throws {Error} If the request to the GitHub API fails or if the Octokit instance is unavailable.
	 */
	public async getLabelsByIssueNumber(installation_id: number, {
		owner,
		repo,
		issue_number
	}: {
		owner: string;
		repo: string;
		issue_number: number
	}): Promise<OctokitResponse<any>> {
		if (!this.app) {
			throw new Error('Octokit instance is not available.');
		}
		try {
			// Get an Octokit instance for the installation
			const octokit = await this.app.getInstallationOctokit(installation_id);

			return await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}/labels', {
				owner: owner,
				repo: repo,
				issue_number: issue_number,
				headers: {
					'X-GitHub-Api-Version': GITHUB_API_VERSION
				}
			});
		} catch (error) {
			this.logger.error('Failed to fetch GitHub repository issue', error.message);
			throw new Error('Failed to fetch GitHub installation repository issues');
		}
	}
}
