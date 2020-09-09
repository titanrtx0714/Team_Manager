import { IHelpCenterArticle } from './help-center-article.model';
import { BaseEntityModel as IBaseEntityModel } from './base-entity.model';
import { Organization } from './organization.model';
import { ITenant } from './tenant.model';

export interface IHelpCenter extends IBaseEntityModel {
	name: string;
	icon: string;
	flag: string;
	privacy: string;
	language: string;
	color: string;
	description?: string;
	data?: string;
	index: number;
	children?: IHelpCenter[];
	parent?: IHelpCenter;
	article?: IHelpCenterArticle[];
	parentId?: string;
	organizationId?: string;
	organization?: Organization;
	tenant?: ITenant;
	tenantId?: string;
}
