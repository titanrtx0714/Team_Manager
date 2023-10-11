import { IRelationalIntegrationTenant } from './integration.model';
import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';

// Common input properties for GitHub app installation and OAuth app installation
interface IGithubAppInstallInputCommon extends IBasePerTenantAndOrganizationEntityModel {
    provider?: string;
}

// Input properties for GitHub app installation
export interface IGithubAppInstallInput extends IGithubAppInstallInputCommon {
    installation_id?: string;
    setup_action?: string;
    state?: string;
}

// Input properties for OAuth app installation
export interface IOAuthAppInstallInput extends IGithubAppInstallInputCommon {
    code?: string;
}


// Represents a GitHub repository
export interface IGithubRepository {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    visibility: string;
    owner?: {
        id: number;
        login: string;
        node_id: string;
    }
    [x: string]: any; // Additional properties
}

// Represents a GitHub issue
export interface IGithubIssue {
    id: number;
    node_id: string;
    number: number;
    title: string;
    state: string;
    body: string;
    [x: string]: any; // Additional properties
}

// Represents a GitHub issue label
export interface IGithubIssueLabel {
    id: number;
    node_id: string;
    url: string;
    name: string;
    color: string;
    default: boolean;
    description: string;
    [x: string]: any; // Additional properties
}

// Response containing GitHub repositories
export interface IGithubRepositoryResponse {
    total_count: number;
    repository_selection: string;
    repositories: IGithubRepository[];
}

// Enum for GitHub property mapping
export enum GithubPropertyMapEnum {
    INSTALLATION_ID = 'installation_id',
    SETUP_ACTION = 'setup_action',
    ACCESS_TOKEN = 'access_token',
    EXPIRES_IN = 'expires_in',
    REFRESH_TOKEN = 'refresh_token',
    REFRESH_TOKEN_EXPIRES_IN = 'refresh_token_expires_in',
    TOKEN_TYPE = 'token_type'
}

/** */
export interface IGithubSyncIssuePayload extends IBasePerTenantAndOrganizationEntityModel {
    issues: IGithubIssue[];
    repository: IGithubRepository;
}
