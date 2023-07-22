import {
	GetReportMenuItemsInput,
	IOrganization,
	IPagination,
	IReport,
	IReportOrganization,
	UpdateReportMenuInput,
} from '@gauzy/contracts';
import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { indexBy } from 'underscore';
import { CrudService } from '../core/crud';
import { ReportOrganization } from './report-organization.entity';
import { Report } from './report.entity';

@Injectable()
export class ReportService extends CrudService<Report> {
	constructor(
		@InjectRepository(Report)
		protected reportRepository: Repository<Report>,

		@InjectRepository(ReportOrganization)
		private reportOrganizationRepository: Repository<ReportOrganization>
	) {
		super(reportRepository);
	}

	private readonly logger = new Logger(ReportService.name);

	public async findAll(filter?: any): Promise<IPagination<Report>> {
		const start = new Date();

		const { items, total } = await super.findAll(filter);

		this.logger.log(`ReportService.findAll find ${total} items`);
		console.log(`ReportService.findAll find ${total} items`);

		const menuItems = await this.getMenuItems({
			organizationId: filter.organizationId,
		});

		this.logger.log(
			`ReportService.getMenuItems find ${menuItems.length} items`
		);

		console.log(
			`ReportService.getMenuItems find ${menuItems.length} items`
		);

		const orgMenuItems = indexBy(menuItems, 'id');

		const mapItems = items.map((item) => {
			if (orgMenuItems[item.id]) {
				item.showInMenu = true;
			} else {
				item.showInMenu = false;
			}
			return item;
		});

		const end = new Date();
		const time = (end.getTime() - start.getTime()) / 1000;

		this.logger.log(`ReportService.findAll took ${time} seconds`);
		console.log(`ReportService.findAll took ${time} seconds`);

		return { items: mapItems, total };
	}

	public getMenuItems(filter: GetReportMenuItemsInput): Promise<Report[]> {
		return this.repository.find({
			join: {
				alias: 'reports',
				innerJoin: {
					reportOrganizations: 'reports.reportOrganizations',
				},
			},
			relationLoadStrategy: 'query',
			relations: {
				reportOrganizations: true,
			},
			where: {
				reportOrganizations: {
					organizationId: filter.organizationId,
					isEnabled: true,
				},
			},
		});
	}

	async updateReportMenu(
		input: UpdateReportMenuInput
	): Promise<ReportOrganization> {
		let reportOrganization =
			await this.reportOrganizationRepository.findOne({
				where: {
					reportId: input.reportId,
				},
			});

		if (!reportOrganization) {
			reportOrganization = new ReportOrganization(input);
		} else {
			reportOrganization = new ReportOrganization(
				Object.assign(reportOrganization, input)
			);
		}

		this.reportOrganizationRepository.save(reportOrganization);
		return reportOrganization;
	}

	/*
	 * Bulk Create Organization Default Reports Menu
	 */
	async bulkCreateOrganizationReport(input: IOrganization) {
		try {
			const { id: organizationId } = input;
			const { items } = await super.findAll();

			const reportOrganizations: IReportOrganization[] = [];
			items.forEach((report: IReport) => {
				reportOrganizations.push(
					new ReportOrganization({
						report,
						organizationId,
					})
				);
			});

			this.reportOrganizationRepository.save(reportOrganizations);
			return reportOrganizations;
		} catch (error) {
			throw new InternalServerErrorException(error);
		}
	}
}
